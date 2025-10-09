import { UUID } from "crypto";

export interface CreateSubmissionRequest {
  user_id: UUID;
}

export interface UpdateSubmissionRequest {
  completed_at?: Date | null;
  status?: "in_progress" | "completed" | null;
  physical_health_score?: number | null; // %
  mental_health_score?: number | null; // %
  overall_readiness_score?: number | null; // %
  physical_health_recommendations?: string[] | null;
  mental_health_recommendations?: string[] | null;
}

export interface Submission {
  id: UUID;
  user_id: UUID;
  started_at: Date;
  completed_at: Date;
  status: "in_progress" | "completed";
  physical_health_score: number; // %
  mental_health_score: number; // %
  overall_readiness_score: number; // %
  physical_health_recommendations: string[];
  mental_health_recommendations: string[];
  responses: Response[];
}

export interface Response {
  id: UUID;
  question_id: UUID;
  response_option_id: UUID;
  uploaded_file_url: string | null;
}