"use client";

import { Eye } from "lucide-react";
import { formatResponseDate, getResponsePreview } from "@/lib/survey-display";
import { Button } from "@/components/ui/button";
import type { SurveyResponseRecord } from "@/types/survey";

interface ResponseListProps {
  responses: SurveyResponseRecord[];
  onSelect: (response: SurveyResponseRecord) => void;
}

export function ResponseList({ responses, onSelect }: ResponseListProps) {
  if (responses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center">
        <p className="text-lg font-medium">No responses found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit a survey from the home page, or adjust your search and date filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Submitted</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Respondent</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Preview</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response.id} className="border-b last:border-b-0 hover:bg-muted/20">
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatResponseDate(response.created_at)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {typeof response.answers.respondentName === "string"
                    ? response.answers.respondentName
                    : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {getResponsePreview(response)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(response)}
                  >
                    <Eye className="size-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
