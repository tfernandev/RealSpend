/**
 * Vista B: señales de riesgo económico sectorial-regional desde datos públicos.
 * Fuentes: datos.gob.ar (EMAE total y por sector cuando existan). Sin datos personales.
 */

import { fetchSeries } from "./datos-gob-ar";
import type { SectorRiskSignal } from "@/lib/types";

/** Series conocidas en datos.gob.ar para actividad por sector / total. EMAE y variantes. */
const SECTOR_SERIES: { id: string; name: string }[] = [
  { id: "143.3_NO_PR_2004_A_21", name: "EMAE Total" },
  { id: "143.3_NO_PR_2004_A_34", name: "EMAE Industria manufacturera" },
  { id: "143.3_NO_PR_2004_A_35", name: "EMAE Comercio" },
  { id: "143.3_NO_PR_2004_A_36", name: "EMAE Construcción" },
  { id: "143.3_NO_PR_2004_A_38", name: "EMAE Servicios" },
];

/** Fallback: IDs más cortos por si el formato cambia. */
const FALLBACK_IDS = ["143.3", "101.1_I2NG_2016_M_22"];

function computeTrend(values: number[]): "up" | "stable" | "down" {
  if (values.length < 3) return "stable";
  const recent = values.slice(-3);
  const slope = recent[2] - recent[0];
  if (slope > 0.5) return "up";
  if (slope < -0.5) return "down";
  return "stable";
}

/**
 * Obtiene señales de riesgo sectorial desde datos.gob.ar.
 * pressure_index: 0-100 a partir de variación interanual negativa (caída = más presión).
 * risk_relative: relativo al promedio de las series que vengan.
 */
export async function fetchSectorRiskSignals(period: string): Promise<SectorRiskSignal[]> {
  const [year, month] = period.split("-").map(Number);
  const startDate = `${year - 2}-01`;
  const signals: SectorRiskSignal[] = [];
  const seriesIdsToTry = [
    ...SECTOR_SERIES.map((s) => s.id),
    ...FALLBACK_IDS.filter((id) => !SECTOR_SERIES.some((s) => s.id === id)),
  ];

  for (const entry of SECTOR_SERIES) {
    try {
      const points = await fetchSeries(entry.id, startDate, 36);
      if (points.length < 12) continue;
      const current = points.find((p) => p.period === period);
      const yearAgo = points.find((p) => {
        const [y, m] = p.period.split("-").map(Number);
        return y === year - 1 && m === month;
      });
      const values = points.map((p) => p.value);
      const trend = computeTrend(values);
      const currentVal = current?.value ?? values[values.length - 1];
      const yearAgoVal = yearAgo?.value;
      let pressure_index = 50;
      let risk_relative = 1;
      if (yearAgoVal != null && yearAgoVal > 0) {
        const yoyChange = ((currentVal - yearAgoVal) / yearAgoVal) * 100;
        pressure_index = Math.min(100, Math.max(0, 50 - yoyChange));
        risk_relative = 1 + (yoyChange < 0 ? Math.abs(yoyChange) / 100 : 0);
      }
      signals.push({
        sector_id: entry.id,
        sector_name: entry.name,
        pressure_index: Math.round(pressure_index),
        risk_relative: Math.round(risk_relative * 100) / 100,
        trend,
        period,
      });
    } catch {
      continue;
    }
  }

  if (signals.length === 0) {
    for (const id of FALLBACK_IDS) {
      try {
        const points = await fetchSeries(id, startDate, 24);
        if (points.length < 12) continue;
        const values = points.map((p) => p.value);
        const trend = computeTrend(values);
        const last = values[values.length - 1];
        const yearAgo = values[values.length - 12];
        const yoyChange = yearAgo > 0 ? ((last - yearAgo) / yearAgo) * 100 : 0;
        const pressure_index = Math.min(100, Math.max(0, 50 - yoyChange));
        signals.push({
          sector_id: id,
          sector_name: id === "101.1_I2NG_2016_M_22" ? "IPC GBA (referencia)" : "Serie actividad",
          pressure_index: Math.round(pressure_index),
          risk_relative: 1,
          trend,
          period,
        });
        break;
      } catch {
        continue;
      }
    }
  }

  const avgPressure = signals.length > 0 ? signals.reduce((a, s) => a + s.pressure_index, 0) / signals.length : 50;
  for (const s of signals) {
    s.risk_relative = avgPressure > 0 ? Math.round((s.pressure_index / avgPressure) * 100) / 100 : 1;
  }
  return signals;
}
