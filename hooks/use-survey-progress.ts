import type { SurveyAnswers } from "@/types/survey";

interface SurveyProgress {
  percentage: number;
  currentQuestion: number;
  totalQuestions: number;
}

/** Calculate survey completion progress — implemented in Phase 7 */
export function useSurveyProgress(_answers: SurveyAnswers): SurveyProgress {
  return {
    percentage: 0,
    currentQuestion: 1,
    totalQuestions: 20,
  };
}
