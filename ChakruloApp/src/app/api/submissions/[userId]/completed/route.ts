import { NextRequest, NextResponse } from "next/server";
import { getLatestSubmission } from "@/services/internal";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const submission = await getLatestSubmission(userId, true);
  if (!submission) {
    return NextResponse.json(
      { error: "Completed submission not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(submission);
}
