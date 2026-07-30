import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { COPY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thank You | Online Store Owner Research Survey",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <Card className="w-full max-w-lg border-0 text-center shadow-lg animate-fade-in">
        <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
          <CheckCircle2
            className="size-14 text-primary"
            aria-hidden
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            {COPY.success.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {COPY.success.description}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
