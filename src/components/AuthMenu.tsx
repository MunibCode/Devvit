"use client";

import Link from "next/link";
import { signOut } from "@/actions/auth";
import Image from "./Image";

type AuthMenuProps = {
  signedIn: boolean;
  avatarUrl?: string;
  username?: string;
  email?: string;
};

const AuthMenu = ({ signedIn, avatarUrl, username, email }: AuthMenuProps) => {
  if (!signedIn) {
    return (
      <Link
        href="/login"
        className="py-2 px-4 text-center bg-black text-white dark:bg-white dark:text-black rounded-full font-bold"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/profile/${username ?? email?.split("@")[0] ?? "me"}`}>
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          <Image
            path={avatarUrl || "/general/avatar-1.jpg"}
            alt="avatar"
            w={100}
            h={100}
            tr={true}
          />
        </div>
      </Link>
      <form action={signOut}>
        <button className="py-2 px-4 text-white dark:text-black bg-black dark:bg-white rounded-full font-bold text-sm">
          Sign out
        </button>
      </form>
    </div>
  );
};

export default AuthMenu;
