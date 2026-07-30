"use client";

import { useMemo, useState, useTransition } from "react";
import { LogOut, Search } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { ExportButton } from "@/components/admin/export-button";
import { ResponseDetail } from "@/components/admin/response-detail";
import { ResponseList } from "@/components/admin/response-list";
import { StatsCards } from "@/components/admin/stats-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SurveyResponseRecord } from "@/types/survey";

interface AdminDashboardProps {
  initialResponses: SurveyResponseRecord[];
  total: number;
}

export function AdminDashboard({ initialResponses, total }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponseRecord | null>(
    null,
  );
  const [isLoggingOut, startLogout] = useTransition();

  const filteredResponses = useMemo(() => {
    let results = initialResponses;

    if (fromDate) {
      const from = new Date(fromDate);
      results = results.filter((response) => new Date(response.created_at) >= from);
    }

    if (toDate) {
      const to = new Date(`${toDate}T23:59:59`);
      results = results.filter((response) => new Date(response.created_at) <= to);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      results = results.filter((response) =>
        JSON.stringify(response.answers).toLowerCase().includes(query),
      );
    }

    return results;
  }, [initialResponses, search, fromDate, toDate]);

  function handleLogout() {
    startLogout(async () => {
      await logoutAdmin();
      window.location.reload();
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Survey Responses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, search, and export submitted questionnaires.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton search={search} fromDate={fromDate} toDate={toDate} />
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="size-4" />
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>

      <StatsCards total={total} filtered={filteredResponses.length} />

      <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="admin-search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, answers, or keywords…"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-from">From</Label>
          <Input
            id="admin-from"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-to">To</Label>
          <Input
            id="admin-to"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
      </div>

      <ResponseList
        responses={filteredResponses}
        onSelect={setSelectedResponse}
      />

      <ResponseDetail
        response={selectedResponse}
        open={selectedResponse !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedResponse(null);
        }}
      />
    </div>
  );
}
