import Image from "./Image";
import Link from "next/link";
import ApplyButton from "./ApplyButton";

type ProjectCardProps = {
  id?: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  owner: string;
  handle: string;
  status: "open" | "in_progress" | "completed";
};

const statusStyles = {
  open: "text-iconGreen",
  in_progress: "text-iconBlue",
  completed: "text-iconPink",
};

const ProjectCard = ({
  id,
  title,
  description,
  category,
  skills,
  owner,
  handle,
  status,
}: ProjectCardProps) => {
  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image path="general/avatar-1.jpg" alt={owner} w={100} h={100} tr={true} />
          </div>
          <div className="">
            <h1 className="text-md font-bold">{owner}</h1>
            <span className="text-textGray text-sm">@{handle}</span>
          </div>
        </div>
        <span className={`text-sm font-semibold capitalize ${statusStyles[status]}`}>
          {status.replace("_", " ")}
        </span>
      </div>
      {/* BODY */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-textGrayLight">{description}</p>
      </div>
      {/* CATEGORY */}
      <div className="w-max py-1 px-3 rounded-full bg-inputGray text-sm font-semibold capitalize">
        {category.replace("_", " ")}
      </div>
      {/* SKILLS */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="py-1 px-3 rounded-full border-[1px] border-borderGray text-sm text-textGray"
          >
            {skill}
          </span>
        ))}
      </div>
      {/* FOOTER */}
      <div className="flex items-center justify-between">
        <Link href={`/profile/${handle}`} className="text-iconBlue text-sm font-semibold">
          View project
        </Link>
        {status === "open" && (
          <ApplyButton projectId={id ?? "placeholder"} />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
