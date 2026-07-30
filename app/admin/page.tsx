import { cookies } from "next/headers";
import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <AdminDashboard />
    </main>
  );
}
