"use client";

import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";

export function HeroSection() {
  function scrollToSurvey() {
    document.getElementById("survey")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
      />
      <div className="relative mx-auto max-w-3xl text-center animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
          {COPY.hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {COPY.hero.subtitle}
        </p>
        <div className="mt-10">
          <Button
            type="button"
            size="lg"
            className="rounded-full px-8 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            onClick={scrollToSurvey}
          >
            {COPY.hero.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
