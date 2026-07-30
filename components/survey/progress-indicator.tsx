import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  percentage: number;
  currentQuestion: number;
  totalQuestions: number;
}

export function ProgressIndicator({
  percentage,
  currentQuestion,
  totalQuestions,
}: ProgressIndicatorProps) {
  return (
    <div
      className="space-y-2"
      aria-live="polite"
      aria-label={`Survey progress: ${percentage}% complete, question ${currentQuestion} of ${totalQuestions}`}
    >
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
        <span>{percentage}% complete</span>
        <span>
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>
      <Progress value={percentage} className="h-2.5 rounded-full" />
    </div>
  );
}
