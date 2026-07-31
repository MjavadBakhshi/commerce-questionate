"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OptionGrid } from "@/components/survey/option-grid";
import { getOtherFieldId } from "@/lib/survey";
import { cn } from "@/lib/utils";
import type { SurveyFormValues } from "@/types/survey";
import type { SurveyQuestion } from "@/types/survey";

interface QuestionFieldProps {
  question: SurveyQuestion;
  control: Control<SurveyFormValues>;
  errors: FieldErrors<SurveyFormValues>;
  values: SurveyFormValues;
  otherOptionLabel: string;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

export function QuestionField({
  question,
  control,
  errors,
  values,
  otherOptionLabel,
}: QuestionFieldProps) {
  const errorId = `${question.id}-error`;
  const fieldError = errors[question.id as keyof SurveyFormValues]?.message as
    | string
    | undefined;
  const otherFieldId = getOtherFieldId(question.id);
  const otherError = errors[otherFieldId as keyof SurveyFormValues]?.message as
    | string
    | undefined;

  const currentValue = values[question.id as keyof SurveyFormValues];
  const showOther =
    question.hasOther &&
    (question.type === "radio"
      ? currentValue === otherOptionLabel
      : Array.isArray(currentValue) && currentValue.includes(otherOptionLabel));

  if (question.type === "radio" || question.type === "checkbox") {
    const mode = question.type === "radio" ? "single" : "multi";

    return (
      <fieldset className="space-y-4 [overflow-anchor:none]">
        <legend className="text-xl font-semibold leading-snug tracking-tight text-foreground">
          {question.label}
        </legend>
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}
        <Controller
          name={question.id as keyof SurveyFormValues}
          control={control}
          render={({ field }) => (
            <OptionGrid
              options={question.options ?? []}
              mode={mode}
              maxSelections={question.maxSelections}
              value={field.value as string | string[]}
              onChange={field.onChange}
              invalid={!!fieldError}
              describedBy={fieldError ? errorId : undefined}
            />
          )}
        />
        <FieldError id={errorId} message={fieldError} />
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200",
            showOther ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            {showOther && (
              <OtherTextarea
                control={control}
                name={otherFieldId as keyof SurveyFormValues}
                error={otherError}
                label={`Tell us more about "${otherOptionLabel}"`}
              />
            )}
          </div>
        </div>
      </fieldset>
    );
  }

  const isFinal = question.id === "qFinal";
  const minLength = question.minLength ?? 0;
  const maxLength = question.maxLength;

  return (
    <div className="space-y-3 [overflow-anchor:none]">
      <Label htmlFor={question.id} className="text-xl font-semibold leading-snug tracking-tight">
        {question.label}
      </Label>
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}
      <Controller
        name={question.id as keyof SurveyFormValues}
        control={control}
        render={({ field }) => {
          const text = (field.value as string) ?? "";
          const charCount = text.length;
          return (
            <>
              <Textarea
                {...field}
                id={question.id}
                value={text}
                rows={isFinal ? 10 : 4}
                maxLength={maxLength}
                className={cn(
                  "rounded-xl border-2 text-base",
                  isFinal && "min-h-48 resize-y",
                )}
                aria-invalid={!!fieldError}
                aria-describedby={
                  fieldError
                    ? errorId
                    : isFinal
                      ? `${question.id}-counter`
                      : undefined
                }
                placeholder={
                  isFinal
                    ? "Describe the full journey from first contact to shipment…"
                    : undefined
                }
              />
              {isFinal && (
                <p
                  id={`${question.id}-counter`}
                  className={cn(
                    "text-sm font-medium",
                    charCount < minLength
                      ? "text-destructive"
                      : charCount >= (maxLength ?? Infinity)
                        ? "text-destructive"
                        : "text-muted-foreground",
                  )}
                >
                  {charCount.toLocaleString()} / {maxLength?.toLocaleString()} maximum
                  {charCount < minLength &&
                    ` (${minLength.toLocaleString()} minimum)`}
                </p>
              )}
            </>
          );
        }}
      />
      <FieldError id={errorId} message={fieldError} />
    </div>
  );
}

function OtherTextarea({
  control,
  name,
  error,
  label,
}: {
  control: Control<SurveyFormValues>;
  name: keyof SurveyFormValues;
  error?: string;
  label: string;
}) {
  const errorId = `${String(name)}-error`;

  return (
    <div className="mt-4 space-y-2 rounded-xl border-2 border-primary/20 bg-accent/30 p-4">
      <Label htmlFor={String(name)} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={String(name)}
            value={(field.value as string) ?? ""}
            rows={3}
            className="rounded-xl border-2 bg-card"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            placeholder="Please specify…"
          />
        )}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
