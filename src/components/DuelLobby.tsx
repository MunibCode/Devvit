import Link from "next/link";
import AiDuelGenerator from "./AiDuelGenerator";

const leaderboard = [
  { rank: 1, name: "Omar Khaled", handle: "omar_khaled", rating: 1482 },
  { rank: 2, name: "Sara Mahmoud", handle: "sara_dev", rating: 1415 },
  { rank: 3, name: "Munib Ali", handle: "aya_nassar", rating: 1248 },
  { rank: 4, name: "Lina Hassan", handle: "lina_builds", rating: 1180 },
];

const DuelLobby = () => {
  return (
    <div className="">
      {/* HEADER */}
      <div className="px-4 pt-4 border-b-[1px] border-borderGray">
        <h1 className="text-xl font-bold text-textGrayLight mb-3">
          Code Duel Arena
        </h1>
      </div>
      {/* ACTION CARDS */}
      <div className="p-4 grid gap-4 md:grid-cols-2">
        <Link
          href="/duel/demo"
          className="p-6 rounded-2xl border-[1px] border-borderGray hover:bg-inputGray flex flex-col gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-iconBlue/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#1d9bf0"
                d="M11 5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-6c-1.1 0-2-.9-2-2V5zm2 0v6h6V5h-6zM3 13c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6zm2 0v6h6v-6H5z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-textGrayLight">
              Quick Match
            </h2>
            <p className="text-sm text-textGray">
              Jump into the arena and race a builder on a random problem.
            </p>
          </div>
        </Link>
        <Link
          href="/duel/demo"
          className="p-6 rounded-2xl border-[1px] border-borderGray hover:bg-inputGray flex flex-col gap-3 text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-iconPink/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#f91880"
                d="M11.5 20.5c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm4.04-5.54c1.26-1.25 2.04-2.99 2.04-4.95 0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.58 0 3.04-.52 4.22-1.41l-4.72-4.72 1.42-1.41 5.04 5.04z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-textGrayLight">
              Practice Duel
            </h2>
            <p className="text-sm text-textGray">
              Play a sample round solo against a simulated opponent.
            </p>
          </div>
        </Link>
      </div>
      {/* AI GENERATOR */}
      <div className="px-4 pb-4">
        <AiDuelGenerator />
      </div>
      {/* LEADERBOARD */}
      <div className="px-4 pb-4">
        <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
          <h2 className="text-lg font-bold text-textGrayLight">
            Top Builders
          </h2>
          {leaderboard.map((player) => (
            <div key={player.handle} className="flex items-center gap-4">
              <span
                className={`w-6 text-center font-bold ${
                  player.rank === 1
                    ? "text-iconBlue"
                    : player.rank === 2
                    ? "text-iconGreen"
                    : player.rank === 3
                    ? "text-iconPink"
                    : "text-textGray"
                }`}
              >
                {player.rank}
              </span>
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold">{player.name}</h3>
                <span className="text-textGray text-sm">@{player.handle}</span>
              </div>
              <span className="font-bold text-iconBlue">{player.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DuelLobby;
