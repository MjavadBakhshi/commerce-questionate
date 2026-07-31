import {
  DEFAULT_SURVEY_LOCALE,
  getSurveyDraftKey,
  getSurveyLocaleConfig,
  LEGACY_SURVEY_DRAFT_KEY,
  type SurveyLocale,
} from "@/lib/survey";
import { FINAL_QUESTION_MIN_LENGTH } from "@/lib/survey-events";
import type { SurveyDraft } from "@/types/survey";
import type { SurveyFormValues } from "@/types/survey";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getDraftStorageKey(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE): string {
  return getSurveyDraftKey(locale);
}

/** Merge a saved draft onto the canonical default form values */
function toStringArray(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return fallback;
}

export function mergeDraftWithDefaults(
  draft: SurveyDraft | null,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): SurveyFormValues {
  const { defaultValues } = getSurveyLocaleConfig(locale);
  if (!draft?.answers) return { ...defaultValues };

  const answers = draft.answers;

  return {
    ...defaultValues,
    ...answers,
    respondentName:
      typeof answers.respondentName === "string"
        ? answers.respondentName
        : defaultValues.respondentName,
    q4: toStringArray(answers.q4, defaultValues.q4 as string[]),
    q5: toStringArray(answers.q5, defaultValues.q5 as string[]),
    q9: toStringArray(answers.q9, defaultValues.q9 as string[]),
    q10: toStringArray(answers.q10, defaultValues.q10 as string[]),
    q11: toStringArray(answers.q11, defaultValues.q11 as string[]),
    q14: toStringArray(answers.q14, defaultValues.q14 as string[]),
    q15: toStringArray(answers.q15, defaultValues.q15 as string[]),
  } as SurveyFormValues;
}

export function saveSurveyDraft(
  draft: SurveyDraft,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): void {
  if (!isBrowser()) return;
  localStorage.setItem(getDraftStorageKey(locale), JSON.stringify(draft));
}

export function loadSurveyDraft(
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): SurveyDraft | null {
  if (!isBrowser()) return null;

  let raw = localStorage.getItem(getDraftStorageKey(locale));
  if (!raw && locale === DEFAULT_SURVEY_LOCALE) {
    raw = localStorage.getItem(LEGACY_SURVEY_DRAFT_KEY);
  }
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SurveyDraft;
  } catch {
    return null;
  }
}

export function clearSurveyDraft(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE): void {
  if (!isBrowser()) return;
  localStorage.removeItem(getDraftStorageKey(locale));
  if (locale === DEFAULT_SURVEY_LOCALE) {
    localStorage.removeItem(LEGACY_SURVEY_DRAFT_KEY);
  }
}

export function hasSurveyDraft(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE): boolean {
  const draft = loadSurveyDraft(locale);
  if (!draft?.answers) return false;

  const { questions } = getSurveyLocaleConfig(locale);
  const q18 = questions.find((question) => question.id === "q18");
  const q17Yes = q18?.conditionalOn?.value;
  const q17No = questions
    .find((question) => question.id === "q17")
    ?.options?.find((option) => option !== q17Yes);

  return Object.entries(draft.answers).some(([key, value]) => {
    if (key === "q17" && value === q17No) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return false;
  });
}

export function getInitialSurveyValues(
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): SurveyFormValues {
  return mergeDraftWithDefaults(loadSurveyDraft(locale), locale);
}

/** Read Instagram username prefill params from the page URL */
export function getRespondentNameFromUrl(): string {
  if (!isBrowser()) return "";
  const params = new URLSearchParams(window.location.search);
  for (const key of ["instagram", "username", "user", "name"]) {
    const value = params.get(key)?.trim();
    if (value) return value;
  }
  return "";
}

export { FINAL_QUESTION_MIN_LENGTH };
