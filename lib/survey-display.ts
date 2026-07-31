import {
  DEFAULT_SURVEY_LOCALE,
  getSurveyLocaleConfig,
  type SurveyLocale,
} from "@/lib/survey";
import type { SurveyAnswers, SurveyResponseRecord } from "@/types/survey";

function getQuestionLabels(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE) {
  const { questions } = getSurveyLocaleConfig(locale);
  return Object.fromEntries(questions.map((question) => [question.id, question.label]));
}

/** Human-readable label for a stored answer field */
export function getAnswerFieldLabel(
  fieldId: string,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): string {
  const questionLabels = getQuestionLabels(locale);
  const { otherOptionLabel } = getSurveyLocaleConfig(locale);

  if (fieldId === "respondentName") return "Instagram username";
  if (fieldId.endsWith("_other")) {
    const baseId = fieldId.replace(/_other$/, "");
    const baseLabel = questionLabels[baseId] ?? baseId;
    return `${baseLabel} (${otherOptionLabel})`;
  }
  return questionLabels[fieldId] ?? fieldId;
}

/** Format a single answer value for display */
export function formatAnswerValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

/** Short preview string for the response list */
export function getResponsePreview(response: SurveyResponseRecord): string {
  const { answers } = response;
  const locale = response.locale ?? DEFAULT_SURVEY_LOCALE;
  const { otherOptionLabel } = getSurveyLocaleConfig(locale);
  const name =
    typeof answers.respondentName === "string" ? answers.respondentName : "Anonymous";
  const product =
    typeof answers.q1 === "string" && answers.q1 !== otherOptionLabel
      ? answers.q1
      : typeof answers.q1_other === "string"
        ? answers.q1_other
        : null;

  if (product) return `${name} · ${product}`;
  return name;
}

/** Ordered entries for the detail view */
export function getFormattedResponseEntries(
  answers: SurveyAnswers,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): { label: string; value: string }[] {
  const { questions } = getSurveyLocaleConfig(locale);
  const entries: { label: string; value: string }[] = [];

  if (answers.respondentName) {
    entries.push({
      label: getAnswerFieldLabel("respondentName", locale),
      value: formatAnswerValue(answers.respondentName),
    });
  }

  for (const question of questions) {
    const value = answers[question.id];
    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      continue;
    }

    entries.push({
      label: question.label,
      value: formatAnswerValue(value),
    });

    const otherKey = `${question.id}_other`;
    if (answers[otherKey]) {
      entries.push({
        label: getAnswerFieldLabel(otherKey, locale),
        value: formatAnswerValue(answers[otherKey]),
      });
    }
  }

  return entries;
}

export function formatResponseDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
