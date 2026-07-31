/**
 * End-to-end scenario tests for Questionate (no browser required).
 * Usage: npm run test:scenarios
 */
import assert from "node:assert/strict";
import {
  DEFAULT_SURVEY_LOCALE,
  getSurveyDraftKey,
  getSurveyLocaleConfig,
  getSurveyPath,
  isQuestionVisible,
  listReadySurveyLocales,
  SUPPORTED_SURVEY_LOCALES,
  SURVEY_LOCALE_DIRECTION,
  type SurveyLocale,
} from "../lib/survey";
import { Q17_NO as FA_Q17_NO, Q17_YES as FA_Q17_YES } from "../lib/survey/locales/fa/questions";
import { FINAL_QUESTION_MAX_LENGTH, FINAL_QUESTION_MIN_LENGTH } from "../lib/survey-events";
import {
  getFormattedResponseEntries,
  getResponsePreview,
} from "../lib/survey-display";
import { isSurveyComplete, useSurveyProgress } from "../hooks/use-survey-progress";
import type { LocaleCopy } from "../lib/survey/types";
import type { SurveyAnswers, SurveyDraft, SurveyFormValues, SurveyResponseRecord } from "../types/survey";
import { mergeDraftWithDefaults } from "../utils/local-storage";
import { responsesToCsv } from "../utils/csv-export";

type Scenario = {
  name: string;
  run: () => void;
};

const EN_Q17_YES = "Yes";
const EN_Q17_NO = "No";

let passed = 0;
let failed = 0;

function scenario(name: string, run: () => void): Scenario {
  return { name, run };
}

function runScenario({ name, run }: Scenario) {
  try {
    run();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ✗ ${name}`);
    console.error(`    ${message}`);
  }
}

function getQ17Values(locale: SurveyLocale) {
  const { questions } = getSurveyLocaleConfig(locale);
  const q18 = questions.find((question) => question.id === "q18");
  const yes = q18?.conditionalOn?.value ?? EN_Q17_YES;
  const q17 = questions.find((question) => question.id === "q17");
  const no = q17?.options?.find((option) => option !== yes) ?? EN_Q17_NO;
  return { yes, no };
}

function assertParseFails(locale: SurveyLocale, payload: SurveyFormValues) {
  const { schema } = getSurveyLocaleConfig(locale);
  assert.equal(schema.safeParse(payload).success, false);
}

function assertParsePasses(locale: SurveyLocale, payload: SurveyFormValues) {
  const { schema } = getSurveyLocaleConfig(locale);
  assert.equal(schema.safeParse(payload).success, true);
}

function assertCopyComplete(copy: LocaleCopy, locale: SurveyLocale) {
  assert.ok(copy.hero.title.trim(), `${locale} hero.title`);
  assert.ok(copy.hero.subtitle.trim(), `${locale} hero.subtitle`);
  assert.ok(copy.hero.autosaveNote.trim(), `${locale} hero.autosaveNote`);
  assert.ok(copy.hero.sidebar.title.trim(), `${locale} hero.sidebar.title`);
  assert.ok(copy.hero.sidebar.body.trim(), `${locale} hero.sidebar.body`);
  assert.ok(copy.survey.submitLabel.trim(), `${locale} survey.submitLabel`);
  assert.ok(copy.errors.invalidData.trim(), `${locale} errors.invalidData`);
  assert.ok(copy.validation.selectOption.trim(), `${locale} validation.selectOption`);
  assert.ok(copy.survey.otherFieldLabel("X").includes("X"), `${locale} otherFieldLabel`);
  assert.ok(copy.survey.progress.complete(50).length > 0, `${locale} progress.complete`);
}

const locales = SUPPORTED_SURVEY_LOCALES;

const scenarios: Scenario[] = [
  scenario("ready locales include English and Persian", () => {
    const ready = listReadySurveyLocales().map((entry) => entry.locale);
    assert.deepEqual(ready, ["en", "fa"]);
  }),

  scenario("routes and draft keys are locale-specific", () => {
    assert.equal(getSurveyPath("en"), "/");
    assert.equal(getSurveyPath("fa"), "/fa");
    assert.equal(getSurveyDraftKey("en"), "questionate_survey_draft_en");
    assert.equal(getSurveyDraftKey("fa"), "questionate_survey_draft_fa");
    assert.notEqual(getSurveyDraftKey("en"), getSurveyDraftKey("fa"));
  }),

  scenario("Persian locale uses RTL direction", () => {
    assert.equal(SURVEY_LOCALE_DIRECTION.fa, "rtl");
    assert.equal(SURVEY_LOCALE_DIRECTION.en, "ltr");
  }),

  ...locales.flatMap((locale) => [
    scenario(`${locale}: question IDs match across locales`, () => {
      const englishIds = getSurveyLocaleConfig("en").questions.map((q) => q.id).sort();
      const localeIds = getSurveyLocaleConfig(locale).questions.map((q) => q.id).sort();
      assert.deepEqual(localeIds, englishIds);
    }),

    scenario(`${locale}: every section has at least one question`, () => {
      const config = getSurveyLocaleConfig(locale);
      for (const section of config.sections) {
        const count = config.questions.filter((q) => q.sectionId === section.id).length;
        assert.ok(count > 0, `${section.id} should have questions`);
      }
      assert.equal(
        config.questions.filter((q) => q.sectionId === config.finalSection.id).length,
        1,
      );
    }),

    scenario(`${locale}: copy bundle is complete`, () => {
      assertCopyComplete(getSurveyLocaleConfig(locale).copy, locale);
    }),

    scenario(`${locale}: default values fail validation`, () => {
      const { defaultValues } = getSurveyLocaleConfig(locale);
      assertParseFails(locale, defaultValues);
    }),

    scenario(`${locale}: sample payload passes validation`, () => {
      const config = getSurveyLocaleConfig(locale);
      const payload = config.createValidPayload();
      assertParsePasses(locale, payload);
      assert.equal(isSurveyComplete(payload, locale), true);
    }),

    scenario(`${locale}: progress reaches 100% for valid payload`, () => {
      const config = getSurveyLocaleConfig(locale);
      const payload = config.createValidPayload();
      const progress = useSurveyProgress(payload, locale);
      assert.equal(progress.percentage, 100);
    }),

    scenario(`${locale}: fresh form shows incomplete progress`, () => {
      const { defaultValues } = getSurveyLocaleConfig(locale);
      const progress = useSurveyProgress(defaultValues, locale);
      assert.ok(progress.percentage < 100, "fresh form should not be complete");
      assert.ok(progress.percentage < 50, "fresh form should be well under half done");
    }),

    scenario(`${locale}: invalid Instagram usernames are rejected`, () => {
      const payload = getSurveyLocaleConfig(locale).createValidPayload({
        respondentName: "bad handle",
      });
      assertParseFails(locale, payload);

      const empty = getSurveyLocaleConfig(locale).createValidPayload({
        respondentName: "",
      });
      assertParseFails(locale, empty);
    }),

    scenario(`${locale}: valid Instagram username passes (@ optional)`, () => {
      const payload = getSurveyLocaleConfig(locale).createValidPayload({
        respondentName: "@valid_user.name",
      });
      assertParsePasses(locale, payload);
    }),

    scenario(`${locale}: checkbox max-selection rules enforced`, () => {
      const config = getSurveyLocaleConfig(locale);
      const q5Options = config.questions.find((q) => q.id === "q5")?.options ?? [];
      assert.ok(q5Options.length >= 3);

      const tooManyQ5 = config.createValidPayload({
        q5: q5Options.slice(0, 3),
      });
      assertParseFails(locale, tooManyQ5);

      const q10Options = config.questions.find((q) => q.id === "q10")?.options ?? [];
      const tooManyQ10 = config.createValidPayload({
        q10: q10Options.slice(0, 4),
      });
      assertParseFails(locale, tooManyQ10);
    }),

    scenario(`${locale}: "Other" option requires follow-up text`, () => {
      const config = getSurveyLocaleConfig(locale);
      const other = config.otherOptionLabel;
      const missingOther = config.createValidPayload({
        q1: other,
        q1_other: "",
      });
      assertParseFails(locale, missingOther);

      const withOther = config.createValidPayload({
        q1: other,
        q1_other: "Custom product category",
      });
      assertParsePasses(locale, withOther);
    }),

    scenario(`${locale}: q18 required only when q17 is Yes`, () => {
      const config = getSurveyLocaleConfig(locale);
      const { yes, no } = getQ17Values(locale);

      const missingQ18 = config.createValidPayload({ q17: yes, q18: "" });
      assertParseFails(locale, missingQ18);

      const withQ18 = config.createValidPayload({
        q17: yes,
        q18: "Example software stack",
      });
      assertParsePasses(locale, withQ18);

      const noSoftware = config.createValidPayload({ q17: no, q18: "" });
      assertParsePasses(locale, noSoftware);
    }),

    scenario(`${locale}: q18 visibility follows q17`, () => {
      const config = getSurveyLocaleConfig(locale);
      const q18 = config.questions.find((question) => question.id === "q18");
      assert.ok(q18);
      const { yes, no } = getQ17Values(locale);
      const base = config.defaultValues;

      assert.equal(isQuestionVisible(q18!, { ...base, q17: no }), false);
      assert.equal(isQuestionVisible(q18!, { ...base, q17: yes }), true);
    }),

    scenario(`${locale}: final question length bounds enforced`, () => {
      const config = getSurveyLocaleConfig(locale);
      const tooShort = config.createValidPayload({
        qFinal: "x".repeat(FINAL_QUESTION_MIN_LENGTH - 1),
      });
      assertParseFails(locale, tooShort);

      const tooLong = config.createValidPayload({
        qFinal: "x".repeat(FINAL_QUESTION_MAX_LENGTH + 1),
      });
      assertParseFails(locale, tooLong);

      const validLength = config.createValidPayload({
        qFinal: "x".repeat(FINAL_QUESTION_MIN_LENGTH),
      });
      assertParsePasses(locale, validLength);
    }),

    scenario(`${locale}: q17 default matches locale`, () => {
      const { defaultValues } = getSurveyLocaleConfig(locale);
      const { no } = getQ17Values(locale);
      assert.equal(defaultValues.q17, no);
    }),

    scenario(`${locale}: draft merge preserves locale defaults`, () => {
      const { defaultValues } = getSurveyLocaleConfig(locale);
      const merged = mergeDraftWithDefaults(null, locale);
      assert.equal(merged.q17, defaultValues.q17);
      assert.deepEqual(merged.q4, defaultValues.q4);
    }),

    scenario(`${locale}: draft merge overlays saved answers`, () => {
      const q2Option =
        getSurveyLocaleConfig(locale).questions.find((q) => q.id === "q2")?.options?.[0] ??
        "";
      const merged = mergeDraftWithDefaults(
        {
          answers: {
            respondentName: "saved_user",
            q2: q2Option,
          } as SurveyFormValues,
          savedAt: new Date().toISOString(),
        } as SurveyDraft,
        locale,
      );
      assert.equal(merged.respondentName, "saved_user");
      assert.ok(merged.q2);
    }),
  ]),

  scenario("Persian copy has no placeholder labels", () => {
    const { questions, copy } = getSurveyLocaleConfig("fa");
    for (const question of questions) {
      assert.ok(!question.label.includes("[FA]"), question.id);
      if (question.description) {
        assert.ok(!question.description.includes("[FA]"), question.id);
      }
    }
    assert.equal(copy.survey.brandLabel, "پرسشنامه");
  }),

  scenario("Persian q11 excludes removed tool options", () => {
    const q11 = getSurveyLocaleConfig("fa").questions.find((q) => q.id === "q11");
    assert.ok(q11?.options);
    const options = q11!.options!;
    for (const removed of ["Google Sheets", "Shopify", "Trello", "Notion"]) {
      assert.ok(!options.includes(removed), `q11 should not include ${removed}`);
    }
  }),

  scenario("Persian q20 uses four Toman budget bands", () => {
    const q20 = getSurveyLocaleConfig("fa").questions.find((q) => q.id === "q20");
    assert.equal(q20?.options?.length, 4);
    assert.ok(q20?.options?.[0]?.includes("۱ تا ۳"));
    assert.ok(q20?.options?.[3]?.includes("بیش از ۸"));
  }),

  scenario("English q20 uses four Toman budget bands", () => {
    const q20 = getSurveyLocaleConfig("en").questions.find((q) => q.id === "q20");
    assert.equal(q20?.options?.length, 4);
  }),

  scenario("response preview uses locale-specific labels", () => {
    const enResponse: SurveyResponseRecord = {
      id: "1",
      created_at: new Date().toISOString(),
      locale: "en",
      answers: {
        respondentName: "shop_en",
        q1: "Fashion & Clothing",
      },
    };
    const faResponse: SurveyResponseRecord = {
      id: "2",
      created_at: new Date().toISOString(),
      locale: "fa",
      answers: {
        respondentName: "shop_fa",
        q1: "مد و پوشاک",
      },
    };
    assert.match(getResponsePreview(enResponse), /shop_en/);
    assert.match(getResponsePreview(faResponse), /shop_fa/);
  }),

  scenario("admin detail entries respect response locale", () => {
    const config = getSurveyLocaleConfig("fa");
    const payload = config.createValidPayload();
    const entries = getFormattedResponseEntries(
      payload as unknown as SurveyAnswers,
      "fa",
    );
    assert.ok(entries.some((entry) => entry.label === config.questions[0].label));
  }),

  scenario("CSV export includes locale column and escapes values", () => {
    const record: SurveyResponseRecord = {
      id: "abc",
      created_at: "2026-01-01T00:00:00.000Z",
      locale: "fa",
      answers: getSurveyLocaleConfig("fa").createValidPayload() as unknown as SurveyAnswers,
    };
    const csv = responsesToCsv([record], "fa");
    const [header, row] = csv.split("\n");
    assert.ok(header.includes("locale"));
    assert.ok(header.includes("created_at"));
    assert.match(row, /^abc,/);
    assert.match(row, /,fa,/);
  }),

  scenario("CSV export handles empty result set", () => {
    const csv = responsesToCsv([], "en");
    assert.ok(csv.startsWith("id,created_at,locale,respondentName,"));
    assert.ok(csv.endsWith("\n"));
  }),

  scenario("Persian q17 constants match conditional wiring", () => {
    assert.equal(FA_Q17_YES, "بله");
    assert.equal(FA_Q17_NO, "خیر");
    const q18 = getSurveyLocaleConfig("fa").questions.find((q) => q.id === "q18");
    assert.equal(q18?.conditionalOn?.value, FA_Q17_YES);
  }),
];

console.log("Questionate scenario tests\n");

for (const item of scenarios) {
  runScenario(item);
}

console.log(`\n${passed} passed, ${failed} failed (${scenarios.length} scenarios)`);

if (failed > 0) {
  process.exit(1);
}

console.log("\nAll scenarios passed.");
