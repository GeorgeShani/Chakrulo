import { NextResponse } from "next/server";
import { generateText } from "@/ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await generateText(prompt);
  return NextResponse.json({ text: response });
}
