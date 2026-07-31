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
import {
  DEFAULT_SURVEY_LOCALE,
  getQuestionsBySection,
  getSurveyLocaleConfig,
  isQuestionVisible,
  type SurveyLocale,
} from "@/lib/survey";
import { SURVEY_START_FRESH_EVENT } from "@/lib/survey-events";
import type { SurveyFormValues } from "@/types/survey";
import {
  clearSurveyDraft,
  getInitialSurveyValues,
  getRespondentNameFromUrl,
} from "@/utils/local-storage";

interface SurveyFormProps {
  locale?: SurveyLocale;
}

function buildInitialValues(locale: SurveyLocale): SurveyFormValues {
  const saved = getInitialSurveyValues(locale);
  const urlName = getRespondentNameFromUrl();

  return {
    ...saved,
    respondentName: saved.respondentName || urlName,
  };
}

export function SurveyForm({ locale = DEFAULT_SURVEY_LOCALE }: SurveyFormProps) {
  const config = getSurveyLocaleConfig(locale);
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const initialValues = useMemo(() => buildInitialValues(locale), [locale]);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(config.schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { control, handleSubmit, reset, setValue, watch, getValues, formState } = form;
  const values = watch();
  const progress = useSurveyProgress(values, locale);

  useSurveyAutosave(watch, getValues, locale);

  const q18 = config.questions.find((question) => question.id === "q18");
  const q17NoValue =
    config.questions
      .find((question) => question.id === "q17")
      ?.options?.find((option) => option !== q18?.conditionalOn?.value) ?? "No";

  useEffect(() => {
    function handleStartFresh() {
      clearSurveyDraft(locale);
      reset(config.defaultValues);
      setSubmitError(null);
    }

    window.addEventListener(SURVEY_START_FRESH_EVENT, handleStartFresh);
    return () => window.removeEventListener(SURVEY_START_FRESH_EVENT, handleStartFresh);
  }, [config.defaultValues, locale, reset]);

  useEffect(() => {
    if (values.q17 === q17NoValue) {
      setValue("q18", "", { shouldValidate: true, shouldDirty: true });
    }
  }, [q17NoValue, setValue, values.q17]);

  function onSubmit(data: SurveyFormValues) {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitSurvey(data, locale);
      if (result.success) {
        clearSurveyDraft(locale);
        router.push(locale === DEFAULT_SURVEY_LOCALE ? "/success" : `/${locale}/success`);
        return;
      }
      setSubmitError(result.error);
    });
  }

  const { copy, sections, finalSection } = config;

  return (
    <div className="overflow-anchor-none">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-card to-card px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{copy.survey.brandLabel}</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                {copy.survey.headerTitle}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {copy.survey.headerSubtitle}
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
              {copy.survey.instagramLabel}
            </Label>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              {copy.survey.instagramHelper}
            </p>
            <Controller
              name="respondentName"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="respondentName"
                    placeholder={copy.survey.instagramPlaceholder}
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

          {sections.map((section) => (
            <SurveySectionCard
              key={section.id}
              title={section.title}
              description={section.description}
            >
              {getQuestionsBySection(section.id, locale).map((question) =>
                isQuestionVisible(question, values) ? (
                  <QuestionField
                    key={question.id}
                    question={question}
                    control={control}
                    errors={formState.errors}
                    values={values}
                    otherOptionLabel={config.otherOptionLabel}
                    surveyCopy={copy.survey}
                  />
                ) : null,
              )}
            </SurveySectionCard>
          ))}

          <SurveySectionCard
            title={finalSection.title}
            description={finalSection.description}
          >
            {getQuestionsBySection(finalSection.id, locale).map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                control={control}
                errors={formState.errors}
                values={values}
                otherOptionLabel={config.otherOptionLabel}
                surveyCopy={copy.survey}
              />
            ))}
          </SurveySectionCard>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{copy.survey.submitErrorTitle}</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 border-t border-border/60 pt-6">
            <ProgressIndicator
              percentage={progress.percentage}
              currentQuestion={progress.currentQuestion}
              totalQuestions={progress.totalQuestions}
              labels={copy.survey.progress}
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
                    {copy.survey.submittingLabel}
                  </>
                ) : (
                  copy.survey.submitLabel
                )}
              </Button>
              {!formState.isValid && (
                <p className="text-center text-sm text-muted-foreground">
                  {copy.survey.incompleteHint}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
