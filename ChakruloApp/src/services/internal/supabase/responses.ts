import { createSupabaseClient } from "@/lib/database/connection";
import {
  CreateResponseRequest,
  UploadResponseFileRequest,
} from "@/types/supabase/responses";
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

  const { data, error } = await supabase
    .from("responses")
    .upsert(
      {
        submission_id: request.submission_id,
        question_id: request.question_id,
        response_option_id: request.response_option_id,
        uploaded_file_url: request.uploaded_file_url ?? null,
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

export async function uploadResponseFile(
  request: UploadResponseFileRequest
): Promise<string> {
  if (!request.uploaded_file) {
    throw new Error("No file provided for upload");
  }

  const originalName = request.uploaded_file.name;
  const ext = originalName.split(".").pop();
  const timestamp = new Date().toISOString();
  const safeName = `${timestamp}.${ext}`;
  const path = `advanced_questions_files/${request.submission_id}/${request.question_id}/${request.response_option_id}/${safeName}`;

  const uploadedUrl = await uploadFile(
    "chakrulo-storage-bucket",
    path,
    request.uploaded_file,
    "3600"
  );

  if (!uploadedUrl) {
    throw new Error("Failed to upload file to storage");
  }

  return uploadedUrl;
}