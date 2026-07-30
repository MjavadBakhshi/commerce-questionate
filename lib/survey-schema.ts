import { z } from "zod";

/** Zod validation schema — fully defined in Phase 3 */
export const surveyFormSchema = z.object({});

export type SurveyFormValues = z.infer<typeof surveyFormSchema>;
