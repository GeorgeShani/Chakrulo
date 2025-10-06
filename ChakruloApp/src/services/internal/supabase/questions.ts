import { createSupabaseClient } from "@/lib/database/connection";
import { Question, QuestionType } from "@/types/supabase/questions";

const supabase = createSupabaseClient();

export async function getQuestionsByType(type: QuestionType) {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      question_number,
      question_type,
      domain,
      question_text,
      advanced_question_text,
      advanced_question_note,
      response_options (
        id,
        option_text,
        option_value
      )
    `)
    .eq("question_type", type)
    .order("question_number")
    .order("option_value", {
      ascending: true,
      foreignTable: "response_options",
    });

  if (error) {
    console.error("Error fetching questions:", error.message);
    return null;
  }

  return data as Question[];
}
