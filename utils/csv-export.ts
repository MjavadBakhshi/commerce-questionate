import {
  DEFAULT_SURVEY_LOCALE,
  getSurveyLocaleConfig,
  type SurveyLocale,
} from "@/lib/survey";
import { SURVEY_FIELD_IDS, type SurveyResponseRecord } from "@/types/survey";

/** Escape a value for CSV output */
function escapeCsvValue(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatAnswerValue(value: unknown): string {
  if (Array.isArray(value)) return value.join("; ");
  if (value === undefined || value === null) return "";
  return String(value);
}

function getCsvHeaders(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE): string[] {
  const { questions } = getSurveyLocaleConfig(locale);
  const questionLabels = questions.map((question) => question.label);
  return ["id", "created_at", "locale", "respondentName", ...questionLabels];
}

/** Flatten survey responses to CSV rows */
export function responsesToCsv(
  responses: SurveyResponseRecord[],
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): string {
  const headers = getCsvHeaders(locale);

  if (responses.length === 0) {
    return `${headers.join(",")}\n`;
  }

  const rows = responses.map((response) => {
    const responseLocale = response.locale;
    const { questions } = getSurveyLocaleConfig(responseLocale);
    const cells = [
      response.id,
      response.created_at,
      response.locale,
      formatAnswerValue(response.answers.respondentName),
      ...questions.map((question) => formatAnswerValue(response.answers[question.id])),
    ];
    return cells.map((cell) => escapeCsvValue(String(cell))).join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/** @deprecated Use locale-aware headers via responsesToCsv(responses, locale) */
export { SURVEY_FIELD_IDS };
