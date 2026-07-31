import type { SurveyLocale } from "@/lib/survey/config";
import type { SurveyLocaleDefinition } from "@/lib/survey/types";
import { assertMatchingQuestionIds } from "@/lib/survey/question-ids";
import { enLocaleDefinition } from "@/lib/survey/locales/en";
import { faLocaleDefinition } from "@/lib/survey/locales/fa";

const registry: Record<SurveyLocale, SurveyLocaleDefinition> = {
  en: enLocaleDefinition,
  fa: faLocaleDefinition,
};

for (const locale of Object.keys(registry) as SurveyLocale[]) {
  if (locale === "en") continue;
  assertMatchingQuestionIds(
    registry.en.questions,
    registry[locale].questions,
    locale,
  );
}

export function getSurveyLocaleDefinition(
  locale: SurveyLocale,
): SurveyLocaleDefinition {
  return registry[locale];
}

export function listSurveyLocaleDefinitions(): SurveyLocaleDefinition[] {
  return Object.values(registry);
}

export function listReadySurveyLocales(): SurveyLocaleDefinition[] {
  return listSurveyLocaleDefinitions().filter((definition) => definition.ready);
}

export { registry as surveyLocaleRegistry };
