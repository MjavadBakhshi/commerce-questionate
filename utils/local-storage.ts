import { SURVEY_DRAFT_KEY } from "@/lib/constants";
import type { SurveyDraft } from "@/types/survey";

function isBrowser(): boolean {
  return typeof window !== "undefined";
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
  return loadSurveyDraft() !== null;
}
