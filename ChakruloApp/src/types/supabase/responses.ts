import { UUID } from "crypto";

export interface Response {
  id: UUID;
  submission_id: UUID;
  question_id: UUID;
  response_option_id: UUID;
  uploaded_file_url: string | null;
  created_at: Date;
}

export interface CreateResponseRequest {
  submission_id: UUID;
  question_id: UUID;
  response_option_id: UUID;
  uploaded_file_url?: string | null;
}

export interface UploadResponseFileRequest {
  submission_id: UUID;
  question_id: UUID;
  response_option_id: UUID;
  uploaded_file: File;
}
