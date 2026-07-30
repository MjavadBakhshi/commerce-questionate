import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SurveySection } from "@/types/survey";

interface SurveySectionCardProps {
  section: SurveySection;
  children: React.ReactNode;
}

/** Wraps each survey section in a card — implemented in Phase 6 */
export function SurveySectionCard({ section, children }: SurveySectionCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">{children}</CardContent>
    </Card>
  );
}
