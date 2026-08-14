"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load the Monaco editor so the duel page paints immediately and the
// editor chunk is fetched separately.
const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center gap-2 text-textGray bg-[#1e1e1e]">
      <div className="w-4 h-4 rounded-full border-2 border-iconBlue border-t-transparent animate-spin" />
      <span className="text-sm">Loading editor...</span>
    </div>
  ),
});

type TestCase = {
  input: unknown;
  expected: unknown;
};

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  initial_code: { javascript: string };
  test_cases: TestCase[];
};

type ExecuteResult = {
  engine: string;
  passed: boolean;
  passedCount: number;
  total: number;
  results: {
    passed: boolean;
    input: unknown;
    expected: unknown;
    actual: unknown;
  }[];
  stdout: string;
  stderr: string;
};

const difficultyStyles = {
  easy: "text-iconGreen",
  medium: "text-iconBlue",
  hard: "text-iconPink",
};

const DuelArena = ({
  problem,
  duelId,
  opponentName,
  durationSeconds,
}: {
  problem: Problem;
  duelId: string;
  opponentName: string;
  durationSeconds: number;
}) => {
  const [code, setCode] = useState(problem.initial_code.javascript);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [result, setResult] = useState<ExecuteResult | null>(null);
  const [running, setRunning] = useState(false);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentSolved, setOpponentSolved] = useState(false);
  const channelRef = useRef<ReturnType<typeof createRealtimeChannel> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated opponent activity when not connected to realtime.
  useEffect(() => {
    const interval = setInterval(() => {
      setOpponentProgress((p) => {
        if (p >= 100) {
          setOpponentSolved(true);
          return p;
        }
        return Math.min(100, p + Math.random() * 3);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Realtime broadcast channel (no-op without Supabase env).
  useEffect(() => {
    const channel = createRealtimeChannel(duelId, {
      onOpponentSolved: () => {
        setOpponentSolved(true);
        setOpponentProgress(100);
      },
    });
    channelRef.current = channel;
    return () => {
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [duelId]);

  const broadcastSolve = useCallback(() => {
    channelRef.current?.broadcastSolve();
  }, []);

  const handleSubmit = async () => {
    setRunning(true);
    setResult(null);

    try {
      const response = await fetch("/api/duel/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: code,
          testCases: problem.test_cases,
        }),
      });
      const data: ExecuteResult = await response.json();
      setResult(data);
      if (data.passed) {
        broadcastSolve();
      }
    } catch (e) {
      setResult({
        engine: "error",
        passed: false,
        passedCount: 0,
        total: problem.test_cases.length,
        results: [],
        stdout: "",
        stderr: (e as Error).message,
      });
    } finally {
      setRunning(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen">
      {/* PROBLEM PANEL */}
      <div className="flex-1 lg:max-w-[42%] border-b-[1px] lg:border-b-0 lg:border-r-[1px] border-borderGray p-4 flex flex-col gap-4 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-textGrayLight">
              {problem.title}
            </h1>
            <span
              className={`text-sm font-semibold capitalize ${difficultyStyles[problem.difficulty]}`}
            >
              {problem.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-textGray text-sm">⏱ {minutes}:{seconds.toString().padStart(2, "0")}</span>
          </div>
        </div>
        {/* DESCRIPTION */}
        <p className="text-textGrayLight text-[15px] leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>
        {/* TEST CASES */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-textGrayLight">Test Cases</h2>
          {problem.test_cases.map((test, index) => (
            <div
              key={index}
              className="py-2 px-3 rounded-lg bg-inputGray text-sm text-textGrayLight font-mono"
            >
              <span className="text-textGray">case {index + 1}: </span>
              {JSON.stringify(test.input)}
            </div>
          ))}
        </div>
        {/* OPPONENT */}
        <div className="p-3 rounded-xl border-[1px] border-borderGray flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-textGray text-sm font-semibold">
              Opponent · {opponentName}
            </span>
            <span className="text-iconGreen text-sm font-bold">
              {opponentSolved ? "SOLVED" : `${Math.round(opponentProgress)}%`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-inputGray overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                opponentSolved ? "bg-iconGreen" : "bg-iconBlue"
              }`}
              style={{ width: `${opponentSolved ? 100 : opponentProgress}%` }}
            />
          </div>
        </div>
      </div>
      {/* EDITOR PANEL */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 min-h-[320px]">
          <CodeEditor value={code} onChange={setCode} />
        </div>
        {/* CONSOLE */}
        <div className="border-t-[1px] border-borderGray p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-textGrayLight">Console</h2>
            <div className="flex items-center gap-3">
              {result && (
                <span
                  className={`text-sm font-bold ${
                    result.passed ? "text-iconGreen" : "text-iconPink"
                  }`}
                >
                  {result.passed ? "PASSED" : "FAILED"} · {result.passedCount}/
                  {result.total}
                </span>
              )}
              <button
                onClick={handleSubmit}
                disabled={running}
                className="py-2 px-5 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm disabled:opacity-50"
              >
                {running ? "Running..." : "Submit"}
              </button>
            </div>
          </div>
          {result && (
            <div className="max-h-40 overflow-y-auto flex flex-col gap-2 font-mono text-sm">
              {result.results.map((r, index) => (
                <div
                  key={index}
                  className={`py-1.5 px-3 rounded-lg ${
                    r.passed ? "bg-iconGreen/10 text-iconGreen" : "bg-iconPink/10 text-iconPink"
                  }`}
                >
                  case {index + 1}: expected {JSON.stringify(r.expected)} · got{" "}
                  {JSON.stringify(r.actual)}
                </div>
              ))}
              {result.stderr && (
                <div className="py-1.5 px-3 rounded-lg bg-iconPink/10 text-iconPink whitespace-pre-wrap">
                  {result.stderr}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Thin realtime helper — safely no-ops without Supabase configured.
type ChannelLike = {
  broadcastSolve: () => void;
  unsubscribe: () => void;
};

const createRealtimeChannel = (
  duelId: string,
  handlers: { onOpponentSolved: () => void }
): ChannelLike => {
  const envConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!envConfigured) {
    return {
      broadcastSolve: () => {},
      unsubscribe: () => {},
    };
  }

  let send: (() => void) | null = null;

  // Lazy import avoids bundling Supabase until env is present.
  void import("@/utils/supabase/client").then(({ createClient }) => {
    const supabase = createClient();
    const channel = supabase
      .channel(`duel:${duelId}`)
      .on("broadcast", { event: "solved" }, () => {
        handlers.onOpponentSolved();
      })
      .subscribe();

    send = () => {
      channel.send({ type: "broadcast", event: "solved" });
    };
  });

  return {
    broadcastSolve: () => send?.(),
    unsubscribe: () => {},
  };
};

export default DuelArena;
