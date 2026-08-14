"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

type ProfileActionsProps = {
  isOwner: boolean;
  initial: {
    bio?: string;
    skills?: string[];
    github_handle?: string;
  };
};

const ProfileActions = ({ isOwner, initial }: ProfileActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOwner) {
    return (
      <button className="py-2 px-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full">
        Follow
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="py-2 px-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full"
      >
        Edit Profile
      </button>
      {isModalOpen && (
        <EditProfileModal
          onClose={() => setIsModalOpen(false)}
          initial={initial}
        />
      )}
    </>
  );
};

export default ProfileActions;
