"use server";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import {
  getSurveyResponseById,
  getSurveyResponseCount,
  querySurveyResponses,
} from "@/services/surveyService";
import type { SurveyResponseFilters } from "@/types/survey";
import { responsesToCsv } from "@/utils/csv-export";

const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === "authenticated";
}

export async function verifyAdminPassword(
  password: string,
): Promise<{ success: boolean }> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false };
  }

  if (password !== adminPassword) {
    return { success: false };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/admin",
  });

  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
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
