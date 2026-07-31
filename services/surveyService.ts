import "server-only";

import { DEFAULT_SURVEY_LOCALE, isSurveyLocale, type SurveyLocale } from "@/lib/survey/config";
import { createServerSupabaseClient } from "@/lib/supabase";
import type {
  SurveyAnswers,
  SurveyResponseFilters,
  SurveyResponseRecord,
} from "@/types/survey";

const TABLE = "survey_responses";
const SELECT_FIELDS = "id, created_at, locale, answers";

type SurveyResponseRow = {
  id: string;
  created_at: string;
  locale?: string | null;
  answers: SurveyAnswers;
};

function normalizeSurveyResponse(row: SurveyResponseRow): SurveyResponseRecord {
  const locale =
    row.locale && isSurveyLocale(row.locale) ? row.locale : DEFAULT_SURVEY_LOCALE;

  return {
    id: row.id,
    created_at: row.created_at,
    locale,
    answers: row.answers,
  };
}

/** Insert a new survey response */
export async function createSurveyResponse(
  answers: SurveyAnswers,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
): Promise<{ id: string }> {
  if (!isSurveyLocale(locale)) {
    throw new Error(`Unsupported survey locale: ${locale}`);
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ answers, locale })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

/** Fetch all responses, newest first */
export async function getAllSurveyResponses(
  filters?: SurveyResponseFilters,
): Promise<SurveyResponseRecord[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from(TABLE)
    .select(SELECT_FIELDS)
    .order("created_at", { ascending: false });

  if (filters?.locale && filters.locale !== "all") {
    query = query.eq("locale", filters.locale);
  }
  if (filters?.from) {
    query = query.gte("created_at", filters.from);
  }
  if (filters?.to) {
    query = query.lte("created_at", filters.to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalizeSurveyResponse(row as SurveyResponseRow));
}

/** Fetch a single response by ID */
export async function getSurveyResponseById(
  id: string,
): Promise<SurveyResponseRecord | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT_FIELDS)
    .eq("id", id)
    .single();

  if (error) return null;
  return normalizeSurveyResponse(data as SurveyResponseRow);
}

/** Total response count for admin stats */
export async function getSurveyResponseCount(
  filters?: Pick<SurveyResponseFilters, "locale">,
): Promise<number> {
  const supabase = createServerSupabaseClient();

  let query = supabase.from(TABLE).select("*", { count: "exact", head: true });

  if (filters?.locale && filters.locale !== "all") {
    query = query.eq("locale", filters.locale);
  }

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

/** Search responses by matching text inside the JSONB answers payload */
export async function searchSurveyResponses(
  query: string,
  filters?: SurveyResponseFilters,
): Promise<SurveyResponseRecord[]> {
  const normalized = query.trim().toLowerCase();
  const responses = await getAllSurveyResponses(filters);

  if (!normalized) return responses;

  return responses.filter((response) =>
    JSON.stringify(response.answers).toLowerCase().includes(normalized),
  );
}

/** Filter responses by optional created_at date range and locale */
export async function filterSurveyResponses(
  filters: SurveyResponseFilters,
): Promise<SurveyResponseRecord[]> {
  return getAllSurveyResponses(filters);
}

/** Combined search + date/locale filter for admin dashboard */
export async function querySurveyResponses(options: {
  search?: string;
  filters?: SurveyResponseFilters;
}): Promise<SurveyResponseRecord[]> {
  const { search, filters } = options;
  const responses = await getAllSurveyResponses(filters);

  if (!search?.trim()) {
    return responses;
  }

  const normalized = search.trim().toLowerCase();
  return responses.filter((response) =>
    JSON.stringify(response.answers).toLowerCase().includes(normalized),
  );
}
