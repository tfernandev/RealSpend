"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  RealSpendFilters as RealSpendFiltersType,
  RealSpendResponse,
  RealSpendSummary,
  ProgramSummary,
  RealImpactResult,
} from "@/lib/types";
import RealSpendFilters from "./RealSpendFilters";
import RealSpendChart from "./RealSpendChart";
import RealSpendSummaryCard from "./RealSpendSummaryCard";

function buildQuery(f: RealSpendFiltersType): string {
  const params = new URLSearchParams();
  if (f.programId) params.set("programId", f.programId);
  if (f.periodFrom) params.set("periodFrom", f.periodFrom);
  if (f.periodTo) params.set("periodTo", f.periodTo);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export default function RealSpendDataSection() {
  const [filters, setFilters] = useState<RealSpendFiltersType>({});
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [series, setSeries] = useState<RealImpactResult[]>([]);
  const [realIPC, setRealIPC] = useState(false);
  const [realBudget, setRealBudget] = useState(false);
  const [summary, setSummary] = useState<RealSpendSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/signals/real-spend${buildQuery(filters)}`);
      if (!res.ok) throw new Error(res.statusText);
      const data: RealSpendResponse = await res.json();
      setPrograms(data.programs);
      setSeries(data.series);
      setRealIPC(data.meta?.realIPC ?? false);
      setRealBudget(data.meta?.realBudget ?? false);
      setSummary(data.meta?.summary ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar señales");
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const programName = programs.find((p) => p.id === (filters.programId || "total"))?.name ?? "Total agregado";

  return (
    <div className="space-y-4 w-full">
      <RealSpendFilters
        programs={programs.length ? programs : [{ id: "total", name: "Total agregado" }]}
        filters={filters}
        onChange={setFilters}
        disabled={loading}
      />
      <RealSpendSummaryCard summary={summary} loading={loading} />
      <RealSpendChart
        data={series}
        programName={programName}
        loading={loading}
        error={error}
        realIPC={realIPC}
        realBudget={realBudget}
      />
    </div>
  );
}
