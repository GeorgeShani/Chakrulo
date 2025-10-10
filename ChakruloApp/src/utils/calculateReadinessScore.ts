import { PHYSICAL_HEALTH_SCORE, MENTAL_HEALTH_SCORE } from "@/constants";
import { QuestionnaireResponse } from "@/types/supabase/questions";

export const calculateReadinessScore = (category: 'physical' | 'mental', responses: QuestionnaireResponse[]): number => {
  const maxScore = category === 'physical' ? PHYSICAL_HEALTH_SCORE : MENTAL_HEALTH_SCORE;
  const score = responses.reduce((sum, response) => sum + response.selectedOptionValue, 0);
  return Math.round((score / maxScore) * 100);
};

export const calculateOverallReadinessScore = (physicalScore: number, mentalScore: number): number => { 
  return Math.round((physicalScore + mentalScore) / 2);
}