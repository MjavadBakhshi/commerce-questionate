/**
 * Phase 0 locale registry smoke test.
 * Usage: npm run test:locales
 */
import assert from "node:assert/strict";
import {
  DEFAULT_SURVEY_LOCALE,
  getSurveyDraftKey,
  getSurveyPath,
  listReadySurveyLocales,
  listSurveyLocaleDefinitions,
  SUPPORTED_SURVEY_LOCALES,
  surveyLocaleRegistry,
} from "../lib/survey";
import { SURVEY_QUESTION_IDS } from "../lib/survey/question-ids";

function assertEqual<T>(actual: T, expected: T, message: string) {
  assert.deepEqual(actual, expected, message);
}

console.log("1/4 Checking supported locales…");
assertEqual(SUPPORTED_SURVEY_LOCALES, ["en", "fa"], "Supported locales should be en + fa");
assertEqual(DEFAULT_SURVEY_LOCALE, "en", "Default locale should be English");
assertEqual(getSurveyPath("en"), "/", "English should stay at /");
assertEqual(getSurveyPath("fa"), "/fa", "Persian should use /fa");

console.log("2/4 Checking registry entries…");
assertEqual(
  listSurveyLocaleDefinitions().length,
  2,
  "Registry should contain two locale definitions",
);

const english = surveyLocaleRegistry.en;
const persian = surveyLocaleRegistry.fa;

assert(english.ready, "English locale should be ready");
assert(!persian.ready, "Persian locale should remain disabled until Phase 3 content is final");

console.log("3/4 Checking question ID parity…");
const englishIds = english.questions.map((question) => question.id).sort();
const persianIds = persian.questions.map((question) => question.id).sort();
assertEqual(englishIds, [...SURVEY_QUESTION_IDS].sort(), "English IDs should match baseline");
assertEqual(persianIds, englishIds, "Persian stub IDs should match English baseline");

console.log("4/4 Checking draft keys and ready list…");
assertEqual(getSurveyDraftKey("en"), "questionate_survey_draft_en", "English draft key");
assertEqual(getSurveyDraftKey("fa"), "questionate_survey_draft_fa", "Persian draft key");
assertEqual(listReadySurveyLocales().map((locale) => locale.locale), ["en"], "Only English is ready");

console.log("\nLocale registry passed.");
console.log(`  Registered: ${SUPPORTED_SURVEY_LOCALES.join(", ")}`);
console.log(`  Ready: ${listReadySurveyLocales().map((locale) => locale.locale).join(", ")}`);
