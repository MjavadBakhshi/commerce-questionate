import { enLocaleDefinition } from "@/lib/survey/locales/en";
import type { SurveyFormValues } from "@/types/survey";

/** @deprecated Use getSurveyLocaleConfig("en").schema */
export const baseSurveySchema = enLocaleDefinition.schema;

export const surveyFormSchema = enLocaleDefinition.schema;

export type { SurveyFormValues };

export const defaultSurveyValues = enLocaleDefinition.defaultValues as SurveyFormValues;

export function createValidSurveyPayload(
  overrides: Partial<SurveyFormValues> = {},
): SurveyFormValues {
  return enLocaleDefinition.createValidPayload(overrides) as SurveyFormValues;
}
