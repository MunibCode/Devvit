import { createClient } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  // Bail early when Supabase isn't configured yet (baseline UI shell).
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
