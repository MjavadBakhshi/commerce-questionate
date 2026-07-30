import { cookies } from "next/headers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  ADMIN_LOGOUT_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "@/lib/admin-session";
import {
  getAllSurveyResponses,
  getSurveyResponseCount,
} from "@/services/surveyService";
import type { SurveyResponseRecord } from "@/types/survey";

export const metadata: Metadata = {
  title: "Admin | Questionate",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "authenticated" &&
    cookieStore.get(ADMIN_LOGOUT_COOKIE)?.value !== "1";

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  let responses: SurveyResponseRecord[] = [];
  let total = 0;
  let loadError: string | null = null;

  try {
    [total, responses] = await Promise.all([
      getSurveyResponseCount(),
      getAllSurveyResponses(),
    ]);
  } catch (err) {
    loadError =
      err instanceof Error
        ? err.message
        : "Failed to load survey responses from Supabase.";
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {loadError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8">
          <h1 className="text-lg font-semibold text-destructive">Unable to load responses</h1>
          <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Check your Supabase environment variables and run{" "}
            <code className="rounded bg-muted px-1 py-0.5">npm run test:supabase</code>.
          </p>
        </div>
      ) : (
        <AdminDashboard initialResponses={responses} total={total} />
      )}
    </main>
  );
}
