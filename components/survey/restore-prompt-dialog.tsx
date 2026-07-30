"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";

interface RestorePromptDialogProps {
  open: boolean;
  onContinue: () => void;
  onStartFresh: () => void;
}

/** Prompts user to restore a saved draft — implemented in Phase 8 */
export function RestorePromptDialog({
  open,
  onContinue,
  onStartFresh,
}: RestorePromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{COPY.restore.title}</DialogTitle>
          <DialogDescription>{COPY.restore.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onStartFresh}>
            {COPY.restore.startFresh}
          </Button>
          <Button onClick={onContinue}>{COPY.restore.continue}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
