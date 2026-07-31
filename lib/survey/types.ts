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
    cta: string;
    continueCta: string;
    startFresh: string;
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
