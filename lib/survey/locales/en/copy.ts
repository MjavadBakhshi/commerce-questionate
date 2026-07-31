import {
  FINAL_QUESTION_MAX_LENGTH,
  FINAL_QUESTION_MIN_LENGTH,
} from "@/lib/survey-events";
import type { LocaleCopy } from "@/lib/survey/types";

export const EN_OTHER_OPTION = "Other";

export const EN_COPY: LocaleCopy = {
  hero: {
    badge: "Built for online shop owners",
    title: "Help Us Build the Best Commerce Management Platform",
    subtitle:
      "This survey takes less than 5 minutes. Share your workflow and enter your exact Instagram username so we can reach you for early access.",
    cta: "Start Survey",
    continueCta: "Continue Survey",
    startFresh: "Start Fresh",
  },
  success: {
    title: "Thank you for taking the time to complete our survey!",
    description:
      "Your feedback has been recorded. If you shared your Instagram username, we'll contact you there when early access opens.",
    backLink: "Back to home",
  },
  restore: {
    title: "Continue your survey?",
    description: "Would you like to continue your previous survey?",
    continue: "Continue",
    startFresh: "Start fresh",
  },
  survey: {
    brandLabel: "Questionate",
    headerTitle: "Help us understand your business workflow",
    headerSubtitle:
      "Your answers auto-save as you go — refresh anytime and pick up where you left off.",
    instagramLabel: "Your exact Instagram username",
    instagramHelper:
      "Enter your exact Instagram handle so we can contact you for future early access. Do not include spaces — use the username exactly as it appears on Instagram.",
    instagramPlaceholder: "e.g. @sarasboutique",
    submitLabel: "Submit Survey",
    submittingLabel: "Submitting…",
    incompleteHint: "Complete all required questions to submit.",
  },
  validation: {
    selectOption: "Please select an option",
    describeAnswer: "Please describe your answer",
    requiredText: "This field is required",
    instagramUsername: "Please enter your exact Instagram username",
    invalidInstagramUsername:
      "Enter your exact Instagram username (letters, numbers, . and _ only)",
    maxTwoSelections: "Please select no more than 2 options",
    maxThreeSelections: "Please select no more than 3 options",
    finalMinLength: (min) => `Please write at least ${min} characters`,
    finalMaxLength: (max) => `Please keep your answer under ${max} characters`,
  },
};

export const EN_VALIDATION_LIMITS = {
  finalMinLength: FINAL_QUESTION_MIN_LENGTH,
  finalMaxLength: FINAL_QUESTION_MAX_LENGTH,
} as const;
