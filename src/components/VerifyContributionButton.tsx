"use client";

import { useState } from "react";
import VerifyContributionModal from "./VerifyContributionModal";

type VerifyContributionButtonProps = {
  visible: boolean;
  projectId: string;
  builderId: string;
};

const VerifyContributionButton = ({
  visible,
  projectId,
  builderId,
}: VerifyContributionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!visible) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="py-1.5 px-4 bg-iconGreen text-white rounded-full text-sm font-bold"
      >
        + Verify Contribution
      </button>
      {isOpen && (
        <VerifyContributionModal
          onClose={() => setIsOpen(false)}
          projectId={projectId}
          builderId={builderId}
        />
      )}
    </>
  );
};

export default VerifyContributionButton;
