"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfile } from "@/actions/profile";

type EditProfileModalProps = {
  onClose: () => void;
  initial: {
    bio?: string;
    skills?: string[];
    github_handle?: string;
  };
};

const EditProfileModal = ({ onClose, initial }: EditProfileModalProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    onClose();
    router.refresh();
  };

  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-20 bg-[#293139a6] flex justify-center">
      <div className="py-4 px-8 rounded-xl bg-page w-[600px] h-max mt-12">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="cursor-pointer font-bold" onClick={onClose}>
            X
          </div>
          <h1 className="font-bold text-xl">Edit Profile</h1>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={saving}
            className="py-1.5 px-4 text-white bg-black dark:text-black dark:bg-white rounded-full font-bold text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        {/* FORM */}
        <form
          id="edit-profile-form"
          onSubmit={handleSubmit}
          className="py-6 flex flex-col gap-4"
        >
          {error && (
            <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-textGray text-sm font-semibold">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={initial.bio ?? ""}
              placeholder="Tell builders what you're working on"
              rows={3}
              className="bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="skills"
              className="text-textGray text-sm font-semibold"
            >
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              defaultValue={initial.skills?.join(", ") ?? ""}
              placeholder="React, TypeScript, UI/UX"
              className="bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray"
            />
            <span className="text-textGray text-xs">
              Comma-separated list, e.g. React, Python, Design.
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="github_handle"
              className="text-textGray text-sm font-semibold"
            >
              GitHub Handle
            </label>
            <input
              id="github_handle"
              name="github_handle"
              defaultValue={initial.github_handle ?? ""}
              placeholder="your-github-username"
              className="bg-inputGray outline-none p-3 rounded-xl placeholder:text-textGray"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
