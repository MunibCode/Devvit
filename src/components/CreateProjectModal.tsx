"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject } from "@/actions/projects";

type CreateProjectModalProps = {
  onClose: () => void;
};

const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<
    "startup" | "open_source" | "internal"
  >("startup");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const skills = (formData.get("skills") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await createProject({
      title: (formData.get("title") as string).trim(),
      description: (formData.get("description") as string).trim(),
      category,
      required_skills: skills,
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
      <div className="py-4 px-8 rounded-xl bg-page w-[600px] h-max mt-12 max-h-[90vh] overflow-y-auto">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="cursor-pointer font-bold" onClick={onClose}>
            X
          </div>
          <h1 className="font-bold text-xl">Create Project</h1>
          <button
            type="submit"
            form="create-project-form"
            disabled={saving}
            className="py-1.5 px-4 text-white bg-black dark:text-black dark:bg-white rounded-full font-bold text-sm disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
        {/* FORM */}
        <form
          id="create-project-form"
          onSubmit={handleSubmit}
          className="py-6 flex flex-col gap-4"
        >
          {error && (
            <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-textGray text-sm font-semibold">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="e.g. Campus Connect"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-textGray text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="What are you building and what help do you need?"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-textGray text-sm font-semibold">Category</span>
            <div className="flex gap-2 flex-wrap">
              {(
                ["startup", "open_source", "internal"] as const
              ).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`py-1.5 px-4 rounded-full text-sm font-semibold border-[1px] border-borderGray ${
                    category === c
                      ? "bg-iconBlue text-white border-iconBlue"
                      : "hover:bg-inputGray"
                  }`}
                >
                  {c.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="skills"
              className="text-textGray text-sm font-semibold"
            >
              Required Skills
            </label>
            <input
              id="skills"
              name="skills"
              placeholder="React, TypeScript, UI/UX"
              className={inputClass}
            />
            <span className="text-textGray text-xs">
              Comma-separated list of skills {"you're"} looking for.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
