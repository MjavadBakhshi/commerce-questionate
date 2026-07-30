import { createServerSupabaseClient } from "@/lib/supabase";
import type {
  SurveyAnswers,
  SurveyResponseFilters,
  SurveyResponseRecord,
} from "@/types/survey";

const TABLE = "survey_responses";

/** Insert a new survey response */
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

/** Fetch all responses, newest first */
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

/** Search responses by matching text inside the JSONB answers payload */
export async function searchSurveyResponses(
  query: string,
): Promise<SurveyResponseRecord[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getAllSurveyResponses();

  const responses = await getAllSurveyResponses();
  return responses.filter((response) =>
    JSON.stringify(response.answers).toLowerCase().includes(normalized),
  );
}

/** Filter responses by optional created_at date range (ISO strings) */
export async function filterSurveyResponses(
  filters: SurveyResponseFilters,
): Promise<SurveyResponseRecord[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from(TABLE)
    .select("id, created_at, answers")
    .order("created_at", { ascending: false });

  if (filters.from) {
    query = query.gte("created_at", filters.from);
  }
  if (filters.to) {
    query = query.lte("created_at", filters.to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SurveyResponseRecord[];
}

/** Combined search + date filter for admin dashboard */
export async function querySurveyResponses(options: {
  search?: string;
  filters?: SurveyResponseFilters;
}): Promise<SurveyResponseRecord[]> {
  const { search, filters } = options;

  let responses =
    filters && (filters.from || filters.to)
      ? await filterSurveyResponses(filters)
      : await getAllSurveyResponses();

  if (search?.trim()) {
    const normalized = search.trim().toLowerCase();
    responses = responses.filter((response) =>
      JSON.stringify(response.answers).toLowerCase().includes(normalized),
    );
  }

  return responses;
}
