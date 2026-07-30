"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_LOGOUT_COOKIE,
  ADMIN_SESSION_COOKIE,
  adminSessionCookieClearOptions,
  adminSessionCookieSetOptions,
} from "@/lib/admin-session";

export async function loginAdminFormAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    redirect("/admin/login?error=config");
  }

  if (password !== adminPassword) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", adminSessionCookieSetOptions());
  cookieStore.set(ADMIN_LOGOUT_COOKIE, "", adminSessionCookieClearOptions());

  redirect("/admin");
}
