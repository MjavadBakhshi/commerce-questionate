/** Dispatched from the hero when the user chooses to discard a saved draft */
export const SURVEY_START_FRESH_EVENT = "questionate:start-fresh";

/** Minimum character count for the final open-ended question */
export const FINAL_QUESTION_MIN_LENGTH = 100;

/** Maximum character count for the final open-ended question */
export const FINAL_QUESTION_MAX_LENGTH = 1000;

/** URL search params checked for a pre-filled respondent name */
export const RESPONDENT_NAME_PARAMS = ["name", "user", "username"] as const;
