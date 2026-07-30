/** Brand colors from build-prompt.md */
export const COLORS = {
  primary: "#2563EB",
  background: "#F8FAFC",
  card: "#FFFFFF",
} as const;

/** Hero & landing copy */
export const COPY = {
  hero: {
    title: "Help Us Build the Best Commerce Management Platform",
    subtitle:
      "This survey takes less than 5 minutes to complete. Your feedback will directly influence the features we build for online businesses.",
    cta: "Start Survey",
  },
  success: {
    title: "Thank you for taking the time to complete our survey!",
    description:
      "Your feedback has been successfully recorded and will help us build better tools for online businesses.",
  },
  restore: {
    title: "Continue your survey?",
    description: "Would you like to continue your previous survey?",
    continue: "Continue",
    startFresh: "Start fresh",
  },
} as const;

/** LocalStorage key for draft survey responses */
export const SURVEY_DRAFT_KEY = "questionate_survey_draft";

/** Admin session cookie name */
export const ADMIN_SESSION_COOKIE = "questionate_admin_session";
