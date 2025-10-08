import { NextResponse } from "next/server";
import { uploadResponseFile } from "@/services/internal";
import { UUID } from "crypto";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const submission_id = formData.get("submission_id") as UUID;
    const question_id = formData.get("question_id") as UUID;
    const response_option_id = formData.get("response_option_id") as UUID;
    const uploaded_file = formData.get("uploaded_file") as File | null;

    if (
      !submission_id ||
      !question_id ||
      !response_option_id ||
      !uploaded_file
    ) {
      return NextResponse.json(
        { error: "submission_id, question_id, response_option_id, and uploaded_file are required" },
        { status: 400 }
      );
    }

    const uploadedFileUrl = await uploadResponseFile({
      submission_id,
      question_id,
      response_option_id,
      uploaded_file,
    });

    return NextResponse.json({ uploadedFileUrl }, { status: 201 });
  } catch (err: any) {
    console.error("Error uploading file:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
