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
    autosaveNote:
      "Progress saves automatically. Refresh the page anytime — your answers will still be here.",
    cta: "Start Survey",
    continueCta: "Continue Survey",
    startFresh: "Start Fresh",
    startFreshPrompt: "Want to clear your saved answers and begin again?",
    sidebar: {
      tagline: "Trusted research",
      title: "Your workflow insights shape the tools we build next.",
      body: "We are talking to real shop owners — not guessing. Every answer helps us design software that saves time, reduces mistakes, and makes selling online feel exciting again.",
    },
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
    cancel: "Cancel",
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
    submitErrorTitle: "Submission failed",
    otherFieldLabel: (otherOption) => `Tell us more about "${otherOption}"`,
    otherFieldPlaceholder: "Please specify…",
    finalQuestionPlaceholder:
      "Describe the full journey from first contact to shipment…",
    characterCount: (current, max, min) => {
      const base = `${current.toLocaleString()} / ${max.toLocaleString()} maximum`;
      return min !== undefined && current < min
        ? `${base} (${min.toLocaleString()} minimum)`
        : base;
    },
    progress: {
      complete: (percentage) => `${percentage}% complete`,
      questionOf: (current, total) => `Question ${current} of ${total}`,
      ariaLabel: (percentage, current, total) =>
        `Survey progress: ${percentage}% complete, question ${current} of ${total}`,
    },
  },
  errors: {
    invalidData: "Invalid survey data. Please check your answers.",
    saveFailed: "Failed to save survey response. Please try again.",
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
