import { buildSurveySchema } from "@/lib/survey/build-schema";
import {
  getSurveyPath,
  SURVEY_LOCALE_DIRECTION,
  SURVEY_LOCALE_FONTS,
  SURVEY_LOCALE_LABELS,
} from "@/lib/survey/config";
import type { SurveyLocaleDefinition } from "@/lib/survey/types";
import { FA_COPY } from "@/lib/survey/locales/fa/copy";
import {
  FA_FINAL_SECTION,
  FA_QUESTIONS,
  FA_SECTIONS,
  OTHER_OPTION,
} from "@/lib/survey/locales/fa/questions";

const built = buildSurveySchema({
  locale: "fa",
  label: SURVEY_LOCALE_LABELS.fa,
  dir: SURVEY_LOCALE_DIRECTION.fa,
  ready: true,
  path: getSurveyPath("fa"),
  font: SURVEY_LOCALE_FONTS.fa,
  otherOptionLabel: OTHER_OPTION,
  copy: FA_COPY,
  sections: FA_SECTIONS,
  finalSection: FA_FINAL_SECTION,
  questions: FA_QUESTIONS,
} as SurveyLocaleDefinition);

export const faLocaleDefinition: SurveyLocaleDefinition = {
  locale: "fa",
  label: SURVEY_LOCALE_LABELS.fa,
  dir: SURVEY_LOCALE_DIRECTION.fa,
  ready: true,
  path: getSurveyPath("fa"),
  font: SURVEY_LOCALE_FONTS.fa,
  otherOptionLabel: OTHER_OPTION,
  copy: FA_COPY,
  sections: FA_SECTIONS,
  finalSection: FA_FINAL_SECTION,
  questions: FA_QUESTIONS,
  schema: built.schema,
  defaultValues: built.defaultValues,
  createValidPayload: built.createValidPayload,
};
