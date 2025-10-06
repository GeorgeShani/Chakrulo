import { UUID } from "crypto";

export interface Conversation {
  id: UUID;
  type: 'ai';
  user_id?: UUID | null;
  created_at: Date;
}

export interface CreateAIConversationRequest {
  type: 'ai';
  user_id: UUID;
}