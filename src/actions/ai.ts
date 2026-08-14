"use server";

import { completeJSON } from "@/lib/ai";
import {
  componentTreeSummary,
  getComponentTree,
} from "@/lib/component-tree";

type GeneratedPage = {
  route: string;
  title: string;
  jsx: string;
};

export const generateMissingPage = async ({
  route,
  purpose,
}: {
  route: string;
  purpose: string;
}): Promise<{ page?: GeneratedPage; error?: string; source?: string }> => {
  const tree = await getComponentTree();
  const summary = componentTreeSummary(tree);

  const result = await completeJSON<GeneratedPage>(
    `You are the Devvit AI layout-completion agent. You complete missing pages in the Devvit Next.js (App Router) UI built with Tailwind CSS.

Design consistency rules (STRICT):
- Use the custom Tailwind tokens: textGray, textGrayLight, borderGray, inputGray, iconBlue, iconGreen, iconPink.
- Follow the existing Devvit visual hierarchy: left sidebar nav, central content column (max-w-screen-md lg:max-w-screen-lg mx-auto), right widget sidebar.
- Buttons: bg-black text-white dark:bg-white dark:text-black rounded-full.
- Rounded cards use border-[1px] border-borderGray.
- Dark-first theme: the page background is handled globally, do not set body colors.

Existing component tree:
${summary}

Respond with raw JSON only: {"route": string, "title": string, "jsx": string}. The jsx field must be a complete single React server component (arrow function with default export, TypeScript) that uses the tokens above.`,
    `Generate a missing page for route "${route}". Purpose: ${purpose}.`
  );

  if (!result?.jsx) {
    return { error: "AI could not generate a page. Check AI_API_KEY." };
  }

  return { page: result, source: "ai" };
};

type GeneratedProblem = {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  initial_code: { javascript: string };
  test_cases: { input: unknown; expected: unknown }[];
};

export const generateDuelProblem = async (
  preferences?: string
): Promise<
  { problem?: GeneratedProblem; error?: string; source?: string }
> => {
  const result = await completeJSON<GeneratedProblem>(
    `You are the Devvit AI Code Duel problem generator. You create unique competitive programming challenges.

Rules:
- The problem must be solvable with a single JavaScript function.
- Provide 3-5 test cases. Each test case has "input" (an array of arguments, e.g. [arr, target]) and "expected" (the function's return value).
- initial_code.javascript must be a complete function declaration with an empty body placeholder, e.g. "function fname(args) {\n  // write your solution here\n}".
- difficulty is one of "easy", "medium", "hard".
- The problem must NOT duplicate classic problems (Two Sum, Fibonacci, FizzBuzz, Reverse String, Palindrome, etc.).

Respond with raw JSON only: {"title": string, "description": string, "difficulty": "easy"|"medium"|"hard", "initial_code": {"javascript": string}, "test_cases": [{"input": unknown[], "expected": unknown}]}`,
    `Generate an original code duel problem.${preferences ? ` Preferences: ${preferences}.` : ''}`
  );

  if (!result?.title || !result?.test_cases?.length) {
    return { error: "AI could not generate a problem. Check AI_API_KEY." };
  }

  return { problem: result, source: "ai" };
};

type VerificationSummary = {
  summary: string;
  suggestedRole: string;
  confidence: "low" | "medium" | "high";
};

export const summarizeContribution = async ({
  proofUrl,
}: {
  proofUrl: string;
}): Promise<{ summary?: VerificationSummary; error?: string; source?: string }> => {
  const result = await completeJSON<VerificationSummary>(
    `You are the Devvit AI Portfolio Verification Assistant. You analyze a proof-of-work URL (a GitHub PR, commit, or live demo) submitted by a builder and produce a concise summary for a project owner to quickly verify the contribution.

Respond with raw JSON only: {"summary": string (2-3 sentences describing the contribution), "suggestedRole": string (e.g. "Frontend Engineer"), "confidence": "low"|"medium"|"high"}. If the URL is not verifiable, set confidence to "low" and summarize accordingly.`,
    `Analyze this proof of work: ${proofUrl}`
  );

  if (!result?.summary) {
    return { error: "AI could not analyze the contribution. Check AI_API_KEY." };
  }

  return { summary: result, source: "ai" };
};
