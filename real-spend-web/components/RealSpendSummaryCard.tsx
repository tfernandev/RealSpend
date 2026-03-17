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

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-4">
      <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
        <HelpCircle className="w-4 h-4 text-emerald-500" />
        Respuestas del período ({summary.firstPeriod} → {summary.lastPeriod})
      </div>
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
              ? "El aumento presupuestario compensó (o superó) la inflación en el período."
              : "El aumento presupuestario no compensó la inflación en el período."}
          </span>
        </li>
        <li className="text-slate-400 text-xs">
          Variación nominal: {summary.nominalChangePercent >= 0 ? "+" : ""}{summary.nominalChangePercent}%. Variación real: {summary.realChangePercent >= 0 ? "+" : ""}{summary.realChangePercent}%. Poder de compra: {summary.purchasingPowerChangePercent >= 0 ? "+" : ""}{summary.purchasingPowerChangePercent}%.
        </li>
      </ul>
    </div>
  );
}
