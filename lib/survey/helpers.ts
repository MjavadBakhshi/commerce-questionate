import type { SurveyFormValues, SurveyQuestion } from "@/types/survey";
import {
  DEFAULT_SURVEY_LOCALE,
  type SurveyLocale,
} from "@/lib/survey/config";
import { getSurveyLocaleDefinition } from "@/lib/survey/registry";

export function getQuestionsBySection(
  sectionId: string,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): SurveyQuestion[] {
  const { questions } = getSurveyLocaleDefinition(locale);
  return questions.filter((question) => question.sectionId === sectionId);
}

export function getOtherFieldId(questionId: string): string {
  return `${questionId}_other`;
}

export function isQuestionVisible(
  question: SurveyQuestion,
  values: SurveyFormValues,
): boolean {
  if (!question.conditionalOn) return true;
  const { questionId, value } = question.conditionalOn;
  return values[questionId as keyof SurveyFormValues] === value;
}

export function getOtherOptionLabel(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE): string {
  return getSurveyLocaleDefinition(locale).otherOptionLabel;
}
