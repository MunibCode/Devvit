"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const updateProfile = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const bio = (formData.get("bio") as string)?.trim() ?? "";
  const githubHandle = (formData.get("github_handle") as string)?.trim() ?? "";
  const skillsRaw = (formData.get("skills") as string)?.trim() ?? "";

  const skills = skillsRaw
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("profiles")
    .update({ bio, skills, github_handle: githubHandle })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/profile/${user.user_metadata?.user_name ?? user.email}`);
  revalidatePath("/home");
  return { success: true };
};
