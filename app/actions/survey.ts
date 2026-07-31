"use server";

import { getSurveyLocaleConfig, DEFAULT_SURVEY_LOCALE } from "@/lib/survey";
import { createSurveyResponse } from "@/services/surveyService";
import type { SurveyFormValues } from "@/types/survey";

export type SubmitSurveyResult =
  | { success: true; id: string }
  | { success: false; error: string };

/** Submit validated survey answers */
export async function submitSurvey(
  answers: SurveyFormValues,
  locale = DEFAULT_SURVEY_LOCALE,
): Promise<SubmitSurveyResult> {
  const { schema } = getSurveyLocaleConfig(locale);
  const parsed = schema.safeParse(answers);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid survey data. Please check your answers.",
    };
  }

  try {
    const { id } = await createSurveyResponse(parsed.data, locale);
    return { success: true, id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save survey response.";
    return { success: false, error: message };
  }
}
