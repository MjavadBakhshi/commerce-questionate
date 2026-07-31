import type { SurveyQuestion } from "@/types/survey";

/** Stable field keys shared by every locale version of the survey. */
export const SURVEY_QUESTION_IDS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
  "q15",
  "q16",
  "q17",
  "q18",
  "q19",
  "q20",
  "qFinal",
] as const;

export type SurveyQuestionId = (typeof SURVEY_QUESTION_IDS)[number];

/** Ensures a locale uses the same question IDs before it can go live. */
export function assertMatchingQuestionIds(
  baseline: SurveyQuestion[],
  candidate: SurveyQuestion[],
  locale: string,
): void {
  const baselineIds = baseline.map((question) => question.id).sort();
  const candidateIds = candidate.map((question) => question.id).sort();

  if (baselineIds.join("|") !== candidateIds.join("|")) {
    throw new Error(
      `Locale "${locale}" question IDs do not match the baseline locale.`,
    );
  }
}
