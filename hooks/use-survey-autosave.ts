import { useCallback, useEffect, useRef } from "react";
import type { UseFormGetValues, UseFormWatch } from "react-hook-form";
import { DEFAULT_SURVEY_LOCALE, type SurveyLocale } from "@/lib/survey";
import { saveSurveyDraft } from "@/utils/local-storage";
import type { SurveyFormValues } from "@/types/survey";

/** Auto-save form values to LocalStorage on every change */
export function useSurveyAutosave(
  watch: UseFormWatch<SurveyFormValues>,
  getValues: UseFormGetValues<SurveyFormValues>,
  locale: SurveyLocale = DEFAULT_SURVEY_LOCALE,
) {
  const persist = useCallback(
    (values: SurveyFormValues) => {
      saveSurveyDraft(
        {
          answers: values,
          savedAt: new Date().toISOString(),
        },
        locale,
      );
    },
    [locale],
  );

  const persistRef = useRef(persist);
  persistRef.current = persist;

  useEffect(() => {
    persistRef.current(getValues());
  }, [getValues]);

  useEffect(() => {
    const subscription = watch((values) => {
      persistRef.current(values as SurveyFormValues);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    function handleBeforeUnload() {
      persistRef.current(getValues());
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [getValues]);
}
