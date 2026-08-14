import type { ProjectItem } from "@/components/Projects";

export const placeholderProjects: ProjectItem[] = [
  {
    title: "Campus Connect",
    description:
      "A student marketplace to rent textbooks, bikes, and study spaces. Looking for a React engineer and a UI designer to help ship the payments flow.",
    category: "startup",
    skills: ["React", "TypeScript", "Stripe", "UI/UX"],
    owner: "Munib Ali",
    handle: "aya_nassar",
    status: "open",
  },
  {
    title: "Devvit CLI",
    description:
      "Open-source CLI to scaffold verified portfolio projects and run local duel test cases. Contribute parser, generators, or docs.",
    category: "open_source",
    skills: ["Node.js", "Rust", "CLI", "Docs"],
    owner: "Omar Khaled",
    handle: "omar_khaled",
    status: "open",
  },
  {
    title: "Duel Arena Replays",
    description:
      "Internal tool to render and share code duel replays. Team of 3, need a frontend engineer for the timeline scrubber.",
    category: "internal",
    skills: ["React", "Monaco", "WebSockets"],
    owner: "Sara Mahmoud",
    handle: "sara_dev",
    status: "in_progress",
  },
  {
    title: "Hackathon Hub",
    description:
      "Aggregate campus hackathons and match students with teammates. MVP shipped, now seeking PM help to run the launch.",
    category: "startup",
    skills: ["Product", "Growth", "Next.js"],
    owner: "Lina Hassan",
    handle: "lina_builds",
    status: "completed",
  },
  {
    title: "Open Source Internship Board",
    description:
      "Curated board connecting students to OSS mentorship programs. Fully open, anyone can add listings via PR.",
    category: "open_source",
    skills: ["Content", "Next.js", "Markdown"],
    owner: "Devvit",
    handle: "devvit",
    status: "open",
  },
];
