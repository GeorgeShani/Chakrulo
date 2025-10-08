import { createSupabaseClient } from "@/lib/database/connection";
import { CreateResponseRequest } from "@/types/supabase/responses";

const supabase = createSupabaseClient();

export async function createResponse(
  request: CreateResponseRequest
): Promise<Response | null> {
  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("id", request.submission_id)
    .limit(1)
    .single();

  if (submissionError || !submission) {
    throw new Error(submissionError?.message || "Submission not found");
  }

  if (submission.status === "completed") {
    throw new Error("Cannot add response to a completed submission");
  }

  const { data, error } = await supabase
    .from("responses")
    .insert([
      {
        submission_id: request.submission_id,
        question_id: request.question_id,
        response_option_id: request.response_option_id,
        uploaded_file_url: request.uploaded_file_url ?? null,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create response");
  }

  return data as Response;
}