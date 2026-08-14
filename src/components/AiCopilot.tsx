"use client";

import { useState } from "react";
import { generateMissingPage } from "@/actions/ai";

const AiCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [route, setRoute] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    jsx: string;
    source?: string;
    error?: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!route.trim()) return;
    setLoading(true);
    setResult(null);

    const res = await generateMissingPage({
      route: route.trim(),
      purpose: purpose.trim() || "a standard Devvit community page",
    });

    if (res.page) {
      setResult({ jsx: res.page.jsx, source: res.source });
    } else {
      setResult({ jsx: "", error: res.error });
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="py-2 px-5 rounded-full border-[1px] border-borderGray text-sm font-bold text-iconBlue hover:bg-inputGray"
      >
        ✦ AI Co-pilot
      </button>
      {isOpen && (
        <div className="absolute w-screen h-screen top-0 left-0 z-20 bg-[#293139a6] flex justify-center">
          <div className="py-4 px-8 rounded-xl bg-page w-[600px] h-max mt-12 max-h-[85vh] overflow-y-auto">
            {/* TOP */}
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl">✦ AI Layout Co-pilot</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer font-bold"
              >
                X
              </button>
            </div>
            {/* FORM */}
            <div className="py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-textGray text-sm font-semibold">
                  Route to generate
                </label>
                <input
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  placeholder="e.g. /events"
                  className="bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-textGray text-sm font-semibold">
                  Purpose
                </label>
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. community events calendar"
                  className="bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="py-2 px-5 w-max bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate page"}
              </button>
            </div>
            {/* RESULT */}
            {result?.error && (
              <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm mb-4">
                {result.error}
              </div>
            )}
            {result?.jsx && (
              <pre className="p-4 rounded-xl bg-inputGray text-xs overflow-x-auto whitespace-pre-wrap mb-4">
                {result.jsx}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AiCopilot;
