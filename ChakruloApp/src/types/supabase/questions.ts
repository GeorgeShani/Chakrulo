import { UUID } from "crypto";

export const QuestionType = {
  PhysicalHealth: "💪 Physical Health & Functional Capacity",
  MentalHealth: "🧠 Mental Health & Cognitive Readiness",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id: UUID;
  question_number: number;
  question_type: QuestionType;
  domain: string;
  question_text: string;
  advanced_question_text: string | null;
  advanced_question_note: string | null;
  response_options: ResponseOption[];
}

export interface ResponseOption { 
  id: UUID;
  option_text: string;
  option_value: number;
}