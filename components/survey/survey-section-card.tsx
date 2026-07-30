import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveySectionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SurveySectionCard({
  title,
  description,
  children,
}: SurveySectionCardProps) {
  return (
    <Card className="gap-0 rounded-2xl border-2 border-border/60 bg-muted/20 py-0 shadow-none">
      <CardHeader className="border-b border-border/50 bg-card/80 px-5 py-5 sm:px-6">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10 px-5 py-6 sm:px-6">{children}</CardContent>
    </Card>
  );
}
