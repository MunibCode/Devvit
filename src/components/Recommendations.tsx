import Link from "next/link";
import Image from "./Image";

const Recommendations = () => {
  const builders = [
    { name: "Omar Khaled", handle: "omar_khaled" },
    { name: "Sara Mahmoud", handle: "sara_dev" },
    { name: "Lina Hassan", handle: "lina_builds" },
  ];

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      <h1 className="text-xl font-bold text-textGrayLight">
        Suggested Builders
      </h1>
      {builders.map((builder) => (
        <div key={builder.handle} className="flex items-center justify-between">
          {/* IMAGE AND USER INFO */}
          <div className="flex items-center gap-2">
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image path="general/avatar-1.jpg" alt={builder.name} w={100} h={100} tr={true} />
            </div>
            <div>
              <h1 className="text-md font-bold">{builder.name}</h1>
              <span className="text-textGray text-sm">@{builder.handle}</span>
            </div>
          </div>
          {/* BUTTON */}
          <button className="py-1 px-4 font-semibold bg-black text-white dark:bg-white dark:text-black rounded-full">
            Follow
          </button>
        </div>
      ))}
      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
