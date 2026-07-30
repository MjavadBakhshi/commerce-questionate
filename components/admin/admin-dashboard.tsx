import { ExportButton } from "@/components/admin/export-button";
import { StatsCards } from "@/components/admin/stats-cards";

/** Admin dashboard shell — fully implemented in Phase 11 */
export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Survey Responses</h1>
        <ExportButton />
      </div>
      <StatsCards total={0} />
      <p className="text-sm text-muted-foreground">
        Response list, search, filter, and export will be implemented in Phase 11.
      </p>
    </div>
  );
}
