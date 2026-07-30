"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { submitSurvey } from "@/app/actions/survey";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/survey/progress-indicator";
import { QuestionField } from "@/components/survey/question-field";
import { SurveySectionCard } from "@/components/survey/survey-section-card";
import { useSurveyAutosave } from "@/hooks/use-survey-autosave";
import { useSurveyProgress } from "@/hooks/use-survey-progress";
import { SURVEY_START_FRESH_EVENT } from "@/lib/survey-events";
import {
  FINAL_QUESTION_SECTION,
  getQuestionsBySection,
  isQuestionVisible,
  SURVEY_SECTIONS,
} from "@/lib/survey-questions";
import {
  defaultSurveyValues,
  surveyFormSchema,
  type SurveyFormValues,
} from "@/lib/survey-schema";
import {
  clearSurveyDraft,
  getInitialSurveyValues,
  getRespondentNameFromUrl,
} from "@/utils/local-storage";

function buildInitialValues(): SurveyFormValues {
  const saved = getInitialSurveyValues();
  const urlName = getRespondentNameFromUrl();

  return {
    ...saved,
    respondentName: saved.respondentName || urlName,
  };
}

export function SurveyForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const initialValues = useMemo(() => buildInitialValues(), []);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { control, handleSubmit, reset, setValue, watch, getValues, formState } = form;
  const values = watch();
  const progress = useSurveyProgress(values);

  useSurveyAutosave(watch, getValues);

  useEffect(() => {
    function handleStartFresh() {
      clearSurveyDraft();
      reset(defaultSurveyValues);
      setSubmitError(null);
    }

    window.addEventListener(SURVEY_START_FRESH_EVENT, handleStartFresh);
    return () => window.removeEventListener(SURVEY_START_FRESH_EVENT, handleStartFresh);
  }, [reset]);

  useEffect(() => {
    if (values.q17 === "No") {
      setValue("q18", "", { shouldValidate: true, shouldDirty: true });
    }
  }, [values.q17, setValue]);

  function onSubmit(data: SurveyFormValues) {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitSurvey(data);
      if (result.success) {
        clearSurveyDraft();
        router.push("/success");
        return;
      }
      setSubmitError(result.error);
    });
  }

  return (
    <div className="overflow-anchor-none">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-card to-card px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Questionate</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                Help us understand your business workflow
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your answers auto-save as you go — refresh anytime and pick up where you left off.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-6 py-8 sm:px-8 [overflow-anchor:none]"
          noValidate
        >
          <div className="rounded-xl border-2 border-primary/15 bg-accent/20 p-5">
            <Label htmlFor="respondentName" className="text-base font-semibold">
              Your exact Instagram username
            </Label>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              Enter your exact Instagram handle so we can contact you for future early access.
              Do not include spaces — use the username exactly as it appears on Instagram.
            </p>
            <Controller
              name="respondentName"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="respondentName"
                    placeholder="e.g. @sarasboutique"
                    className="h-12 rounded-xl border-2 bg-card text-base"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "respondentName-error" : undefined
                    }
                  />
                  {fieldState.error && (
                    <p
                      id="respondentName-error"
                      role="alert"
                      className="mt-2 text-sm text-destructive"
                    >
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {SURVEY_SECTIONS.map((section) => (
            <SurveySectionCard
              key={section.id}
              title={section.title}
              description={section.description}
            >
              {getQuestionsBySection(section.id).map((question) =>
                isQuestionVisible(question, values) ? (
                  <QuestionField
                    key={question.id}
                    question={question}
                    control={control}
                    errors={formState.errors}
                    values={values}
                  />
                ) : null,
              )}
            </SurveySectionCard>
          ))}

          <SurveySectionCard
            title={FINAL_QUESTION_SECTION.title}
            description={FINAL_QUESTION_SECTION.description}
          >
            {getQuestionsBySection(FINAL_QUESTION_SECTION.id).map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                control={control}
                errors={formState.errors}
                values={values}
              />
            ))}
          </SurveySectionCard>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Submission failed</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 border-t border-border/60 pt-6">
            <ProgressIndicator
              percentage={progress.percentage}
              currentQuestion={progress.currentQuestion}
              totalQuestions={progress.totalQuestions}
            />

            <div className="flex flex-col items-center gap-3">
              <Button
                type="submit"
                size="lg"
                className="min-w-52 rounded-xl px-8 text-base shadow-md"
                disabled={!formState.isValid || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Survey"
                )}
              </Button>
              {!formState.isValid && (
                <p className="text-center text-sm text-muted-foreground">
                  Complete all required questions to submit.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
