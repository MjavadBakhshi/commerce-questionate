import { z } from "zod";
import {
  FINAL_QUESTION_MAX_LENGTH,
  FINAL_QUESTION_MIN_LENGTH,
} from "@/lib/survey-events";
import type { SurveyFormValues } from "@/types/survey";
import type { SurveyLocaleDefinition } from "@/lib/survey/types";
import type { SurveyQuestion } from "@/types/survey";

type FormValues = SurveyFormValues;

function isValidInstagramUsername(value: string): boolean {
  const username = value.trim().replace(/^@/, "");
  return (
    username.length >= 1 &&
    username.length <= 30 &&
    /^[a-zA-Z0-9._]+$/.test(username)
  );
}

function getQuestionOptions(question: SurveyQuestion | undefined): readonly string[] {
  return question?.options ?? [];
}

function buildDefaultValues(questions: SurveyQuestion[]): SurveyFormValues {
  const q18 = questions.find((question) => question.id === "q18");
  const q17 = questions.find((question) => question.id === "q17");
  const q17YesValue = q18?.conditionalOn?.value;
  const q17Default =
    q17?.options?.find((option) => option !== q17YesValue) ?? "";

  const values: Record<string, string | string[] | undefined> = {
    respondentName: "",
  };

  for (const question of questions) {
    if (question.type === "checkbox") {
      values[question.id] = [];
      if (question.hasOther) {
        values[`${question.id}_other`] = "";
      }
      continue;
    }

    values[question.id] = question.id === "q17" ? q17Default : "";

    if (question.hasOther) {
      values[`${question.id}_other`] = "";
    }
  }

  return values as unknown as SurveyFormValues;
}

function buildSampleFinalAnswer(locale: SurveyLocaleDefinition["locale"]): string {
  if (locale === "fa") {
    return (
      "مشتری از طریق دایرکت اینستاگرام درباره یک هودی آبی سایز M پرسید. موجودی را در فایل اکسل بررسی کردم، " +
      "اطلاعات پرداخت را در واتساپ فرستادم، واریز بانکی را تایید کردم، سفارش را بسته‌بندی کردم و همان روز کد رهگیری را ارسال کردم. " +
      "در این فرایند چند بار بین اینستاگرام، واتساپ و Google Sheets جابه‌جا شدم و اطلاعات مشتری را دستی کپی کردم."
    );
  }

  return (
    "A customer DM'd on Instagram asking about a blue hoodie in size M. I confirmed stock in my spreadsheet, sent payment details via WhatsApp, " +
    "verified the bank transfer, packed the order, and shipped it with tracking shared the same day. Throughout the process I switched between Instagram, WhatsApp, and Google Sheets to copy customer details manually."
  );
}

export function buildSurveySchema(definition: SurveyLocaleDefinition) {
  const { copy, questions, otherOptionLabel } = definition;
  const stringArray = z.array(z.string());
  const q17 = questions.find((question) => question.id === "q17");
  const q17Options = getQuestionOptions(q17);

  if (q17Options.length < 2) {
    throw new Error(`Locale "${definition.locale}" q17 must define at least two options.`);
  }

  const baseSurveySchema = z.object({
    respondentName: z
      .string()
      .trim()
      .min(1, copy.validation.instagramUsername)
      .refine(isValidInstagramUsername, {
        message: copy.validation.invalidInstagramUsername,
      }),
    q1: z.string().min(1, copy.validation.selectOption),
    q1_other: z.string().optional(),
    q2: z.string().min(1, copy.validation.selectOption),
    q3: z.string().min(1, copy.validation.selectOption),
    q4: stringArray.min(1, copy.validation.selectOption),
    q4_other: z.string().optional(),
    q5: stringArray.min(1, copy.validation.selectOption).max(2, copy.validation.maxTwoSelections),
    q5_other: z.string().optional(),
    q6: z.string().min(1, copy.validation.selectOption),
    q6_other: z.string().optional(),
    q7: z.string().min(1, copy.validation.selectOption),
    q7_other: z.string().optional(),
    q8: z.string().min(1, copy.validation.selectOption),
    q8_other: z.string().optional(),
    q9: stringArray.min(1, copy.validation.selectOption).max(2, copy.validation.maxTwoSelections),
    q9_other: z.string().optional(),
    q10: stringArray.min(1, copy.validation.selectOption).max(3, copy.validation.maxThreeSelections),
    q10_other: z.string().optional(),
    q11: stringArray.min(1, copy.validation.selectOption),
    q11_other: z.string().optional(),
    q12: z.string().min(1, copy.validation.selectOption),
    q13: z.string().min(1, copy.validation.selectOption),
    q14: stringArray.min(1, copy.validation.selectOption).max(3, copy.validation.maxThreeSelections),
    q14_other: z.string().optional(),
    q15: stringArray.min(1, copy.validation.selectOption),
    q15_other: z.string().optional(),
    q16: z.string().min(1, copy.validation.selectOption),
    q16_other: z.string().optional(),
    q17: z.enum(q17Options as [string, ...string[]], {
      message: copy.validation.selectOption,
    }),
    q18: z.string().optional(),
    q19: z.string().min(1, copy.validation.requiredText),
    q20: z.string().min(1, copy.validation.selectOption),
    qFinal: z
      .string()
      .min(FINAL_QUESTION_MIN_LENGTH, copy.validation.finalMinLength(FINAL_QUESTION_MIN_LENGTH))
      .max(FINAL_QUESTION_MAX_LENGTH, copy.validation.finalMaxLength(FINAL_QUESTION_MAX_LENGTH)),
  });

  type SurveyFormValues = z.infer<typeof baseSurveySchema>;

  const otherRules = questions
    .filter((question) => question.hasOther)
    .map((question) => ({
      kind: question.type === "checkbox" ? ("checkbox" as const) : ("radio" as const),
      field: question.id as keyof SurveyFormValues,
      other: `${question.id}_other` as keyof SurveyFormValues,
    }));

  function requiresOtherValue(
    rule: (typeof otherRules)[number],
    data: SurveyFormValues,
  ): boolean {
    const value = data[rule.field];
    if (rule.kind === "radio") {
      return value === otherOptionLabel;
    }
    return Array.isArray(value) && value.includes(otherOptionLabel);
  }

  const q18 = questions.find((question) => question.id === "q18");
  const q17YesValue = q18?.conditionalOn?.value;

  const surveyFormSchema = baseSurveySchema.superRefine((data, ctx) => {
    for (const rule of otherRules) {
      if (!requiresOtherValue(rule, data)) continue;

      const otherValue = data[rule.other];
      if (typeof otherValue !== "string" || otherValue.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: copy.validation.describeAnswer,
          path: [rule.other],
        });
      }
    }

    if (q17YesValue && data.q17 === q17YesValue) {
      if (!data.q18 || data.q18.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: copy.validation.requiredText,
          path: ["q18"],
        });
      }
    }
  });

  const defaultValues = buildDefaultValues(questions) as SurveyFormValues;

  function createValidPayload(
    overrides: Partial<SurveyFormValues> = {},
  ): SurveyFormValues {
    const sample = buildSamplePayload(definition, buildSampleFinalAnswer(definition.locale));
    return { ...sample, ...overrides };
  }

  return {
    schema: surveyFormSchema,
    defaultValues,
    createValidPayload,
  };
}

function buildSamplePayload(
  definition: SurveyLocaleDefinition,
  finalAnswer: string,
): SurveyFormValues {
  const { questions } = definition;
  const q17 = questions.find((question) => question.id === "q17");
  const q18 = questions.find((question) => question.id === "q18");
  const q17YesValue = q18?.conditionalOn?.value;
  const q17No =
    q17?.options?.find((option) => option !== q17YesValue) ?? "No";

  return {
    respondentName: "sarasboutique",
    q1: pickOption(questions, "q1", 0),
    q2: pickOption(questions, "q2", 1),
    q3: pickOption(questions, "q3", 0),
    q4: [pickOption(questions, "q4", 0), pickOption(questions, "q4", 1)],
    q5: [pickOption(questions, "q5", 0), pickOption(questions, "q5", 1)],
    q6: pickOption(questions, "q6", 0),
    q7: pickOption(questions, "q7", 1),
    q8: pickOption(questions, "q8", 1),
    q9: [pickOption(questions, "q9", 0), pickOption(questions, "q9", 2)],
    q10: [pickOption(questions, "q10", 0), pickOption(questions, "q10", 4)],
    q11: [
      pickOption(questions, "q11", 0),
      pickOption(questions, "q11", 1),
      pickOption(questions, "q11", 2),
    ],
    q12: pickOption(questions, "q12", 1),
    q13: pickOption(questions, "q13", 1),
    q14: [pickOption(questions, "q14", 0), pickOption(questions, "q14", 1)],
    q15: [pickOption(questions, "q15", 3)],
    q16: pickOption(questions, "q16", 1),
    q17: q17No,
    q19: definition.locale === "fa"
      ? "خیلی دستی است و با کانال‌های اجتماعی یکپارچه نیست."
      : "Too manual and disconnected from social channels.",
    q20: pickOption(questions, "q20", 1),
    qFinal: finalAnswer,
  } as unknown as SurveyFormValues;
}

function pickOption(
  questions: SurveyQuestion[],
  questionId: string,
  index: number,
): string {
  const question = questions.find((entry) => entry.id === questionId);
  const options = question?.options ?? [];
  return options[index] ?? options[0] ?? "";
}
