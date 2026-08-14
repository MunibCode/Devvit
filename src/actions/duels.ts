"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const recordDuelResult = async ({
  duelId,
  winnerId,
  loserId,
}: {
  duelId: string;
  winnerId: string;
  loserId: string;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  // Atomic rating adjustment: winner +25, loser -25.
  const { error: winError } = await supabase.rpc("adjust_rating", {
    builder_id: winnerId,
    delta: 25,
  });
  if (winError) return { error: winError.message };

  const { error: loseError } = await supabase.rpc("adjust_rating", {
    builder_id: loserId,
    delta: -25,
  });
  if (loseError) return { error: loseError.message };

  const { error: duelError } = await supabase
    .from("duels")
    .update({ status: "finished", winner_id: winnerId })
    .eq("id", duelId);

  if (duelError) return { error: duelError.message };

  revalidatePath("/duel");
  revalidatePath("/profile");
  return { success: true };
};
