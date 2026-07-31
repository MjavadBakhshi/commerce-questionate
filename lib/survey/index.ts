export {
  DEFAULT_SURVEY_LOCALE,
  getSurveyDraftKey,
  getSurveyPath,
  isSurveyLocale,
  LEGACY_SURVEY_DRAFT_KEY,
  PLANNED_SURVEY_LOCALES,
  SUPPORTED_SURVEY_LOCALES,
  SURVEY_LOCALE_DIRECTION,
  SURVEY_LOCALE_FONTS,
  SURVEY_LOCALE_LABELS,
  type PlannedSurveyLocale,
  type SurveyLocale,
  type SurveyLocaleFilter,
  type SurveyLocaleFont,
} from "@/lib/survey/config";

export type { LocaleCopy, SurveyLocaleDefinition } from "@/lib/survey/types";

export {
  getOtherFieldId,
  getOtherOptionLabel,
  getQuestionsBySection,
  isQuestionVisible,
} from "@/lib/survey/helpers";

export {
  getSurveyLocaleDefinition,
  listReadySurveyLocales,
  listSurveyLocaleDefinitions,
  surveyLocaleRegistry,
} from "@/lib/survey/registry";

export { enLocaleDefinition } from "@/lib/survey/locales/en";
export { faLocaleDefinition } from "@/lib/survey/locales/fa";

import {
  DEFAULT_SURVEY_LOCALE,
  type SurveyLocale,
} from "@/lib/survey/config";
import { getSurveyLocaleDefinition } from "@/lib/survey/registry";

/** Default locale config used by the current English site at `/`. */
export function getDefaultSurveyLocaleDefinition() {
  return getSurveyLocaleDefinition(DEFAULT_SURVEY_LOCALE);
}

export function getSurveyLocaleConfig(locale: SurveyLocale = DEFAULT_SURVEY_LOCALE) {
  return getSurveyLocaleDefinition(locale);
}
