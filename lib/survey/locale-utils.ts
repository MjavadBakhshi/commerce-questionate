import type { SurveyQuestion } from "@/types/survey";

/** Swap the locale-specific "Other" option label across all questions. */
export function replaceOtherOptionInQuestions(
  questions: SurveyQuestion[],
  fromLabel: string,
  toLabel: string,
): SurveyQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: question.options?.map((option) => (option === fromLabel ? toLabel : option)),
    conditionalOn: question.conditionalOn
      ? {
          ...question.conditionalOn,
          value:
            question.conditionalOn.value === fromLabel
              ? toLabel
              : question.conditionalOn.value,
        }
      : undefined,
  }));
}
