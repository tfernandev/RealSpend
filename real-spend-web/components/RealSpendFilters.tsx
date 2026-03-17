"use client";

import type { ProgramSummary, RealSpendFilters as RealSpendFiltersType } from "@/lib/types";

const PERIOD_OPTIONS = [
  { value: "", label: "Todo el período" },
  ...Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    return { value: `2024-${m}`, label: `2024-${m}` };
  }),
];

interface RealSpendFiltersProps {
  programs: ProgramSummary[];
  filters: RealSpendFiltersType;
  onChange: (f: RealSpendFiltersType) => void;
  disabled?: boolean;
}

export default function RealSpendFilters({
  programs,
  filters,
  onChange,
  disabled = false,
}: RealSpendFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
      <span className="w-full text-xs text-slate-500 mb-1" aria-live="polite">
        IPC: datos.gob.ar (INDEC) cuando está disponible. Gasto nominal: ejemplo hasta integrar Presupuesto Abierto.
      </span>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Programa</label>
        <select
          value={filters.programId ?? ""}
          onChange={(e) => onChange({ ...filters, programId: e.target.value || undefined })}
          disabled={disabled}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm min-w-[180px] focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        >
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Desde (período)</label>
        <select
          value={filters.periodFrom ?? ""}
          onChange={(e) => onChange({ ...filters, periodFrom: e.target.value || undefined })}
          disabled={disabled}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm min-w-[140px] focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Hasta (período)</label>
        <select
          value={filters.periodTo ?? ""}
          onChange={(e) => onChange({ ...filters, periodTo: e.target.value || undefined })}
          disabled={disabled}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm min-w-[140px] focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
