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
      .select(`
        id,
        user_id,
        started_at,
        completed_at,
        status,
        physical_health_score,
        mental_health_score,
        overall_readiness_score,
        physical_health_recommendations,
        mental_health_recommendations,
        responses:responses (
          id,
          question_id,
          response_option_id,
          uploaded_file_url
        )
      `)
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching latest submission:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    const submission: Submission = {
      ...data,
      physical_health_recommendations: Array.isArray(
        data.physical_health_recommendations
      )
        ? data.physical_health_recommendations
        : JSON.parse(data.physical_health_recommendations || "[]"),
      mental_health_recommendations: Array.isArray(
        data.mental_health_recommendations
      )
        ? data.mental_health_recommendations
        : JSON.parse(data.mental_health_recommendations || "[]"),
      responses: data.responses || [],
    };

    return submission;
  } catch (error) {
    console.error("Exception fetching latest submission:", error);
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

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ ...request })
      .eq("id", latest.id);

    if (updateError) {
      throw new Error(`Error updating submission: ${updateError.message}`);
    }

    const { data, error: fetchUpdatedError } = await supabase
      .from("submissions")
      .select(`
        id,
        user_id,
        started_at,
        completed_at,
        status,
        physical_health_score,
        mental_health_score,
        overall_readiness_score,
        physical_health_recommendations,
        mental_health_recommendations,
        responses:responses (
          id,
          question_id,
          response_option_id,
          uploaded_file_url
        )
      `)
      .eq("id", latest.id)
      .maybeSingle();

    if (fetchUpdatedError) {
      throw new Error(`Error fetching updated submission: ${fetchUpdatedError.message}`);
    }

    if (!data) {
      throw new Error("Updated submission not found.");
    }

    const submission: Submission = {
      ...data,
      physical_health_recommendations: Array.isArray(
        data.physical_health_recommendations
      )
        ? data.physical_health_recommendations
        : JSON.parse(data.physical_health_recommendations || "[]"),
      mental_health_recommendations: Array.isArray(
        data.mental_health_recommendations
      )
        ? data.mental_health_recommendations
        : JSON.parse(data.mental_health_recommendations || "[]"),
      responses: data.responses || [],
    };

    return submission;
  } catch (error) {
    console.error("updateLatestSubmission Exception:", error);
    throw error;
  }
}




