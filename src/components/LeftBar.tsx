import Link from "next/link";
import Image from "./Image";
import ThemeToggle from "./ThemeToggle";
import AuthMenu from "./AuthMenu";
import { getCurrentUser } from "@/utils/supabase/user";

const menuList = [
  {
    id: 1,
    name: "Home",
    link: "/home",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Projects",
    link: "/projects",
    icon: "job.svg",
  },
  {
    id: 3,
    name: "Duel Arena",
    link: "/duel",
    icon: "community.svg",
  },
  {
    id: 4,
    name: "Profile",
    link: "/profile",
    icon: "profile.svg",
  },
  {
    id: 5,
    name: "Applications",
    link: "/applications",
    icon: "message.svg",
  },
  {
    id: 6,
    name: "Notification",
    link: "/",
    icon: "notification.svg",
  },
];
const LeftBar = async () => {
  const currentUser = await getCurrentUser();
  const username =
    currentUser?.user_metadata?.user_name ??
    currentUser?.email?.split("@")[0] ??
    undefined;

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-inputGray ">
          <Image path="icons/logo.svg" alt="logo" w={24} h={24} />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
            <Link
              href={
                item.name === "Profile"
                  ? username
                    ? `/profile/${username}`
                    : "/login"
                  : item.link
              }
              className="p-2 rounded-full hover:bg-inputGray flex items-center gap-4"
              key={item.id}
            >
              <Image
                path={`icons/${item.icon}`}
                alt={item.name}
                w={24}
                h={24}
              />
              <span className="hidden xxl:inline">{item.name}</span>
            </Link>
          ))}
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-black text-white dark:bg-white dark:text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
        >
          <Image path="icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden xxl:block bg-black text-white dark:bg-white dark:text-black rounded-full font-bold py-2 px-20"
        >
          Post update
        </Link>
        {/* THEME TOGGLE */}
        <ThemeToggle />
      </div>
      {/* USER */}
      <div className="flex items-center justify-between">
        <AuthMenu
          signedIn={!!currentUser}
          avatarUrl={currentUser?.user_metadata?.avatar_url}
          username={username}
          email={currentUser?.email}
        />
        <div className="hidden xxl:block cursor-pointer font-bold">...</div>
      </div>
    </div>
  );
};

export default LeftBar;
