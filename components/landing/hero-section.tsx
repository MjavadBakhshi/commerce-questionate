"use client";

import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DEFAULT_SURVEY_LOCALE,
  getSurveyLocaleConfig,
  type SurveyLocale,
} from "@/lib/survey";
import { SURVEY_START_FRESH_EVENT } from "@/lib/survey-events";
import { cn } from "@/lib/utils";
import { clearSurveyDraft, hasSurveyDraft } from "@/utils/local-storage";

interface HeroSectionProps {
  locale?: SurveyLocale;
}

export function HeroSection({ locale = DEFAULT_SURVEY_LOCALE }: HeroSectionProps) {
  const { copy } = getSurveyLocaleConfig(locale);
  const [draftExists, setDraftExists] = useState(false);
  const [confirmFreshOpen, setConfirmFreshOpen] = useState(false);

  useEffect(() => {
    setDraftExists(hasSurveyDraft(locale));
  }, [locale]);

  function scrollToSurvey() {
    document.getElementById("survey")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleStartFreshConfirmed() {
    clearSurveyDraft(locale);
    window.dispatchEvent(new CustomEvent(SURVEY_START_FRESH_EVENT));
    setDraftExists(false);
    setConfirmFreshOpen(false);
    scrollToSurvey();
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Store className="size-4" aria-hidden />
              {copy.hero.badge}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
              {copy.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {copy.hero.subtitle}
            </p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              {copy.hero.autosaveNote}
            </p>

            <div className="mt-10 flex w-full max-w-md flex-col items-stretch">
              <Button
                type="button"
                size="lg"
                className="rounded-xl px-8 text-base shadow-md"
                onClick={scrollToSurvey}
              >
                {draftExists ? copy.hero.continueCta : copy.hero.cta}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>

              {draftExists && (
                <div className="mt-10 border-t border-border/60 pt-10">
                  <p className="mb-4 text-sm text-muted-foreground">
                    {copy.hero.startFreshPrompt}
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl border-2 px-8 text-base text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    onClick={() => setConfirmFreshOpen(true)}
                  >
                    <RefreshCw className="size-4" />
                    {copy.hero.startFresh}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="relative hidden min-h-[420px] bg-primary lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_55%)]" />
            <div className="relative flex h-full flex-col justify-end p-10 text-primary-foreground">
              {copy.hero.sidebar.tagline ? (
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
                  {copy.hero.sidebar.tagline}
                </p>
              ) : null}
              <p
                className={cn(
                  "max-w-md text-3xl font-semibold leading-tight",
                  copy.hero.sidebar.tagline ? "mt-4" : undefined,
                )}
              >
                {copy.hero.sidebar.title}
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-primary-foreground/85">
                {copy.hero.sidebar.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={confirmFreshOpen} onOpenChange={setConfirmFreshOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{copy.restore.title}</DialogTitle>
            <DialogDescription>{copy.restore.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmFreshOpen(false)}>
              {copy.restore.cancel}
            </Button>
            <Button variant="destructive" onClick={handleStartFreshConfirmed}>
              {copy.restore.startFresh}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
