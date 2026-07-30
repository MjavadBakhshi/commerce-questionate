import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing/hero-section";

const SurveyForm = dynamic(
  () =>
    import("@/components/survey/survey-form").then((mod) => mod.SurveyForm),
  {
    loading: () => (
      <div className="mx-auto max-w-3xl animate-pulse rounded-xl bg-muted/50 p-12" />
    ),
  },
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div id="survey" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <SurveyForm />
      </div>
    </>
  );
}
