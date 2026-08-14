import Feed from "@/components/Feed";
import Image from "@/components/Image";
import ProfileActions from "@/components/ProfileActions";
import VerifyContributionButton from "@/components/VerifyContributionButton";
import { getCurrentUser } from "@/utils/supabase/user";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const placeholderContributions = [
  {
    role: "Frontend Engineer",
    project: "Campus Connect",
    proof: "https://github.com/campus-connect",
  },
  {
    role: "UI Designer",
    project: "Devvit CLI",
    proof: "https://github.com/devvit/cli",
  },
];

type ContributionRow = {
  role_title: string;
  proof_url: string;
  projects: { title: string } | null;
};

const BuilderProfile = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  const isOwner =
    currentUser?.user_metadata?.user_name === username ||
    currentUser?.email?.split("@")[0] === username;

  // Fetch profile + verified contributions when Supabase is configured.
  let contributions = placeholderContributions;
  let builderId: string | undefined;
  let ownerProjectId: string | undefined;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    builderId = profile?.id;

    if (builderId) {
      const { data: rows } = await supabase
        .from("verified_contributions")
        .select("role_title, proof_url, projects(title)")
        .eq("builder_id", builderId)
        .order("verified_at", { ascending: false });

      if (rows && rows.length > 0) {
        contributions = (rows as unknown as ContributionRow[]).map((row) => ({
          role: row.role_title,
          project: row.projects?.title ?? "Project",
          proof: row.proof_url,
        }));
      }

      // If the current user owns a project this builder applied to, they may
      // verify a contribution for them.
      if (currentUser) {
        const { data: owned } = await supabase
          .from("projects")
          .select("id")
          .eq("owner_id", currentUser.id)
          .limit(1)
          .maybeSingle();
        ownerProjectId = owned?.id;
      }
    }
  }

  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-page/50">
        <Link href="/home">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Munib Ali</h1>
      </div>
      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative">
            <Image path="general/cover-3.jpg" alt="" w={600} h={200} tr={true} />
          </div>
          {/* AVATAR */}
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-page bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image path="general/avatar-1.jpg" alt="" w={150} h={150} tr={true} />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 p-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/more.svg" alt="more" w={20} h={20} />
          </div>
          <ProfileActions
            isOwner={isOwner}
            initial={{
              bio: "Building on Devvit — shipping real-world projects, landing verified contributions, and climbing the Code Duel ladder.",
              skills: ["React", "TypeScript", "UI/UX"],
              github_handle: "aya-nassar",
            }}
          />
        </div>
        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2">
          <div className="">
            <h1 className="text-2xl font-bold">Munib Ali</h1>
            <span className="text-textGray text-sm">@{username}</span>
          </div>
          <p>Building on Devvit — shipping real-world projects, landing verified contributions, and climbing the Code Duel ladder.</p>
          {/* LINKS */}
          <div className="flex gap-4 text-textGray text-[15px] flex-wrap">
            <div className="flex items-center gap-2">
              <Image path="icons/userLocation.svg" alt="location" w={20} h={20} />
              <span>USA</span>
            </div>
            <Link
              href="https://github.com"
              target="_blank"
              className="flex items-center gap-2 hover:text-iconBlue"
            >
              <Image path="icons/more.svg" alt="github" w={20} h={20} />
              <span>GitHub</span>
            </Link>
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>Joined May 2021</span>
            </div>
          </div>
          {/* FOLLOWERS & FOLLOWING */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Following</span>
            </div>
          </div>
        </div>
      </div>
      {/* DUEL STATS */}
      <div className="mx-4 mb-4 p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
        <h2 className="text-lg font-bold text-textGrayLight">Code Duel Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-iconBlue">1248</span>
            <span className="text-textGray text-sm">Rating</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-iconGreen">18</span>
            <span className="text-textGray text-sm">Wins</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-iconPink">9</span>
            <span className="text-textGray text-sm">Duels</span>
          </div>
        </div>
      </div>
      {/* VERIFIED CONTRIBUTIONS */}
      <div className="mx-4 mb-4 p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-textGrayLight">
              Verified Contributions
            </h2>
            <span className="py-0.5 px-2 rounded-full bg-iconGreen/20 text-iconGreen text-xs font-bold">
              VERIFIED
            </span>
          </div>
          <VerifyContributionButton
            visible={!!ownerProjectId && !!builderId}
            projectId={ownerProjectId ?? ""}
            builderId={builderId ?? ""}
          />
        </div>
        {contributions.map((contribution) => (
          <div
            key={contribution.project + contribution.role}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex flex-col">
              <h3 className="font-bold">{contribution.role}</h3>
              <span className="text-textGray text-sm">{contribution.project}</span>
            </div>
            <Link
              href={contribution.proof}
              target="_blank"
              className="py-1 px-4 rounded-full border-[1px] border-borderGray text-sm font-semibold hover:bg-inputGray"
            >
              Proof
            </Link>
          </div>
        ))}
      </div>
      {/* FEED */}
      <Feed />
    </div>
  );
};

export default BuilderProfile;
