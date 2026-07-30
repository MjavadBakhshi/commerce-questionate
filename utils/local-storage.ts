import { FINAL_QUESTION_MIN_LENGTH } from "@/lib/survey-events";
import { SURVEY_DRAFT_KEY } from "@/lib/constants";
import type { SurveyDraft } from "@/types/survey";
import { defaultSurveyValues, type SurveyFormValues } from "@/lib/survey-schema";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Merge a saved draft onto the canonical default form values */
function toStringArray(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return fallback;
}

export function mergeDraftWithDefaults(
  draft: SurveyDraft | null,
): SurveyFormValues {
  if (!draft?.answers) return { ...defaultSurveyValues };

  const answers = draft.answers;

  return {
    ...defaultSurveyValues,
    ...answers,
    respondentName:
      typeof answers.respondentName === "string"
        ? answers.respondentName
        : defaultSurveyValues.respondentName,
    q4: toStringArray(answers.q4, defaultSurveyValues.q4),
    q5: toStringArray(answers.q5, defaultSurveyValues.q5),
    q9: toStringArray(answers.q9, defaultSurveyValues.q9),
    q10: toStringArray(answers.q10, defaultSurveyValues.q10),
    q11: toStringArray(answers.q11, defaultSurveyValues.q11),
    q14: toStringArray(answers.q14, defaultSurveyValues.q14),
    q15: toStringArray(answers.q15, defaultSurveyValues.q15),
  } as SurveyFormValues;
}

export function saveSurveyDraft(draft: SurveyDraft): void {
  if (!isBrowser()) return;
  localStorage.setItem(SURVEY_DRAFT_KEY, JSON.stringify(draft));
}

export function loadSurveyDraft(): SurveyDraft | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(SURVEY_DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SurveyDraft;
  } catch {
    return null;
  }
}

export function clearSurveyDraft(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SURVEY_DRAFT_KEY);
}

export function hasSurveyDraft(): boolean {
  const draft = loadSurveyDraft();
  if (!draft?.answers) return false;

  return Object.entries(draft.answers).some(([key, value]) => {
    if (key === "q17" && value === "No") return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return false;
  });
}

export function getInitialSurveyValues(): SurveyFormValues {
  return mergeDraftWithDefaults(loadSurveyDraft());
}

/** Read ?name=, ?user=, or ?username= from the page URL */
export function getRespondentNameFromUrl(): string {
  if (!isBrowser()) return "";
  const params = new URLSearchParams(window.location.search);
  for (const key of ["name", "user", "username"]) {
    const value = params.get(key)?.trim();
    if (value) return value;
  }
  return "";
}

export { FINAL_QUESTION_MIN_LENGTH };
