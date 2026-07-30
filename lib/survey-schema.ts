import { z } from "zod";
import { OTHER_OPTION } from "@/types/survey";
import type { SurveyFormValues } from "@/types/survey";

const selectMessage = "Please select an option";
const describeMessage = "Please describe your answer";
const requiredTextMessage = "This field is required";
const finalQuestionMessage = "Please write at least 100 characters";

const stringArray = z.array(z.string());

/** Base object schema — conditional rules applied in superRefine */
const baseSurveySchema = z.object({
  q1: z.string().min(1, selectMessage),
  q1_other: z.string().optional(),
  q2: z.string().min(1, selectMessage),
  q3: z.string().min(1, selectMessage),
  q4: stringArray.min(1, selectMessage),
  q4_other: z.string().optional(),
  q5: z.string().min(1, selectMessage),
  q5_other: z.string().optional(),
  q6: z.string().min(1, selectMessage),
  q6_other: z.string().optional(),
  q7: z.string().min(1, selectMessage),
  q7_other: z.string().optional(),
  q8: z.string().min(1, selectMessage),
  q8_other: z.string().optional(),
  q9: z.string().min(1, selectMessage),
  q9_other: z.string().optional(),
  q10: stringArray.min(1, selectMessage),
  q10_other: z.string().optional(),
  q11: stringArray.min(1, selectMessage),
  q11_other: z.string().optional(),
  q12: z.string().min(1, selectMessage),
  q13: z.string().min(1, selectMessage),
  q14: stringArray.min(1, selectMessage),
  q14_other: z.string().optional(),
  q15: stringArray.min(1, selectMessage),
  q15_other: z.string().optional(),
  q16: z.string().min(1, selectMessage),
  q16_other: z.string().optional(),
  q17: z.enum(["Yes", "No"], { message: selectMessage }),
  q18: z.string().optional(),
  q19: z.string().min(1, requiredTextMessage),
  q20: z.string().min(1, selectMessage),
  qFinal: z.string().min(100, finalQuestionMessage),
});

type OtherRule =
  | { kind: "radio"; field: keyof SurveyFormValues; other: keyof SurveyFormValues }
  | { kind: "checkbox"; field: keyof SurveyFormValues; other: keyof SurveyFormValues };

const otherRules: OtherRule[] = [
  { kind: "radio", field: "q1", other: "q1_other" },
  { kind: "checkbox", field: "q4", other: "q4_other" },
  { kind: "radio", field: "q5", other: "q5_other" },
  { kind: "radio", field: "q6", other: "q6_other" },
  { kind: "radio", field: "q7", other: "q7_other" },
  { kind: "radio", field: "q8", other: "q8_other" },
  { kind: "radio", field: "q9", other: "q9_other" },
  { kind: "checkbox", field: "q10", other: "q10_other" },
  { kind: "checkbox", field: "q11", other: "q11_other" },
  { kind: "checkbox", field: "q14", other: "q14_other" },
  { kind: "checkbox", field: "q15", other: "q15_other" },
  { kind: "radio", field: "q16", other: "q16_other" },
];

function requiresOtherValue(
  rule: OtherRule,
  data: SurveyFormValues,
): boolean {
  const value = data[rule.field];
  if (rule.kind === "radio") {
    return value === OTHER_OPTION;
  }
  return Array.isArray(value) && value.includes(OTHER_OPTION);
}

export const surveyFormSchema = baseSurveySchema.superRefine((data, ctx) => {
  for (const rule of otherRules) {
    if (!requiresOtherValue(rule, data as SurveyFormValues)) continue;

    const otherValue = data[rule.other as keyof typeof data];
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

export type { SurveyFormValues };

export const defaultSurveyValues: SurveyFormValues = {
  q1: "",
  q2: "",
  q3: "",
  q4: [],
  q5: "",
  q6: "",
  q7: "",
  q8: "",
  q9: "",
  q10: [],
  q11: [],
  q12: "",
  q13: "",
  q14: [],
  q15: [],
  q16: "",
  q17: "",
  q19: "",
  q20: "",
  qFinal: "",
};
