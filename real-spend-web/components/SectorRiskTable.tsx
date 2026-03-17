"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SectorRiskSignal, SectorRiskResponse } from "@/lib/types";

function TrendIcon({ trend }: { trend: "up" | "stable" | "down" }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-amber-400" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-emerald-400" />;
  return <Minus className="w-4 h-4 text-slate-500" />;
}

export default function SectorRiskTable() {
  const [signals, setSignals] = useState<SectorRiskSignal[]>([]);
  const [realData, setRealData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/signals/sector-risk")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: SectorRiskResponse) => {
        setSignals(data.signals);
        setRealData(data.meta?.realData ?? false);
      })
      .catch(() => setError("Error al cargar señales"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse h-[280px]" />
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-lg font-bold text-slate-100 mb-2">Vista B — Riesgo sectorial</h3>
      <p className="text-slate-500 text-xs mb-4">
        {realData ? "Datos: datos.gob.ar (series de actividad / EMAE). Presión desde variación interanual." : "Índice de presión agregada (ejemplo cuando no hay series sectoriales). Decisiones: priorizar cobranza / fiscalización."}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-700">
              <th className="text-left py-2 font-medium">Sector</th>
              <th className="text-right py-2 font-medium">Presión (0-100)</th>
              <th className="text-right py-2 font-medium">Riesgo rel.</th>
              <th className="text-center py-2 font-medium">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s) => (
              <tr key={s.sector_id} className="border-b border-slate-800/80 text-slate-300">
                <td className="py-2">{s.sector_name}</td>
                <td className="text-right py-2">{s.pressure_index}</td>
                <td className="text-right py-2">{s.risk_relative.toFixed(2)}</td>
                <td className="text-center py-2">
                  <TrendIcon trend={s.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
