import { createServerSupabaseClient } from "@/lib/supabase";
import type { SurveyAnswers, SurveyResponseRecord } from "@/types/survey";

const TABLE = "survey_responses";

/** Insert a new survey response — implemented in Phase 4 */
export async function createSurveyResponse(
  answers: SurveyAnswers,
): Promise<{ id: string }> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ answers })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

/** Fetch all responses for admin dashboard — implemented in Phase 11 */
export async function getAllSurveyResponses(): Promise<SurveyResponseRecord[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, created_at, answers")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SurveyResponseRecord[];
}

/** Fetch a single response by ID */
export async function getSurveyResponseById(
  id: string,
): Promise<SurveyResponseRecord | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, created_at, answers")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as SurveyResponseRecord;
}

/** Total response count for admin stats */
export async function getSurveyResponseCount(): Promise<number> {
  const supabase = createServerSupabaseClient();

  const { count, error } = await supabase
    .from(TABLE)
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}
