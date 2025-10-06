import { UUID } from "crypto";

export interface Message {
  id: UUID;
  conversation_id: UUID;
  sender_id?: UUID | null;
  is_ai: boolean;
  text: string;
  created_at: Date;
}

export interface SendMessageRequest {
  conversation_id: UUID;
  sender_id: UUID;
  is_ai?: boolean | null;
  text: string;
}