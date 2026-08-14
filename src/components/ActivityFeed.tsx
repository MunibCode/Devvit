import Post from "./Post";
import Image from "./Image";
import Link from "next/link";

const ActivityFeed = () => {
  return (
    <div className="">
      {/* PROJECT POST */}
      <Post />
      {/* DUEL VICTORY */}
      <div className="p-4 border-y-[1px] border-borderGray flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-textGray">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#f91880"
              d="M12 22c-1.2 0-2.35-.28-3.39-.79l-1.13.66c-.34.2-.78.08-.97-.26l-.82-1.4c-.19-.34-.07-.77.27-.96l1.12-.65a8.02 8.02 0 0 1-2.16-3.67l-1.3-.3c-.4-.09-.64-.5-.55-.9l.38-1.6c.09-.4.5-.64.9-.55l1.28.3a8.1 8.1 0 0 1 0-1.76l-1.28.3c-.4.09-.81-.15-.9-.55l-.38-1.6c-.09-.4.15-.81.55-.9l1.3-.3A8.02 8.02 0 0 1 6.05 5l-1.12-.65c-.34-.19-.46-.62-.27-.96l.82-1.4c.19-.34.63-.46.97-.27l1.13.66A8.02 8.02 0 0 1 12 2c1.2 0 2.35.28 3.39.79l1.13-.66c.34-.2.78-.08.97.26l.82 1.4c.19.34.07.77-.27.96l-1.12.65a8.02 8.02 0 0 1 2.16 3.67l1.3.3c.4.09.64.5.55.9l-.38 1.6c-.09.4-.5.64-.9.55l-1.28-.3a8.1 8.1 0 0 1 0 1.76l1.28-.3c.4-.09.81.15.9.55l.38 1.6c.09.4-.15.81-.55.9l-1.3.3a8.02 8.02 0 0 1-2.16 3.67l1.12.65c.34.2.46.62.27.96l-.82 1.4c-.19.34-.63.46-.97.27l-1.13-.66A8.02 8.02 0 0 1 12 22zm-1-7.41 4.29-4.29-1.41-1.42-2.88 2.88-1.29-1.29-1.41 1.42L11 14.59z"
            />
          </svg>
          <span>Duel victory</span>
        </div>
        <div className="flex gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image path="general/avatar-1.jpg" alt="" w={100} h={100} tr={true} />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-md font-bold">Omar Khaled</h1>
              <span className="text-textGray">@omar_khaled</span>
              <span className="text-textGray">2 hours ago</span>
            </div>
            <p>
              Won a <span className="text-iconBlue font-bold">Hard</span>{" "}
              Duel against @sara_dev — {"\u201C"}Two Sum II{"\u201D"}. Rating
              1200 → 1248. 🏆
            </p>
            <Link
              href="/duel"
              className="text-iconBlue w-max text-sm font-semibold"
            >
              View replay
            </Link>
          </div>
        </div>
      </div>
      {/* COMMUNITY ANNOUNCEMENT */}
      <div className="p-4 border-y-[1px] border-borderGray flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-textGray">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#1d9bf0"
              d="M12 24c-.99 0-1.94-.13-2.84-.38l-.49.49a1.5 1.5 0 0 1-2.12-2.12l.49-.49A11.97 11.97 0 0 1 0 12 12 12 0 0 1 12 0c.99 0 1.94.13 2.84.38l.49-.49a1.5 1.5 0 0 1 2.12 2.12l-.49.49A11.97 11.97 0 0 1 24 12 12 12 0 0 1 12 24zm0-21a9.04 9.04 0 0 0-9 9c0 4.2 2.76 7.77 6.52 9.02L12 21l2.48.02C18.24 19.77 21 16.2 21 12a9.04 9.04 0 0 0-9-9zm-1 12V8l6 4-6 3z"
            />
          </svg>
          <span>Announcement</span>
        </div>
        <div className="flex gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image path="general/avatar-1.jpg" alt="" w={100} h={100} tr={true} />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-md font-bold">Devvit</h1>
              <span className="text-textGray">@devvit</span>
              <span className="text-textGray">1 day ago</span>
            </div>
            <p>
              The Code Duel Arena opens this Friday! Register for the first
              ranked season and compete for verified contribution badges.
            </p>
            <Link
              href="/duel"
              className="text-iconBlue w-max text-sm font-semibold"
            >
              Join the Arena
            </Link>
          </div>
        </div>
      </div>
      {/* PROJECT POST */}
      <Post />
    </div>
  );
};

export default ActivityFeed;
