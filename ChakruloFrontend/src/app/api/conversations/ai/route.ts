import type { CreateAIConversationRequest } from "@/types/supabase/conversation";
import { NextRequest, NextResponse } from "next/server";
import { createAIConversation } from "@/services/internal";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationData: CreateAIConversationRequest = await req.json();
    const conversation = await createAIConversation(conversationData);
    if (!conversation) {
      return NextResponse.json(
        { error: "Failed to create AI conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json(conversation, { status: 201 });
  } catch (err) {
    console.error("Exception creating AI conversation:", err);
    return NextResponse.json(
      { error: "Exception creating AI conversation" },
      { status: 500 }
    );
  }
}
