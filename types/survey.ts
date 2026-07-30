export type QuestionType = "radio" | "checkbox" | "textarea";

export interface SurveyQuestion {
  id: string;
  number: number | "final";
  sectionId: string;
  type: QuestionType;
  label: string;
  options?: string[];
  hasOther?: boolean;
  required?: boolean;
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

export type SurveyAnswers = Record<string, string | string[]>;

export interface SurveyResponseRecord {
  id: string;
  created_at: string;
  answers: SurveyAnswers;
}

export interface SurveyDraft {
  answers: SurveyAnswers;
  savedAt: string;
}
