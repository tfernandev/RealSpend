"use client";

import type { RealSpendSummary } from "@/lib/types";
import { HelpCircle, TrendingUp, TrendingDown, Minus, Check, X } from "lucide-react";

interface RealSpendSummaryCardProps {
  summary: RealSpendSummary | null;
  loading?: boolean;
}

const REAL_PURCHASE_LABELS: Record<"more" | "less" | "same", string> = {
  more: "Este gasto hoy compra más que al inicio del período.",
  less: "Este gasto hoy compra menos que al inicio del período.",
  same: "Este gasto hoy compra lo mismo que al inicio del período.",
};

export default function RealSpendSummaryCard({ summary, loading }: RealSpendSummaryCardProps) {
  if (loading || !summary) return null;

  const isNominalDeception = summary.nominalChangePercent > 0 && summary.realChangePercent < 0;

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-4 relative overflow-hidden group">
      {isNominalDeception && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600" />
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          Señales del período ({summary.firstPeriod} → {summary.lastPeriod})
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border border-slate-800 px-2 py-0.5 rounded">
          Reality Check Engine™
        </div>
      </div>

      {isNominalDeception && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col gap-1">
          <div className="text-red-400 font-bold text-xs uppercase tracking-tight flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Alerta: Engaño Nominal Detectado
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Aunque el presupuesto creció un <strong>{summary.nominalChangePercent}%</strong> en pesos, la inflación lo erosionó por completo: la caída real es del <strong>{Math.abs(summary.realChangePercent)}%</strong>. 
          </p>
        </div>
      )}

      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-3 text-slate-300">
          {summary.realPurchaseVsStart === "more" && <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
          {summary.realPurchaseVsStart === "less" && <TrendingDown className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
          {summary.realPurchaseVsStart === "same" && <Minus className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />}
          <span>{REAL_PURCHASE_LABELS[summary.realPurchaseVsStart]}</span>
        </li>
        <li className="flex items-start gap-3 text-slate-300">
          {summary.inflationCompensated ? <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
          <span>
            {summary.inflationCompensated
              ? "El ajuste presupuestario fue suficiente para cubrir la inflación."
              : "El ajuste presupuestario no llegó a compensar la inflación registrada."}
          </span>
        </li>
        <li className="text-slate-400 text-xs font-mono bg-slate-950/40 p-2 rounded">
          Nominal: {summary.nominalChangePercent >= 0 ? "+" : ""}{summary.nominalChangePercent}% | 
          Real: {summary.realChangePercent >= 0 ? "+" : ""}{summary.realChangePercent}% | 
          Poder Compra: {summary.purchasingPowerChangePercent >= 0 ? "+" : ""}{summary.purchasingPowerChangePercent}%
        </li>
      </ul>
    </div>
  );
}
