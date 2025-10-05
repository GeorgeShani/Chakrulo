import { Message, SendMessageRequest } from "@/types/supabase/message";
import { createSupabaseClient } from "@/lib/database/connection";
import { ServiceResult } from "@/types/service-result";

const supabase = createSupabaseClient();

export async function getMessages(
  conversationId: string
): Promise<ServiceResult<Message[]>> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    console.error("Exception fetching messages:", err);
    return {
      success: false,
      error: (err as Error).message || "Unexpected error",
    };
  }
}

export async function sendMessage(
  request: SendMessageRequest
): Promise<ServiceResult<Message>> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([request])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Message };
  } catch (err) {
    console.error("Exception sending message:", err);
    return {
      success: false,
      error: (err as Error).message || "Unexpected error",
    };
  }
}
