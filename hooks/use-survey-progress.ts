import { isQuestionVisible, SURVEY_QUESTIONS } from "@/lib/survey-questions";
import { FINAL_QUESTION_MIN_LENGTH } from "@/lib/survey-events";
import { surveyFormSchema } from "@/lib/survey-schema";
import type { SurveyAnswers } from "@/types/survey";
import { NUMBERED_QUESTION_COUNT, OTHER_OPTION } from "@/types/survey";

interface SurveyProgress {
  percentage: number;
  currentQuestion: number;
  totalQuestions: number;
}

function isAnswered(
  questionId: string,
  type: string,
  values: SurveyAnswers,
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
  values: SurveyAnswers,
  question: (typeof SURVEY_QUESTIONS)[number],
): boolean {
  if (!isQuestionVisible(question, values)) return true;

  if (!isAnswered(question.id, question.type, values)) return false;

  if (question.hasOther) {
    const value = values[question.id];
    const needsOther =
      question.type === "radio"
        ? value === OTHER_OPTION
        : Array.isArray(value) && value.includes(OTHER_OPTION);

    if (needsOther) {
      const other = values[`${question.id}_other`];
      return typeof other === "string" && other.trim().length > 0;
    }
  }

  return true;
}

/** Calculate survey completion progress from current answers */
export function useSurveyProgress(answers: SurveyAnswers): SurveyProgress {
  const visibleQuestions = SURVEY_QUESTIONS.filter((q) =>
    isQuestionVisible(q, answers),
  );
  const completed = visibleQuestions.filter((q) =>
    isQuestionComplete(answers, q),
  ).length;
  const total = visibleQuestions.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const firstIncomplete = visibleQuestions.find(
    (q) => !isQuestionComplete(answers, q),
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
export function isSurveyComplete(answers: SurveyAnswers): boolean {
  return surveyFormSchema.safeParse(answers).success;
}
