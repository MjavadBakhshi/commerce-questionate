/**
 * Locked locale decisions for Questionate v2.
 * Add new languages here and in the registry — no scattered string checks.
 */

export const SUPPORTED_SURVEY_LOCALES = ["en", "fa"] as const;

export type SurveyLocale = (typeof SUPPORTED_SURVEY_LOCALES)[number];

/** English stays at `/` for backward-compatible links. */
export const DEFAULT_SURVEY_LOCALE: SurveyLocale = "en";

/** Locales planned but not registered yet (Arabic). */
export const PLANNED_SURVEY_LOCALES = ["ar"] as const;

export type PlannedSurveyLocale = (typeof PLANNED_SURVEY_LOCALES)[number];

export function isSurveyLocale(value: string): value is SurveyLocale {
  return (SUPPORTED_SURVEY_LOCALES as readonly string[]).includes(value);
}

export function getSurveyPath(locale: SurveyLocale): string {
  return locale === DEFAULT_SURVEY_LOCALE ? "/" : `/${locale}`;
}

export function getSurveyDraftKey(locale: SurveyLocale): string {
  return `questionate_survey_draft_${locale}`;
}

/** Legacy single-locale draft key (English only, pre-v2). */
export const LEGACY_SURVEY_DRAFT_KEY = "questionate_survey_draft";

export type SurveyLocaleFilter = SurveyLocale | "all";

export const SURVEY_LOCALE_LABELS: Record<SurveyLocale, string> = {
  en: "English",
  fa: "فارسی",
};

export const SURVEY_LOCALE_DIRECTION: Record<SurveyLocale, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl",
};

export type SurveyLocaleFont = "inter" | "byekan";

export const SURVEY_LOCALE_FONTS: Record<SurveyLocale, SurveyLocaleFont> = {
  en: "inter",
  fa: "byekan",
};
