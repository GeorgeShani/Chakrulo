import { NextResponse } from "next/server";
import { CreateResponseRequest } from "@/types/supabase/responses";
import { upsertResponse } from "@/services/internal";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateResponseRequest;
    if (!body.submission_id || !body.question_id || !body.response_option_id) {
      return NextResponse.json(
        { error: "submission_id, question_id, and response_option_id are required" },
        { status: 400 }
      );
    }

    const response = await upsertResponse(body);
    return NextResponse.json({ response }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating response:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
