"use client";

import { useState } from "react";
import { generateDuelProblem } from "@/actions/ai";
import { createClient } from "@/utils/supabase/client";

const AiDuelGenerator = () => {
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);

    // Lazy-load the browser client only when env is configured.
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const res = await generateDuelProblem(preferences.trim() || undefined);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("duel_problems")
        .insert({
          title: res.problem!.title,
          description: res.problem!.description,
          difficulty: res.problem!.difficulty,
          initial_code: res.problem!.initial_code,
          test_cases: res.problem!.test_cases,
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        setSaved(true);
      }
    } else {
      setError(
        "AI generation is available. Configure AI_API_KEY in your environment."
      );
    }

    setLoading(false);
  };

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-3">
      <h2 className="font-bold text-textGrayLight">✦ AI Duel Generator</h2>
      <p className="text-textGray text-sm">
        Auto-generate a unique coding challenge with starter code and test
        cases, saved straight to the arena.
      </p>
      <input
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        placeholder="Optional: topic, data structure, language style..."
        className="bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray text-sm"
      />
      {error && (
        <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="py-2 px-3 rounded-lg bg-iconGreen/10 text-iconGreen text-sm">
          Challenge added to the arena.
        </div>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="py-2 px-5 w-max bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate challenge"}
      </button>
    </div>
  );
};

export default AiDuelGenerator;