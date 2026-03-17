/**
 * Estacionalidad calculada con historial real de IPC (media por mes / media global).
 * Fuente: mismos datos que deflactación (datos.gob.ar IPC).
 */

import { fetchIPC } from "./datos-gob-ar";

const MONTHS_REQUIRED = 36;

/** Índice estacional por mes (1-12). Promedio del mes / promedio global; normalizado para que promedio = 1. */
export async function getSeasonalityFromIPC(endYear: number): Promise<Map<number, number>> {
  const startYear = endYear - 3;
  const points = await fetchIPC(`${startYear}-01`, MONTHS_REQUIRED);
  if (points.length < 12) return defaultSeasonalityMap();

  const byMonth = new Map<number, number[]>();
  for (const p of points) {
    const [, m] = p.period.split("-").map(Number);
    const month = m ?? 1;
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month)!.push(p.value);
  }

  const monthAverages = new Map<number, number>();
  let sumAll = 0;
  let countAll = 0;
  for (let month = 1; month <= 12; month++) {
    const arr = byMonth.get(month);
    const avg = arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 1;
    monthAverages.set(month, avg);
    sumAll += avg;
    countAll += 1;
  }
  const globalAvg = countAll > 0 ? sumAll / countAll : 1;

  const out = new Map<number, number>();
  let sumRatio = 0;
  for (let month = 1; month <= 12; month++) {
    const ratio = globalAvg > 0 ? monthAverages.get(month)! / globalAvg : 1;
    out.set(month, ratio);
    sumRatio += ratio;
  }
  const norm = sumRatio / 12;
  if (norm > 0) {
    for (let month = 1; month <= 12; month++) {
      out.set(month, out.get(month)! / norm);
    }
  }
  return out;
}

function defaultSeasonalityMap(): Map<number, number> {
  const m = new Map<number, number>();
  for (let i = 1; i <= 12; i++) m.set(i, 1);
  return m;
}

/** Factor estacional para un período YYYY-MM usando el mapa calculado (o 1 si no hay). */
export function seasonalityFactorForPeriod(period: string, monthIndex: Map<number, number>): number {
  if (!period || monthIndex.size === 0) return 1;
  const [, monthStr] = period.split("-");
  const month = parseInt(monthStr ?? "1", 10);
  return monthIndex.get(month) ?? 1;
}
