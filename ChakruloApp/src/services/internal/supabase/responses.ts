import { createSupabaseClient } from "@/lib/database/connection";
import { CreateResponseRequest } from "@/types/supabase/responses";
import { uploadFile } from "./storage";

const supabase = createSupabaseClient();

export async function upsertResponse(
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

  let uploadedFileUrl = null;
  if (request.uploaded_file) {
    const originalName = request.uploaded_file.name;
    const ext = originalName.split(".").pop();
    const safeName = `${Date.now()}.${ext}`;
    const path = `advanced_questions_files/${request.submission_id}/${request.question_id}/${request.response_option_id}/${safeName}`;
    
    uploadedFileUrl = await uploadFile(
      "chakrulo-storage-bucket",
      path,
      request.uploaded_file
    );
  }

  const { data, error } = await supabase
    .from("responses")
    .upsert(
      {
        submission_id: request.submission_id,
        question_id: request.question_id,
        response_option_id: request.response_option_id,
        uploaded_file_url: uploadedFileUrl,
      },
      {
        onConflict: "submission_id,question_id",
      }
    )
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create response");
  }

  return data as Response;
}
