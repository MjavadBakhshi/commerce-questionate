import { cookies } from "next/headers";
import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { fetchAdminStats, fetchResponses } from "@/app/admin/actions";
import type { SurveyResponseRecord } from "@/types/survey";

export const metadata: Metadata = {
  title: "Admin | Questionate",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "authenticated";

  if (!isAuthenticated) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <AdminLoginForm />
      </main>
    );
  }

  let responses: SurveyResponseRecord[] = [];
  let total = 0;
  let loadError: string | null = null;

  try {
    const [stats, data] = await Promise.all([fetchAdminStats(), fetchResponses()]);
    total = stats.total;
    responses = data;
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
