import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing/hero-section";

const SurveyForm = dynamic(
  () =>
    import("@/components/survey/survey-form").then((mod) => mod.SurveyForm),
  {
    loading: () => (
      <div className="mx-auto max-w-4xl animate-pulse rounded-2xl bg-muted/50 p-16" />
    ),
  },
);

export const metadata: Metadata = {
  title: "پرسشنامه صاحبان فروشگاه آنلاین",
  description:
    "به ما کمک کنید بزرگ‌ترین چالش‌های فروش آنلاین را بفهمیم تا نرم‌افزار بهتری بسازیم.",
  openGraph: {
    title: "پرسشنامه صاحبان فروشگاه آنلاین",
    description:
      "به ما کمک کنید بزرگ‌ترین چالش‌های فروش آنلاین را بفهمیم تا نرم‌افزار بهتری بسازیم.",
    locale: "fa_IR",
  },
};

export default function PersianSurveyPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection locale="fa" />
      <div
        id="survey"
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <SurveyForm locale="fa" />
      </div>
    </main>
  );
}
