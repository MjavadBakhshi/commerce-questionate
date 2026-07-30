import { useCallback, useEffect, useRef } from "react";
import type { UseFormWatch } from "react-hook-form";
import { saveSurveyDraft } from "@/utils/local-storage";
import type { SurveyAnswers } from "@/types/survey";

const DEBOUNCE_MS = 400;

/** Auto-save form values to LocalStorage — implemented in Phase 8 */
export function useSurveyAutosave(watch: UseFormWatch<SurveyAnswers>) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((values: SurveyAnswers) => {
    saveSurveyDraft({
      answers: values,
      savedAt: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        persist(values as SurveyAnswers);
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [watch, persist]);
}
