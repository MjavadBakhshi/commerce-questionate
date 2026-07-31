"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { exportResponsesCsv } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

import type { SurveyLocaleFilter } from "@/types/survey";

interface ExportButtonProps {
  search?: string;
  fromDate?: string;
  toDate?: string;
  locale?: SurveyLocaleFilter;
}

export function ExportButton({ search, fromDate, toDate, locale = "all" }: ExportButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    setError(null);
    startTransition(async () => {
      try {
        const filters =
          fromDate || toDate || locale !== "all"
            ? {
                from: fromDate ? new Date(fromDate).toISOString() : undefined,
                to: toDate ? new Date(`${toDate}T23:59:59`).toISOString() : undefined,
                locale: locale !== "all" ? locale : undefined,
              }
            : undefined;

        const csv = await exportResponsesCsv({
          search,
          filters,
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "survey-responses.csv";
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Export failed");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" onClick={handleExport} disabled={isPending}>
        <Download className="size-4" />
        {isPending ? "Exporting…" : "Export CSV"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
