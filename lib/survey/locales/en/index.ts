import { buildSurveySchema } from "@/lib/survey/build-schema";
import {
  getSurveyPath,
  SURVEY_LOCALE_DIRECTION,
  SURVEY_LOCALE_FONTS,
  SURVEY_LOCALE_LABELS,
} from "@/lib/survey/config";
import type { SurveyLocaleDefinition } from "@/lib/survey/types";
import { EN_COPY } from "@/lib/survey/locales/en/copy";
import {
  EN_FINAL_SECTION,
  EN_QUESTIONS,
  EN_SECTIONS,
  OTHER_OPTION,
} from "@/lib/survey/locales/en/questions";

const built = buildSurveySchema({
  locale: "en",
  label: SURVEY_LOCALE_LABELS.en,
  dir: SURVEY_LOCALE_DIRECTION.en,
  ready: true,
  path: getSurveyPath("en"),
  font: SURVEY_LOCALE_FONTS.en,
  otherOptionLabel: OTHER_OPTION,
  copy: EN_COPY,
  sections: EN_SECTIONS,
  finalSection: EN_FINAL_SECTION,
  questions: EN_QUESTIONS,
} as SurveyLocaleDefinition);

export const enLocaleDefinition: SurveyLocaleDefinition = {
  locale: "en",
  label: SURVEY_LOCALE_LABELS.en,
  dir: SURVEY_LOCALE_DIRECTION.en,
  ready: true,
  path: getSurveyPath("en"),
  font: SURVEY_LOCALE_FONTS.en,
  otherOptionLabel: OTHER_OPTION,
  copy: EN_COPY,
  sections: EN_SECTIONS,
  finalSection: EN_FINAL_SECTION,
  questions: EN_QUESTIONS,
  schema: built.schema,
  defaultValues: built.defaultValues,
  createValidPayload: built.createValidPayload,
};
