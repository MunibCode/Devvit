"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type ProjectInput = {
  title: string;
  description: string;
  category: "startup" | "open_source" | "internal";
  required_skills: string[];
};

export const createProject = async (input: ProjectInput) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a project." };
  }

  const { error } = await supabase.from("projects").insert({
    owner_id: user.id,
    title: input.title,
    description: input.description,
    category: input.category,
    required_skills: input.required_skills,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  return { success: true };
};

export const applyToProject = async (projectId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to apply." };
  }

  const { error } = await supabase.from("project_applications").insert({
    project_id: projectId,
    applicant_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: "accepted" | "rejected"
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("project_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  return { success: true };
};

export const verifyContribution = async ({
  projectId,
  builderId,
  roleTitle,
  proofUrl,
}: {
  projectId: string;
  builderId: string;
  roleTitle: string;
  proofUrl: string;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("verified_contributions").insert({
    project_id: projectId,
    builder_id: builderId,
    role_title: roleTitle,
    proof_url: proofUrl,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
};
