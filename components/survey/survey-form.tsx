"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Main survey form — implemented in Phase 6 */
export function SurveyForm() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Survey</CardTitle>
        <CardDescription>
          The full questionnaire will be implemented in Phase 6.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Project scaffolding is complete. Survey sections, validation, and submission
          are coming next.
        </p>
      </CardContent>
    </Card>
  );
}
