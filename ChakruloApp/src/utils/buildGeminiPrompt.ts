import { PHYSICAL_HEALTH_SCORE, MENTAL_HEALTH_SCORE } from "@/constants";
import { SimplifiedQuestion } from "@/types/simplified-question";

export function buildGeminiPrompt(
  category: "physical" | "mental",
  questions: SimplifiedQuestion[]
) {
  const categoryDetails =
    category === "physical"
      ? {
          role: "physical health assistant",
          focus: "fitness, endurance, or body conditioning relevant to space travel",
          verbs: "'Increase', 'Train', 'Perform'",
          goal: "improving physical health before preparing to fly to space",
        }
      : {
          role: "mental health assistant",
          focus: "psychological resilience, stress management, or cognitive performance relevant to space travel",
          verbs: "'Practice', 'Enhance', 'Develop'",
          goal: "improving mental readiness before preparing to fly to space",
        };

  // Sum up the scores dynamically
  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  const formattedQuestions = JSON.stringify(questions, null, 2);
  const maxScore =
    category === "physical" ? PHYSICAL_HEALTH_SCORE : MENTAL_HEALTH_SCORE;

  return `You are a professional ${categoryDetails.role} evaluating an astronaut candidate's readiness for spaceflight.
The user completed a ${category} health survey with a score of ${totalScore} out of ${maxScore} (maximum possible score is ${maxScore}).

Below are the questions, their domains, user responses, and corresponding scores (0–3):

${formattedQuestions}

Based on this performance (score: ${totalScore}/${maxScore}), give exactly 3 short, action-based recommendations (each ≤10 words) for ${categoryDetails.goal}. 

Each recommendation must:
- Begin with a verb (e.g., ${categoryDetails.verbs})
- Be specific, expert, and practical
- Focus only on ${categoryDetails.focus}

Output format:
1. …
2. …
3. …

No introductions, summaries, or explanations — output the 3 recommendations only.`;
}
