import Link from "next/link";
import Image from "./Image";

const PopularTags = () => {
  const trends = [
    { topic: "Technology • Trending", tag: "#NextJS", posts: "20K builds" },
    { topic: "Development • Trending", tag: "#OpenSource", posts: "18K builds" },
    { topic: "AI • Trending", tag: "#CodeDuels", posts: "15K duels" },
    { topic: "Community • Trending", tag: "#Hackathon", posts: "12K builds" },
  ];

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      <h1 className="text-xl font-bold text-textGrayLight">Trending</h1>
      {trends.map((trend) => (
        <div key={trend.tag}>
          <div className="flex items-center justify-between">
            <span className="text-textGray text-sm">{trend.topic}</span>
            <Image path="icons/infoMore.svg" alt="info" w={16} h={16} />
          </div>
          <h2 className="text-textGrayLight font-bold">{trend.tag}</h2>
          <span className="text-textGray text-sm">{trend.posts}</span>
        </div>
      ))}
      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default PopularTags;
