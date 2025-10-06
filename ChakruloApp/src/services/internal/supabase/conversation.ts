import type {
  Conversation,
  CreateAIConversationRequest,
} from "@/types/supabase/conversation";
import { createSupabaseClient } from "@/lib/database/connection";
import { User } from "@/types/supabase/user";

const supabase = createSupabaseClient();

export async function createAIConversation(
  request: CreateAIConversationRequest
): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .insert([request])
      .select()
      .single();

    if (error) {
      console.error("Error creating AI conversation:", error);
      return null;
    }

    return data as Conversation;
  } catch (error) {
    console.error("Exception creating AI conversation:", error);
    return null;
  }
}

export async function getAIConversation(
  clerkId: string
): Promise<{ conversation: Conversation | null; error: string | null }> {
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkId)
      .single();
    
    if (userError) {
      if (userError.code === "PGRST116") {
        // No rows returned
        return { conversation: null, error: null };
      }
      console.error("Error fetching current user:", userError);
      return { conversation: null, error: userError.message };
    }

    const userId = (user as User).id;
    
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", userId)
      .eq("type", "ai")
      .single();

    if (convError) {
      if (convError.code === "PGRST116") {
        // No rows returned
        return { conversation: null, error: null };
      }
      console.error("Error fetching AI conversation:", convError);
      return { conversation: null, error: convError.message };
    }

    return { conversation: conversation as Conversation, error: null };
  } catch (error) {
    console.error("Exception fetching AI conversation:", error);
    return {
      conversation: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}