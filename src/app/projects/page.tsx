import Projects, { type ProjectItem } from "@/components/Projects";
import { placeholderProjects } from "@/lib/placeholder-data";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/utils/supabase/user";

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  category: "startup" | "open_source" | "internal";
  required_skills: string[] | null;
  status: "open" | "in_progress" | "completed";
  owner: { username: string; full_name: string } | null;
};

const ProjectsPage = async () => {
  const currentUser = await getCurrentUser();

  let projects: ProjectItem[] = placeholderProjects;

  // Fall back to placeholder data until Supabase is configured.
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();

    const { data } = await supabase
      .from("projects")
      .select("*, owner:profiles!projects_owner_id_fkey(username, full_name)")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      projects = (data as unknown as ProjectRow[]).map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        skills: project.required_skills ?? [],
        owner: project.owner?.full_name ?? "Builder",
        handle: project.owner?.username ?? "builder",
        status: project.status,
      }));
    }
  }

  return <Projects projects={projects} signedIn={!!currentUser} />;
};

export default ProjectsPage;
