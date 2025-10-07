import type {
  Submission,
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
} from "@/types/supabase/submission";
import { createSupabaseClient } from "@/lib/database/connection";

const supabase = createSupabaseClient();

export async function createSubmission(
  request: CreateSubmissionRequest
): Promise<Submission | null> {
  const latestSubmission = await getLatestSubmission(request.user_id);
  if (latestSubmission && !latestSubmission.completed_at) {
    throw new Error(
      "You already have an in-progress survey. Please complete it first."
    );
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert([request])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Submission;
}

export async function getLatestSubmission(
  userId: string
): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching submission:", error);
      return null;
    }

    return data as Submission;
  } catch (error) {
    console.error("Exception fetching submission:", error);
    return null;
  }
}

export async function updateLatestSubmission(
  userId: string,
  request: UpdateSubmissionRequest
): Promise<Submission> {
  try {
    const { data: latest, error: fetchError } = await supabase
      .from("submissions")
      .select("id")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      throw new Error(
        `Error fetching latest submission: ${fetchError.message}`
      );
    }

    if (!latest) {
      throw new Error("No active submission found for this user.");
    }

    const { data, error } = await supabase
      .from("submissions")
      .update({ ...request })
      .eq("id", latest.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating submission: ${error.message}`);
    }

    if (!data) {
      throw new Error("Update failed — no submission returned.");
    }

    return data as Submission;
  } catch (error) {
    console.error("updateLatestSubmission Exception:", error);
    throw error;
  }
}



