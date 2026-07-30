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
import { COPY } from "@/lib/constants";
import { SURVEY_START_FRESH_EVENT } from "@/lib/survey-events";
import { clearSurveyDraft, hasSurveyDraft } from "@/utils/local-storage";

export function HeroSection() {
  const [draftExists, setDraftExists] = useState(false);
  const [confirmFreshOpen, setConfirmFreshOpen] = useState(false);

  useEffect(() => {
    setDraftExists(hasSurveyDraft());
  }, []);

  function scrollToSurvey() {
    document.getElementById("survey")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleStartFreshConfirmed() {
    clearSurveyDraft();
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
              Built for online shop owners
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
              {COPY.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {COPY.hero.subtitle}
            </p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Progress saves automatically. Refresh the page anytime — your answers will still be here.
            </p>

            <div className="mt-10 flex w-full max-w-md flex-col items-stretch">
              <Button
                type="button"
                size="lg"
                className="rounded-xl px-8 text-base shadow-md"
                onClick={scrollToSurvey}
              >
                {draftExists ? "Continue Survey" : COPY.hero.cta}
                <ArrowRight className="size-4" />
              </Button>

              {draftExists && (
                <div className="mt-10 border-t border-border/60 pt-10">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Want to clear your saved answers and begin again?
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl border-2 px-8 text-base text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    onClick={() => setConfirmFreshOpen(true)}
                  >
                    <RefreshCw className="size-4" />
                    Start Fresh
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="relative hidden min-h-[420px] bg-primary lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_55%)]" />
            <div className="relative flex h-full flex-col justify-end p-10 text-primary-foreground">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
                Trusted research
              </p>
              <p className="mt-4 max-w-md text-3xl font-semibold leading-tight">
                Your workflow insights shape the tools we build next.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-primary-foreground/85">
                We are talking to real shop owners — not guessing. Every answer helps us design software
                that saves time, reduces mistakes, and makes selling online feel exciting again.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={confirmFreshOpen} onOpenChange={setConfirmFreshOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a new survey?</DialogTitle>
            <DialogDescription>
              This will permanently delete your saved answers. You cannot undo this action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmFreshOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleStartFreshConfirmed}>
              Yes, start fresh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
