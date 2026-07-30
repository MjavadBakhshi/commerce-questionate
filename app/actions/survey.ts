"use server";

import { surveyFormSchema, type SurveyFormValues } from "@/lib/survey-schema";
import { createSurveyResponse } from "@/services/surveyService";

export type SubmitSurveyResult =
  | { success: true; id: string }
  | { success: false; error: string };

/** Submit validated survey answers */
export async function submitSurvey(
  answers: SurveyFormValues,
): Promise<SubmitSurveyResult> {
  const parsed = surveyFormSchema.safeParse(answers);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid survey data. Please check your answers.",
    };
  }

  try {
    const { id } = await createSurveyResponse(parsed.data);
    return { success: true, id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save survey response.";
    return { success: false, error: message };
  }
}
