import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import {
  ADMIN_LOGOUT_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin Login | Questionate",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Invalid password. Please try again.",
  config: "Admin password is not configured on the server.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "authenticated" &&
    cookieStore.get(ADMIN_LOGOUT_COOKIE)?.value !== "1";

  if (isAuthenticated) {
    redirect("/admin");
  }

  const { error: errorCode } = await searchParams;
  const error = errorCode ? ERROR_MESSAGES[errorCode] : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <AdminLoginForm error={error} />
    </main>
  );
}
