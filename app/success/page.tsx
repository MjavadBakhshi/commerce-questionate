import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thank You | Online Store Owner Research Survey",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-20">
      <Card className="w-full max-w-lg animate-fade-in border-0 shadow-xl">
        <CardContent className="flex flex-col items-center gap-5 px-8 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="size-10 text-primary" aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {COPY.success.title}
          </h1>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            {COPY.success.description}
          </p>
          <Link href="/" className={cn(buttonVariants(), "mt-2 rounded-xl")}>
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
