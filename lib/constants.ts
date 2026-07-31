import { EN_COPY } from "@/lib/survey/locales/en/copy";

/** Brand colors */
export const COLORS = {
  primary: "#059669",
  background: "#F4F7F5",
  card: "#FFFFFF",
} as const;

/**
 * English landing copy.
 * @deprecated Prefer `getSurveyLocaleConfig("en").copy` for new locale-aware UI.
 */
export const COPY = {
  hero: {
    title: EN_COPY.hero.title,
    subtitle: EN_COPY.hero.subtitle,
    cta: EN_COPY.hero.cta,
  },
  success: {
    title: EN_COPY.success.title,
    description: EN_COPY.success.description,
  },
  restore: {
    title: EN_COPY.restore.title,
    description: EN_COPY.restore.description,
    continue: EN_COPY.restore.continue,
    startFresh: EN_COPY.restore.startFresh,
  },
} as const;

/**
 * @deprecated Use `getSurveyDraftKey(locale)` from `@/lib/survey`.
 * Legacy single-locale draft key kept for English backward compatibility.
 */
export const SURVEY_DRAFT_KEY = "questionate_survey_draft";

/** Admin session cookie name */
export const ADMIN_SESSION_COOKIE = "questionate_admin_session";
