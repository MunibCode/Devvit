import ApplicationsList, {
  type ApplicationItem,
} from "@/components/ApplicationsList";
import { getCurrentUser } from "@/utils/supabase/user";
import { createClient } from "@/utils/supabase/server";

const ApplicationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="p-10 text-center text-textGray">
        Sign in to manage applications for your projects.
      </div>
    );
  }

  const supabase = await createClient();

type ApplicationRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  projects: { title: string } | null;
  applicant: { username: string; full_name: string } | null;
};

  const { data } = await supabase
    .from("project_applications")
    .select(
      "id, status, projects(title), applicant:profiles(username, full_name)"
    )
    .order("created_at", { ascending: false });

  const applications: ApplicationItem[] = (
    (data ?? []) as unknown as ApplicationRow[]
  ).map((app) => ({
      id: app.id,
      project_title: app.projects?.title ?? "Untitled project",
      applicant_name: app.applicant?.full_name ?? "Builder",
      applicant_handle: app.applicant?.username ?? "builder",
      status: app.status,
    })
  );

  return <ApplicationsList applications={applications} />;
};

export default ApplicationsPage;
