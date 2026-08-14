"use client";

import { useState } from "react";
import { applyToProject } from "@/actions/projects";

type ApplyButtonProps = {
  projectId: string;
  disabled?: boolean;
};

const ApplyButton = ({ projectId, disabled }: ApplyButtonProps) => {
  const [state, setState] = useState<
    "idle" | "applying" | "applied" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  if (disabled) {
    return null;
  }

  const handleClick = async () => {
    setState("applying");
    setError(null);
    const result = await applyToProject(projectId);

    if (result?.error) {
      setError(result.error);
      setState("error");
      return;
    }

    setState("applied");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={state === "applying" || state === "applied"}
        className={`py-2 px-5 rounded-full font-bold text-sm disabled:opacity-50 ${
          state === "applied"
            ? "bg-iconGreen text-white"
            : "bg-black text-white dark:bg-white dark:text-black"
        }`}
      >
        {state === "applying"
          ? "Applying..."
          : state === "applied"
          ? "Applied"
          : "Apply"}
      </button>
      {state === "error" && (
        <span className="text-iconPink text-xs">{error}</span>
      )}
    </div>
  );
};

export default ApplyButton;
