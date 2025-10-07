import { NextRequest, NextResponse } from "next/server";
import {
  updateLatestSubmission,
  getLatestSubmission,
} from "@/services/internal";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const submission = await getLatestSubmission(userId);
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  return NextResponse.json(submission);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const updatedData = await req.json();

    const updatedSubmission = await updateLatestSubmission(userId, updatedData);

    return NextResponse.json(updatedSubmission, { status: 200 });
  } catch (err: any) {
    console.error("PATCH Exception:", err);

    const message = err instanceof Error ? err.message : "Unknown error occurred";
    const status =
      message.includes("not found") || message.includes("No active submission")
        ? 404
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

