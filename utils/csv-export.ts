import type { SurveyResponseRecord } from "@/types/survey";

/** Escape a value for CSV output */
function escapeCsvValue(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Flatten survey responses to CSV — fully implemented in Phase 11 */
export function responsesToCsv(responses: SurveyResponseRecord[]): string {
  if (responses.length === 0) {
    return "id,created_at\n";
  }

  const headers = ["id", "created_at"];
  const rows = responses.map((r) =>
    [r.id, r.created_at].map(String).map(escapeCsvValue).join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}
