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
    .order("question_number", {
      ascending: true
    });

  if (error) {
    console.error("Error fetching questions:", error.message);
    return null;
  }

  const sortedData = data?.map((q) => ({
    ...q,
    response_options: q.response_options.sort(
      (a, b) => a.option_value - b.option_value
    ),
  }));

  return sortedData as Question[];
}
