"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";

type Category = "all" | "startup" | "open_source" | "internal";

export type ProjectItem = {
  id?: string;
  title: string;
  description: string;
  category: "startup" | "open_source" | "internal";
  skills: string[];
  owner: string;
  handle: string;
  status: "open" | "in_progress" | "completed";
};

type ProjectsProps = {
  projects: ProjectItem[];
  signedIn: boolean;
};

const Projects = ({ projects, signedIn }: ProjectsProps) => {
  const [category, setCategory] = useState<Category>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered =
    category === "all"
      ? projects
      : projects.filter((p) => p.category === category);

  const tabs: { key: Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "startup", label: "Startups" },
    { key: "open_source", label: "Open-Source" },
    { key: "internal", label: "Internal Devvit" },
  ];

  return (
    <div className="">
      <div className="px-4 pt-4 border-b-[1px] border-borderGray">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-textGrayLight">
            Projects Hub
          </h1>
          {signedIn && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="py-2 px-4 text-white bg-black dark:text-black dark:bg-white rounded-full font-bold text-sm"
            >
              Create Project
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-textGray font-bold">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategory(tab.key)}
              className={`pb-3 flex items-center border-b-4 transition-colors ${
                category === tab.key
                  ? "border-iconBlue text-textGrayLight"
                  : "border-transparent hover:bg-inputGray"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-textGray">
            No projects in this category yet.
          </div>
        ) : (
          filtered.map((project) => (
            <ProjectCard key={project.id ?? project.title} {...project} />
          ))
        )}
      </div>
      {isCreateOpen && (
        <CreateProjectModal onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};

export default Projects;
