import { SURVEY_QUESTIONS } from "@/lib/survey-questions";
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

/** Column headers: metadata + one column per survey field */
function getCsvHeaders(): string[] {
  return ["id", "created_at", ...SURVEY_FIELD_IDS];
}

/** Flatten survey responses to CSV rows */
export function responsesToCsv(responses: SurveyResponseRecord[]): string {
  const headers = getCsvHeaders();

  if (responses.length === 0) {
    return `${headers.join(",")}\n`;
  }

  const rows = responses.map((response) => {
    const cells = [
      response.id,
      response.created_at,
      ...SURVEY_FIELD_IDS.map((fieldId) => {
        const question = SURVEY_QUESTIONS.find((q) => q.id === fieldId);
        if (question) {
          return formatAnswerValue(response.answers[fieldId]);
        }
        return formatAnswerValue(response.answers[fieldId]);
      }),
    ];
    return cells.map((cell) => escapeCsvValue(String(cell))).join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
