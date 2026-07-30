/**
 * Phase 3 smoke test — survey definitions, Zod schema, and service-layer types.
 * Usage: npm run test:phase3
 */
import assert from "node:assert/strict";
import {
  FINAL_QUESTION_SECTION,
  getQuestionsBySection,
  SURVEY_QUESTIONS,
  SURVEY_SECTIONS,
} from "../lib/survey-questions";
import {
  createValidSurveyPayload,
  defaultSurveyValues,
  surveyFormSchema,
} from "../lib/survey-schema";
import { NUMBERED_QUESTION_COUNT, OTHER_OPTION } from "../types/survey";

function assertEqual<T>(actual: T, expected: T, message: string) {
  assert.deepEqual(actual, expected, message);
}

console.log("1/5 Checking survey sections and questions…");
assertEqual(SURVEY_SECTIONS.length, 5, "Expected 5 survey sections");

const numberedQuestions = SURVEY_QUESTIONS.filter(
  (question) => typeof question.number === "number",
);
const finalQuestions = SURVEY_QUESTIONS.filter((question) => question.number === "final");

assertEqual(numberedQuestions.length, NUMBERED_QUESTION_COUNT, "Expected 20 numbered questions");
assertEqual(finalQuestions.length, 1, "Expected 1 final question");
assertEqual(SURVEY_QUESTIONS.length, 21, "Expected 21 total questions");

for (const section of SURVEY_SECTIONS) {
  const sectionQuestions = getQuestionsBySection(section.id);
  assert(sectionQuestions.length > 0, `${section.id} should have questions`);
}

const finalSectionQuestions = getQuestionsBySection(FINAL_QUESTION_SECTION.id);
assertEqual(finalSectionQuestions.length, 1, "Final section should have 1 question");

console.log("2/5 Checking Other-option coverage…");
const otherQuestions = SURVEY_QUESTIONS.filter((question) => question.hasOther);
assert(otherQuestions.length >= 12, "Expected at least 12 questions with Other option");

for (const question of otherQuestions) {
  assert(question.options?.includes(OTHER_OPTION), `${question.id} should include Other option`);
}

console.log("3/5 Validating complete payload…");
const validPayload = createValidSurveyPayload();
assert(surveyFormSchema.safeParse(validPayload).success, "Valid payload should pass schema");

console.log("4/5 Validating conditional and error rules…");
assert(!surveyFormSchema.safeParse(defaultSurveyValues).success, "Empty defaults should fail");

const missingFinal = createValidSurveyPayload({ qFinal: "too short" });
assert(!surveyFormSchema.safeParse(missingFinal).success, "Short final answer should fail");

const missingOther = createValidSurveyPayload({
  q1: OTHER_OPTION,
  q1_other: "",
});
assert(!surveyFormSchema.safeParse(missingOther).success, "Other without description should fail");

const missingQ18 = createValidSurveyPayload({
  q17: "Yes",
  q18: "",
});
assert(!surveyFormSchema.safeParse(missingQ18).success, "Q18 required when Q17 is Yes");

const validWithQ18 = createValidSurveyPayload({
  q17: "Yes",
  q18: "Shopify and Google Sheets",
});
assert(surveyFormSchema.safeParse(validWithQ18).success, "Q18 should pass when provided");

console.log("5/5 Checking conditional question metadata…");
const q18 = SURVEY_QUESTIONS.find((question) => question.id === "q18");
assert(q18?.conditionalOn?.questionId === "q17", "Q18 should depend on Q17");
assert(q18?.conditionalOn?.value === "Yes", "Q18 should show when Q17 is Yes");

console.log("\nPhase 3 passed.");
console.log(`  Sections: ${SURVEY_SECTIONS.length}`);
console.log(`  Questions: ${SURVEY_QUESTIONS.length}`);
console.log(`  Schema rules: OK`);
