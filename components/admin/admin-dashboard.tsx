"use client";

import { useMemo, useState } from "react";
import { LogOut, Search } from "lucide-react";
import { ExportButton } from "@/components/admin/export-button";
import { ResponseDetail } from "@/components/admin/response-detail";
import { ResponseList } from "@/components/admin/response-list";
import { StatsCards } from "@/components/admin/stats-cards";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SURVEY_LOCALE_LABELS } from "@/lib/survey";
import { cn } from "@/lib/utils";
import type { SurveyLocaleFilter, SurveyResponseRecord } from "@/types/survey";

interface AdminDashboardProps {
  initialResponses: SurveyResponseRecord[];
  total: number;
}

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

export function AdminDashboard({ initialResponses, total }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [localeFilter, setLocaleFilter] = useState<SurveyLocaleFilter>("all");
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponseRecord | null>(
    null,
  );

  const filteredResponses = useMemo(() => {
    let results = initialResponses;

    if (localeFilter !== "all") {
      results = results.filter((response) => response.locale === localeFilter);
    }

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
  }, [initialResponses, search, fromDate, toDate, localeFilter]);

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
          <ExportButton
            search={search}
            fromDate={fromDate}
            toDate={toDate}
            locale={localeFilter}
          />
          <a
            href="/admin/logout"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LogOut className="size-4" />
            Sign out
          </a>
        </div>
      </div>

      <StatsCards total={total} filtered={filteredResponses.length} />

      <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="admin-search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Instagram username, answers, or keywords…"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-locale">Language</Label>
          <select
            id="admin-locale"
            value={localeFilter}
            onChange={(event) =>
              setLocaleFilter(event.target.value as SurveyLocaleFilter)
            }
            className={selectClassName}
          >
            <option value="all">All languages</option>
            <option value="en">{SURVEY_LOCALE_LABELS.en}</option>
            <option value="fa">{SURVEY_LOCALE_LABELS.fa}</option>
          </select>
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
