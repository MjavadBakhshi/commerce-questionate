import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
}

/** Admin dashboard stat cards — implemented in Phase 11 */
export function StatsCards({ total }: StatsCardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Responses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{total}</p>
      </CardContent>
    </Card>
  );
}
