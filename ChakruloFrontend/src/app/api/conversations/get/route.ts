import { NextRequest, NextResponse } from "next/server";
import { getAIConversation } from "@/services/internal";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId: userClerkId } = await auth();
    if (!userClerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversation, error } = await getAIConversation(userClerkId);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ conversation }, { status: 200 });
  } catch (err) {
    console.error("Exception in GET /api/conversations/get:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
