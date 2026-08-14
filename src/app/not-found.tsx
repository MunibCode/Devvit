import Image from "@/components/Image";
import Link from "next/link";
import AiCopilot from "@/components/AiCopilot";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <Image path="icons/logo.svg" alt="Devvit" w={48} h={48} />
      <h1 className="text-4xl font-bold text-textGrayLight">404</h1>
      <p className="text-textGray text-center max-w-sm">
        This page hasn&apos;t been built yet. Use the Devvit AI co-pilot to
        generate a matching layout on the fly.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/home"
          className="py-2 px-5 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm"
        >
          Back home
        </Link>
        <AiCopilot />
      </div>
    </div>
  );
};

export default NotFound;
