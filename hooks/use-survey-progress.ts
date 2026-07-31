import {
  DEFAULT_SURVEY_LOCALE,
  getQuestionsBySection,
  getSurveyLocaleConfig,
  isQuestionVisible,
  type SurveyLocale,
} from "@/lib/survey";
import { FINAL_QUESTION_MIN_LENGTH } from "@/lib/survey-events";
import type { SurveyFormValues } from "@/types/survey";
import { NUMBERED_QUESTION_COUNT } from "@/types/survey";

interface SurveyProgress {
  percentage: number;
  currentQuestion: number;
  totalQuestions: number;
}

function isAnswered(
  questionId: keyof SurveyFormValues,
  type: string,
  values: SurveyFormValues,
): boolean {
  const value = values[questionId];

  if (type === "checkbox") {
    return Array.isArray(value) && value.length > 0;
  }

  if (type === "textarea" || type === "radio") {
    if (typeof value !== "string" || value.trim().length === 0) return false;
    if (type === "textarea" && questionId === "qFinal") {
      return value.trim().length >= FINAL_QUESTION_MIN_LENGTH;
    }
    return true;
  }

  return false;
}

function isQuestionComplete(
  values: SurveyFormValues,
  question: ReturnType<typeof getSurveyLocaleConfig>["questions"][number],
  otherOptionLabel: string,
): boolean {
  if (!isQuestionVisible(question, values)) return true;

  if (!isAnswered(question.id as keyof SurveyFormValues, question.type, values)) {
    return false;
  }

  if (question.hasOther) {
    const value = values[question.id as keyof SurveyFormValues];
    const needsOther =
      question.type === "radio"
        ? value === otherOptionLabel
        : Array.isArray(value) && value.includes(otherOptionLabel);

    if (needsOther) {
      const otherKey = `${question.id}_other` as keyof SurveyFormValues;
      const other = values[otherKey];
      return typeof other === "string" && other.trim().length > 0;
    }
  }

  return true;
}

/** Calculate survey completion progress from current answers */
export function useSurveyProgress(
  answers: SurveyFormValues,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): SurveyProgress {
  const config = getSurveyLocaleConfig(locale);
  const visibleQuestions = config.questions.filter((question) =>
    isQuestionVisible(question, answers),
  );
  const completed = visibleQuestions.filter((question) =>
    isQuestionComplete(answers, question, config.otherOptionLabel),
  ).length;
  const total = visibleQuestions.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const firstIncomplete = visibleQuestions.find(
    (question) => !isQuestionComplete(answers, question, config.otherOptionLabel),
  );
  const currentQuestion =
    firstIncomplete && typeof firstIncomplete.number === "number"
      ? firstIncomplete.number
      : NUMBERED_QUESTION_COUNT;

  return {
    percentage,
    currentQuestion,
    totalQuestions: NUMBERED_QUESTION_COUNT,
  };
}

/** Check whether all visible answers pass Zod validation */
export function isSurveyComplete(
  answers: SurveyFormValues,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): boolean {
  const { schema } = getSurveyLocaleConfig(locale);
  return schema.safeParse(answers).success;
}
