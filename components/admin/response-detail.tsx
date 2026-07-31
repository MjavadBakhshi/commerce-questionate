"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  formatResponseDate,
  getFormattedResponseEntries,
} from "@/lib/survey-display";
import type { SurveyResponseRecord } from "@/types/survey";

interface ResponseDetailProps {
  response: SurveyResponseRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResponseDetail({ response, open, onOpenChange }: ResponseDetailProps) {
  if (!response) return null;

  const entries = getFormattedResponseEntries(
    response.answers,
    response.locale ?? "en",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Survey Response</DialogTitle>
          <DialogDescription>
            Submitted {formatResponseDate(response.created_at)} · ID {response.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {entries.map((entry, index) => (
            <div key={`${entry.label}-${index}`}>
              <p className="text-sm font-semibold text-foreground">{entry.label}</p>
              <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {entry.value}
              </p>
              {index < entries.length - 1 && <Separator className="mt-5" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
