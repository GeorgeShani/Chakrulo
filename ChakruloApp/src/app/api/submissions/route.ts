import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/services/internal";

export async function POST(req: NextRequest) {
  try {
    const submissionData = await req.json();
    const submission = await createSubmission(submissionData);

    return NextResponse.json(submission, { status: 201 });
  } catch (err: any) {
    console.error("Submission creation error:", err.message);
    if (err.message.includes("in-progress survey")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: err.message || "Unexpected error creating submission" },
      { status: 500 }
    );
  }
}
