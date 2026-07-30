import { z } from "zod";
import {
  FINAL_QUESTION_MAX_LENGTH,
  FINAL_QUESTION_MIN_LENGTH,
} from "@/lib/survey-events";
import { SURVEY_QUESTIONS } from "@/lib/survey-questions";
import { OTHER_OPTION } from "@/types/survey";

const selectMessage = "Please select an option";
const describeMessage = "Please describe your answer";
const requiredTextMessage = "This field is required";
const nameMessage = "Please enter your name or business name";
const finalQuestionMinMessage = `Please write at least ${FINAL_QUESTION_MIN_LENGTH} characters`;
const finalQuestionMaxMessage = `Please keep your answer under ${FINAL_QUESTION_MAX_LENGTH} characters`;
const maxTwoMessage = "Please select no more than 2 options";
const maxThreeMessage = "Please select no more than 3 options";

const stringArray = z.array(z.string());

/** Base object schema — conditional rules applied in superRefine */
export const baseSurveySchema = z.object({
  respondentName: z.string().trim().min(1, nameMessage),
  q1: z.string().min(1, selectMessage),
  q1_other: z.string().optional(),
  q2: z.string().min(1, selectMessage),
  q3: z.string().min(1, selectMessage),
  q4: stringArray.min(1, selectMessage),
  q4_other: z.string().optional(),
  q5: stringArray.min(1, selectMessage).max(2, maxTwoMessage),
  q5_other: z.string().optional(),
  q6: z.string().min(1, selectMessage),
  q6_other: z.string().optional(),
  q7: z.string().min(1, selectMessage),
  q7_other: z.string().optional(),
  q8: z.string().min(1, selectMessage),
  q8_other: z.string().optional(),
  q9: stringArray.min(1, selectMessage).max(2, maxTwoMessage),
  q9_other: z.string().optional(),
  q10: stringArray.min(1, selectMessage).max(3, maxThreeMessage),
  q10_other: z.string().optional(),
  q11: stringArray.min(1, selectMessage),
  q11_other: z.string().optional(),
  q12: z.string().min(1, selectMessage),
  q13: z.string().min(1, selectMessage),
  q14: stringArray.min(1, selectMessage).max(3, maxThreeMessage),
  q14_other: z.string().optional(),
  q15: stringArray.min(1, selectMessage),
  q15_other: z.string().optional(),
  q16: z.string().min(1, selectMessage),
  q16_other: z.string().optional(),
  q17: z.enum(["Yes", "No"], { message: selectMessage }),
  q18: z.string().optional(),
  q19: z.string().min(1, requiredTextMessage),
  q20: z.string().min(1, selectMessage),
  qFinal: z
    .string()
    .min(FINAL_QUESTION_MIN_LENGTH, finalQuestionMinMessage)
    .max(FINAL_QUESTION_MAX_LENGTH, finalQuestionMaxMessage),
});

export type SurveyFormValues = z.infer<typeof baseSurveySchema>;

type OtherRule = {
  kind: "radio" | "checkbox";
  field: keyof SurveyFormValues;
  other: keyof SurveyFormValues;
};

/** Built from question definitions — keeps validation in sync with the form */
const otherRules: OtherRule[] = SURVEY_QUESTIONS.filter((question) => question.hasOther).map(
  (question) => ({
    kind: question.type === "checkbox" ? "checkbox" : "radio",
    field: question.id as keyof SurveyFormValues,
    other: `${question.id}_other` as keyof SurveyFormValues,
  }),
);

function requiresOtherValue(rule: OtherRule, data: SurveyFormValues): boolean {
  const value = data[rule.field];
  if (rule.kind === "radio") {
    return value === OTHER_OPTION;
  }
  return Array.isArray(value) && value.includes(OTHER_OPTION);
}

export const surveyFormSchema = baseSurveySchema.superRefine((data, ctx) => {
  for (const rule of otherRules) {
    if (!requiresOtherValue(rule, data)) continue;

    const otherValue = data[rule.other];
    if (typeof otherValue !== "string" || otherValue.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: describeMessage,
        path: [rule.other],
      });
    }
  }

  if (data.q17 === "Yes") {
    if (!data.q18 || data.q18.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: requiredTextMessage,
        path: ["q18"],
      });
    }
  }
});

export const defaultSurveyValues: SurveyFormValues = {
  respondentName: "",
  q1: "",
  q2: "",
  q3: "",
  q4: [],
  q5: [],
  q6: "",
  q7: "",
  q8: "",
  q9: [],
  q10: [],
  q11: [],
  q12: "",
  q13: "",
  q14: [],
  q15: [],
  q16: "",
  q17: "No",
  q19: "",
  q20: "",
  qFinal: "",
};

const SAMPLE_FINAL_ANSWER =
  "A customer DM'd on Instagram asking about a blue hoodie in size M. I confirmed stock in my spreadsheet, sent payment details via WhatsApp, verified the bank transfer, packed the order, and shipped it with tracking shared the same day. Throughout the process I switched between Instagram, WhatsApp, and Google Sheets to copy customer details manually.";

/** Complete valid payload used by tests and previews */
export function createValidSurveyPayload(
  overrides: Partial<SurveyFormValues> = {},
): SurveyFormValues {
  return {
    respondentName: "Alex Morgan",
    q1: "Fashion & Clothing",
    q2: "5–20",
    q3: "Just me",
    q4: ["Instagram", "WhatsApp"],
    q5: ["Instagram DM", "WhatsApp"],
    q6: "Check inventory",
    q7: "Excel / Google Sheets",
    q8: "Spreadsheet",
    q9: ["Bank transfer verification", "PayPal"],
    q10: ["Package the order", "Update inventory"],
    q11: ["Instagram", "WhatsApp", "Google Sheets"],
    q12: "10–30",
    q13: "5–10",
    q14: ["Replying to customers", "Creating orders"],
    q15: ["Late shipping"],
    q16: "Creating orders",
    q17: "No",
    q19: "Too manual and disconnected from social channels.",
    q20: "$10–30",
    qFinal: SAMPLE_FINAL_ANSWER,
    ...overrides,
  };
}
