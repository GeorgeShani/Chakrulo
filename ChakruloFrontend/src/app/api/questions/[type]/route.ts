import { NextResponse } from "next/server";
import { getQuestionsByType } from "@/services/internal";
import { QuestionType } from "@/types/supabase/questions";

// Map URL-friendly slugs to your enum values
const typeMap: Record<string, QuestionType> = {
  physical: QuestionType.PhysicalHealth,
  mental: QuestionType.MentalHealth,
};

export async function GET(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = await params;

    const mappedType = typeMap[type];
    if (!mappedType) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const questions = await getQuestionsByType(mappedType);

    if (!questions) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
