import type { z } from "zod";
import type { SurveyQuestion, SurveySection, SurveyFormValues } from "@/types/survey";
import type {
  SurveyLocale,
  SurveyLocaleFont,
} from "@/lib/survey/config";

export interface LocaleCopy {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    autosaveNote: string;
    cta: string;
    continueCta: string;
    startFresh: string;
    startFreshPrompt: string;
    sidebar: {
      tagline: string;
      title: string;
      body: string;
    };
  };
  success: {
    title: string;
    description: string;
    backLink: string;
  };
  restore: {
    title: string;
    description: string;
    continue: string;
    startFresh: string;
    cancel: string;
  };
  survey: {
    brandLabel: string;
    headerTitle: string;
    headerSubtitle: string;
    instagramLabel: string;
    instagramHelper: string;
    instagramPlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    incompleteHint: string;
    submitErrorTitle: string;
    otherFieldLabel: (otherOption: string) => string;
    otherFieldPlaceholder: string;
    finalQuestionPlaceholder: string;
    characterCount: (current: number, max: number, min?: number) => string;
    progress: {
      complete: (percentage: number) => string;
      questionOf: (current: number, total: number) => string;
      ariaLabel: (percentage: number, current: number, total: number) => string;
    };
  };
  errors: {
    invalidData: string;
    saveFailed: string;
  };
  validation: {
    selectOption: string;
    describeAnswer: string;
    requiredText: string;
    instagramUsername: string;
    invalidInstagramUsername: string;
    maxTwoSelections: string;
    maxThreeSelections: string;
    finalMinLength: (min: number) => string;
    finalMaxLength: (max: number) => string;
  };
}

export interface FinalQuestionSection {
  id: string;
  title: string;
  description: string;
}

export interface SurveyLocaleDefinition {
  locale: SurveyLocale;
  label: string;
  dir: "ltr" | "rtl";
  /** When false, public routes should not serve this locale yet. */
  ready: boolean;
  path: string;
  font: SurveyLocaleFont;
  otherOptionLabel: string;
  copy: LocaleCopy;
  sections: SurveySection[];
  finalSection: FinalQuestionSection;
  questions: SurveyQuestion[];
  schema: z.ZodTypeAny;
  defaultValues: SurveyFormValues;
  createValidPayload: (overrides?: Partial<SurveyFormValues>) => SurveyFormValues;
}
