import { NextResponse } from "next/server";

// Piston API for isolated code execution. Falls back to a local evaluator
// when Piston is unreachable (demo/dev mode).

const PISTON_URL =
  process.env.PISTON_URL ?? "https://emkc.org/api/v2/piston/execute";

type TestCase = {
  input: unknown;
  expected: unknown;
};

const normalize = (value: unknown) => {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

const normalizeExpected = (value: unknown) => {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

const runPiston = async ({
  language,
  source,
  stdin,
}: {
  language: string;
  source: string;
  stdin: string;
}) => {
  const response = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language,
      version: "*",
      files: [{ content: source }],
      stdin,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Piston returned ${response.status}`);
  }

  const data = await response.json();
  return {
    stdout: data.run?.stdout ?? "",
    stderr: data.run?.stderr ?? "",
    output: data.run?.output ?? "",
  };
};

// Local evaluator: interprets the returned JSON so the arena works without
// Piston connectivity during development.
const evaluateLocally = ({
  source,
  testCases,
}: {
  source: string;
  testCases: TestCase[];
}) => {
  const results: { passed: boolean; input: unknown; expected: unknown; actual: unknown }[] = [];

  for (const test of testCases) {
    try {
      // The source defines a named function (e.g. `function twoSum(...) {...}`).
      // Compile it and pull the function back out of the scope.
      const factory = new Function(
        `${source}\n; const candidates = [twoSum, reverseString, isValid, findDuplicate, solution]; return candidates.find(c => typeof c === 'function');`
      );
      // eslint-disable-next-line no-unused-vars
      const solution = factory() as (..._args: unknown[]) => unknown;
      const input = Array.isArray(test.input) ? test.input : [test.input];
      const actual = solution(...input);
      results.push({
        passed: normalize(actual) === normalizeExpected(test.expected),
        input: test.input,
        expected: test.expected,
        actual,
      });
    } catch (e) {
      results.push({
        passed: false,
        input: test.input,
        expected: test.expected,
        actual: `Error: ${(e as Error).message}`,
      });
    }
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    passed: passedCount === results.length,
    passedCount,
    total: results.length,
    results,
  };
};

export async function POST(request: Request) {
  const { source, testCases } = (await request.json()) as {
    source: string;
    testCases: TestCase[];
  };

  if (!source || !Array.isArray(testCases) || testCases.length === 0) {
    return NextResponse.json(
      { error: "Missing source or test cases." },
      { status: 400 }
    );
  }

  let stdout = "";
  let stderr = "";

  try {
    const pistonResult = await runPiston({
      language: "javascript",
      source,
      stdin: "",
    });
    stdout = pistonResult.stdout;
    stderr = pistonResult.stderr;
  } catch {
    // Piston unreachable — fall back to the local evaluator.
    const local = evaluateLocally({ source, testCases });
    return NextResponse.json({
      engine: "local",
      passed: local.passed,
      passedCount: local.passedCount,
      total: local.total,
      results: local.results,
      stdout,
      stderr,
    });
  }

  // With a live runner, validate outputs against expected values.
  const results = testCases.map((test, index) => {
    const expected = normalizeExpected(test.expected);
    const actual = stdout.split("\n")[index]?.trim() ?? "";
    return {
      passed: actual === expected,
      input: test.input,
      expected: test.expected,
      actual,
    };
  });

  const passedCount = results.filter((r) => r.passed).length;

  return NextResponse.json({
    engine: "piston",
    passed: passedCount === results.length,
    passedCount,
    total: results.length,
    results,
    stdout,
    stderr,
  });
}
