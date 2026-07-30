/** Shared option label for free-text follow-ups */
export const OTHER_OPTION = "Other";

export type QuestionType = "radio" | "checkbox" | "textarea";

export interface SurveyQuestion {
  id: string;
  number: number | "final";
  sectionId: string;
  type: QuestionType;
  label: string;
  description?: string;
  options?: readonly string[];
  hasOther?: boolean;
  required?: boolean;
  maxSelections?: number;
  maxLength?: number;
  conditionalOn?: {
    questionId: string;
    value: string;
  };
  minLength?: number;
}

export interface SurveySection {
  id: string;
  number: number;
  title: string;
  description: string;
}

/** Stored answer payload — radio/textarea as string, checkbox as string[] */
export type SurveyAnswers = Record<string, string | string[] | undefined>;

export interface SurveyResponseRecord {
  id: string;
  created_at: string;
  answers: SurveyAnswers;
}

export interface SurveyDraft {
  answers: SurveyAnswers;
  savedAt: string;
}

export interface SurveyResponseFilters {
  from?: string;
  to?: string;
}

export type { SurveyFormValues } from "@/lib/survey-schema";

export const SURVEY_FIELD_IDS = [
  "respondentName",
  "q1",
  "q1_other",
  "q2",
  "q3",
  "q4",
  "q4_other",
  "q5",
  "q5_other",
  "q6",
  "q6_other",
  "q7",
  "q7_other",
  "q8",
  "q8_other",
  "q9",
  "q9_other",
  "q10",
  "q10_other",
  "q11",
  "q11_other",
  "q12",
  "q13",
  "q14",
  "q14_other",
  "q15",
  "q15_other",
  "q16",
  "q16_other",
  "q17",
  "q18",
  "q19",
  "q20",
  "qFinal",
] as const;

export const NUMBERED_QUESTION_COUNT = 20;
