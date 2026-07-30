import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  filtered?: number;
}

export function StatsCards({ total, filtered }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
      {filtered !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Matching Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{filtered}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
