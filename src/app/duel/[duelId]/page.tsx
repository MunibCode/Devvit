import { placeholderProblems } from "@/lib/duel-problems";
import DuelArena from "@/components/DuelArena";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type DuelRow = {
  problem_id: string;
  player2: { username: string } | null;
};

const DuelArenaPage = async ({
  params,
}: {
  params: Promise<{ duelId: string }>;
}) => {
  const { duelId } = await params;

  let problem = placeholderProblems[0];
  let opponentName = "sara_dev";

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();

    // Load the duel and its problem when connected to Supabase.
    const { data: duel } = await supabase
      .from("duels")
      .select("problem_id, player2:profiles(username)")
      .eq("id", duelId)
      .maybeSingle();

    const duelRow = duel as unknown as DuelRow | null;

    if (duelRow?.problem_id) {
      const { data: problemRow } = await supabase
        .from("duel_problems")
        .select("*")
        .eq("id", duelRow.problem_id)
        .maybeSingle();

      if (problemRow) {
        problem = {
          id: problemRow.id,
          title: problemRow.title,
          description: problemRow.description,
          difficulty: problemRow.difficulty,
          initial_code: problemRow.initial_code,
          test_cases: problemRow.test_cases,
        };
      }
    }

    opponentName = duelRow?.player2?.username ?? "opponent";
  } else if (duelId !== "demo") {
    notFound();
  }

  return (
    <DuelArena
      problem={problem}
      duelId={duelId}
      opponentName={opponentName}
      durationSeconds={900}
    />
  );
};

export default DuelArenaPage;
