"use server";

import { cookies } from "next/headers";
import {
  ADMIN_LOGOUT_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "@/lib/admin-session";
import {
  getSurveyResponseById,
  getSurveyResponseCount,
  querySurveyResponses,
} from "@/services/surveyService";
import type { SurveyResponseFilters } from "@/types/survey";
import { responsesToCsv } from "@/utils/csv-export";

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  const loggedOut = cookieStore.get(ADMIN_LOGOUT_COOKIE);
  return session?.value === "authenticated" && loggedOut?.value !== "1";
}

export async function fetchAdminStats() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  const total = await getSurveyResponseCount();
  return { total };
}

export async function fetchResponses(options?: {
  search?: string;
  filters?: SurveyResponseFilters;
}) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  return querySurveyResponses(options ?? {});
}

export async function fetchResponseById(id: string) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  return getSurveyResponseById(id);
}

export async function exportResponsesCsv(options?: {
  search?: string;
  filters?: SurveyResponseFilters;
}): Promise<string> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  const responses = await querySurveyResponses(options ?? {});
  return responsesToCsv(responses);
}
