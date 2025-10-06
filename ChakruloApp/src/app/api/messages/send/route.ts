import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/services/internal";
import { auth } from "@clerk/nextjs/server";
import type { SendMessageRequest } from "@/types/supabase/message";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messageData: SendMessageRequest = await req.json();

    // Validate that the sender_id matches the authenticated user
    if (messageData.sender_id !== userId) {
      return NextResponse.json(
        { error: "Sender ID does not match authenticated user" },
        { status: 403 }
      );
    }

    const result = await sendMessage(messageData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (err) {
    console.error("Exception in POST /messages/send:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
