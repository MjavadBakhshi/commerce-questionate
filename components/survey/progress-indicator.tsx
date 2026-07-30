import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  percentage: number;
  currentQuestion: number;
  totalQuestions: number;
}

/** Survey progress bar and counters — implemented in Phase 7 */
export function ProgressIndicator({
  percentage,
  currentQuestion,
  totalQuestions,
}: ProgressIndicatorProps) {
  return (
    <div
      className="sticky top-0 z-10 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-live="polite"
      aria-label={`Survey progress: ${percentage}% complete, question ${currentQuestion} of ${totalQuestions}`}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{percentage}%</span>
          <span>
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  );
}
