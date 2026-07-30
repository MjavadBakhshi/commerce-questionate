import { SURVEY_QUESTIONS } from "@/lib/survey-questions";
import type { SurveyAnswers, SurveyResponseRecord } from "@/types/survey";

const QUESTION_LABELS = Object.fromEntries(
  SURVEY_QUESTIONS.map((question) => [question.id, question.label]),
);

/** Human-readable label for a stored answer field */
export function getAnswerFieldLabel(fieldId: string): string {
  if (fieldId === "respondentName") return "Respondent";
  if (fieldId.endsWith("_other")) {
    const baseId = fieldId.replace(/_other$/, "");
    const baseLabel = QUESTION_LABELS[baseId] ?? baseId;
    return `${baseLabel} (Other)`;
  }
  return QUESTION_LABELS[fieldId] ?? fieldId;
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
  const name =
    typeof answers.respondentName === "string" ? answers.respondentName : "Anonymous";
  const product =
    typeof answers.q1 === "string" && answers.q1 !== "Other"
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
): { label: string; value: string }[] {
  const entries: { label: string; value: string }[] = [];

  if (answers.respondentName) {
    entries.push({
      label: getAnswerFieldLabel("respondentName"),
      value: formatAnswerValue(answers.respondentName),
    });
  }

  for (const question of SURVEY_QUESTIONS) {
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
        label: getAnswerFieldLabel(otherKey),
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
