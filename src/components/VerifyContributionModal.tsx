"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyContribution } from "@/actions/projects";
import { summarizeContribution } from "@/actions/ai";

type VerifyContributionModalProps = {
  onClose: () => void;
  projectId: string;
  builderId: string;
};

type AiSummary = {
  summary: string;
  suggestedRole: string;
  confidence: "low" | "medium" | "high";
};

const VerifyContributionModal = ({
  onClose,
  projectId,
  builderId,
}: VerifyContributionModalProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const proofUrl = (e.currentTarget as HTMLFormElement).elements.namedItem(
      "proof_url"
    ) as HTMLInputElement;

    if (!proofUrl?.value.trim()) return;

    setAnalyzing(true);
    setAiError(null);
    setAiSummary(null);

    const res = await summarizeContribution({
      proofUrl: proofUrl.value.trim(),
    });

    if (res.error) {
      setAiError(res.error);
    } else if (res.summary) {
      setAiSummary(res.summary);
    }
    setAnalyzing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await verifyContribution({
      projectId,
      builderId,
      roleTitle: (formData.get("role_title") as string).trim(),
      proofUrl: (formData.get("proof_url") as string).trim(),
    });

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    onClose();
    router.refresh();
  };

  const inputClass =
    "bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray";

  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-20 bg-[#293139a6] flex justify-center">
      <div className="py-4 px-8 rounded-xl bg-page w-[600px] h-max mt-12">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="cursor-pointer font-bold" onClick={onClose}>
            X
          </div>
          <h1 className="font-bold text-xl">Verify Contribution</h1>
          <button
            type="submit"
            form="verify-contribution-form"
            disabled={saving}
            className="py-1.5 px-4 text-white bg-black dark:text-black dark:bg-white rounded-full font-bold text-sm disabled:opacity-50"
          >
            {saving ? "Verifying..." : "Verify"}
          </button>
        </div>
        {/* FORM */}
        <form
          id="verify-contribution-form"
          onSubmit={handleSubmit}
          className="py-6 flex flex-col gap-4"
        >
          {error && (
            <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="role_title"
              className="text-textGray text-sm font-semibold"
            >
              Role Title
            </label>
            <input
              id="role_title"
              name="role_title"
              required
              placeholder="e.g. Frontend Engineer"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="proof_url"
              className="text-textGray text-sm font-semibold"
            >
              Proof URL
            </label>
            <div className="flex items-center gap-2">
              <input
                id="proof_url"
                name="proof_url"
                required
                type="url"
                placeholder="https://github.com/user/repo/pull/42"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="py-3 px-4 rounded-xl border-[1px] border-borderGray text-sm font-bold text-iconBlue hover:bg-inputGray disabled:opacity-50 whitespace-nowrap"
              >
                {analyzing ? "Analyzing..." : "✦ Analyze with AI"}
              </button>
            </div>
            <span className="text-textGray text-xs">
              Link a PR, commit, or live demo as proof of completion.
            </span>
            {aiError && (
              <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm">
                {aiError}
              </div>
            )}
            {aiSummary && (
              <div className="py-3 px-3 rounded-xl bg-iconGreen/10 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-iconGreen text-xs font-bold">
                    AI SUGGESTION
                  </span>
                  <span className="text-iconGreen text-xs font-bold capitalize">
                    confidence: {aiSummary.confidence}
                  </span>
                </div>
                <p className="text-sm text-textGrayLight">{aiSummary.summary}</p>
                <span className="text-sm font-semibold text-textGrayLight">
                  Suggested role: {aiSummary.suggestedRole}
                </span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyContributionModal;
