import { Progress } from "@/components/ui/progress";

import type { LocaleCopy } from "@/lib/survey/types";

interface ProgressIndicatorProps {
  percentage: number;
  currentQuestion: number;
  totalQuestions: number;
  labels: LocaleCopy["survey"]["progress"];
}

export function ProgressIndicator({
  percentage,
  currentQuestion,
  totalQuestions,
  labels,
}: ProgressIndicatorProps) {
  return (
    <div
      className="space-y-2"
      aria-live="polite"
      aria-label={labels.ariaLabel(percentage, currentQuestion, totalQuestions)}
    >
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
        <span>{labels.complete(percentage)}</span>
        <span>{labels.questionOf(currentQuestion, totalQuestions)}</span>
      </div>
      <Progress value={percentage} className="h-2.5 rounded-full" />
    </div>
  );
}
