"use server";

import { surveyFormSchema } from "@/lib/survey-schema";
import { createSurveyResponse } from "@/services/surveyService";
import type { SurveyAnswers } from "@/types/survey";

export type SubmitSurveyResult =
  | { success: true; id: string }
  | { success: false; error: string };

/** Submit validated survey answers — wired in Phase 4 */
export async function submitSurvey(
  answers: SurveyAnswers,
): Promise<SubmitSurveyResult> {
  const parsed = surveyFormSchema.safeParse(answers);

  if (!parsed.success) {
    return { success: false, error: "Invalid survey data. Please check your answers." };
  }

  try {
    const { id } = await createSurveyResponse(parsed.data as SurveyAnswers);
    return { success: true, id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save survey response.";
    return { success: false, error: message };
  }
}
