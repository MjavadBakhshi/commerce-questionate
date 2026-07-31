/**
 * Persian question content — structural stub for Phase 0.
 * Question IDs match English; labels/options will be translated in Phase 3.
 */
import { EN_FINAL_SECTION, EN_QUESTIONS, EN_SECTIONS, OTHER_OPTION } from "@/lib/survey/locales/en/questions";
import { replaceOtherOptionInQuestions } from "@/lib/survey/locale-utils";
import { FA_OTHER_OPTION } from "@/lib/survey/locales/fa/copy";
import type { SurveySection } from "@/types/survey";

export { FA_OTHER_OPTION as OTHER_OPTION };

export const FA_SECTIONS: SurveySection[] = EN_SECTIONS.map((section) => ({
  ...section,
  title: `[FA] ${section.title}`,
  description: `[FA] ${section.description}`,
}));

export const FA_FINAL_SECTION = {
  ...EN_FINAL_SECTION,
  title: `[FA] ${EN_FINAL_SECTION.title}`,
  description: `[FA] ${EN_FINAL_SECTION.description}`,
} as const;

export const FA_QUESTIONS = replaceOtherOptionInQuestions(
  EN_QUESTIONS.map((question) => ({
    ...question,
    label: `[FA] ${question.label}`,
    description: question.description ? `[FA] ${question.description}` : undefined,
  })),
  OTHER_OPTION,
  FA_OTHER_OPTION,
);
