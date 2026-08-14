import ActivityFeed from "@/components/ActivityFeed";
import Share from "@/components/Share";
import Link from "next/link";

const Home = () => {
  return (
    <div className="">
      <div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray">
        <Link
          className="pb-3 flex items-center border-b-4 border-iconBlue"
          href="/home"
        >
          Updates
        </Link>
        <Link className="pb-3 flex items-center" href="/home">
          Following
        </Link>
        <Link className="hidden pb-3 md:flex items-center" href="/projects">
          Projects
        </Link>
        <Link className="hidden pb-3 md:flex items-center" href="/duel">
          Duels
        </Link>
      </div>
      <Share />
      <ActivityFeed />
    </div>
  );
};

export default Home;
