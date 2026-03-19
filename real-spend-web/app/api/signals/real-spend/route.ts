import { NextRequest, NextResponse } from "next/server";
import type {
  RealImpactResult,
  RealSpendResponse,
  RealSpendSummary,
  ProgramSummary,
  RealSpendFilters,
} from "@/lib/types";
import { fetchIPC } from "@/lib/data/datos-gob-ar";
import { getSeasonalityFromIPC, seasonalityFactorForPeriod } from "@/lib/data/seasonality";
import { detectAndRecordEvents } from "@/lib/data/version-store";
import {
  getToken as getPresupuestoToken,
  fetchProgramas,
  fetchNominalSeries,
} from "@/lib/data/presupuesto-abierto";

const EVENTS_APPLIED_BASE = [
  "Publicación de datos de ejecución presupuestaria",
  "Publicación de índice de inflación (IPC)",
  "Comparación contra estados anteriores",
  "Recálculo del impacto económico real",
];

function computeSummary(series: RealImpactResult[]): RealSpendSummary | undefined {
  if (series.length < 2) return undefined;
  const first = series[0];
  const last = series[series.length - 1];
  const nominalChange = ((last.nominal_amount - first.nominal_amount) / first.nominal_amount) * 100;
  const realChange = ((last.real_amount - first.real_amount) / first.real_amount) * 100;
  const purchasingPowerChange = last.purchasing_power_change_percent - first.purchasing_power_change_percent;
  const inflationCompensated = realChange >= 0;
  let realPurchaseVsStart: "more" | "less" | "same" = "same";
  if (last.real_amount > first.real_amount * 1.005) realPurchaseVsStart = "more";
  else if (last.real_amount < first.real_amount * 0.995) realPurchaseVsStart = "less";
  return {
    firstPeriod: first.period,
    lastPeriod: last.period,
    nominalChangePercent: Math.round(nominalChange * 10) / 10,
    realChangePercent: Math.round(realChange * 10) / 10,
    inflationCompensated,
    purchasingPowerChangePercent: Math.round(purchasingPowerChange * 10) / 10,
    realPurchaseVsStart,
  };
}

/** Fallback cuando no hay suficientes datos para estacionalidad real. */
function fallbackSeasonalityFactor(period: string): number {
  const [, m] = period.split("-").map(Number);
  const typical = [1.05, 0.98, 1.02, 1, 1, 1.08, 0.95, 1, 1, 1, 1, 1.15];
  return typical[(m ?? 1) - 1] ?? 1;
}



function filterByPeriod(series: RealImpactResult[], from?: string, to?: string): RealImpactResult[] {
  if (!from && !to) return series;
  return series.filter((r) => {
    if (from && r.period < from) return false;
    if (to && r.period > to) return false;
    return true;
  });
}

function applyIPC(
  nominalPoints: { period: string; nominal_amount: number; program_id?: string; program_name?: string }[],
  ipcByPeriod: Map<string, number>,
  baseIpc: number,
  getSeasonality: (period: string) => number,
  programId?: string,
  programName?: string
): RealImpactResult[] {
  return nominalPoints.map(({ period, nominal_amount, program_id, program_name }) => {
    const ipc = ipcByPeriod.get(period);
    const seasonality_factor = getSeasonality(period);
    if (ipc == null) {
      return {
        period,
        nominal_amount: nominal_amount,
        real_amount: nominal_amount,
        purchasing_power_change_percent: 0,
        seasonality_factor,
        ...(programId != null ? { program_id: programId, program_name: programName } : program_id != null ? { program_id, program_name } : {}),
      };
    }
    const real = Math.round((nominal_amount * baseIpc) / ipc);
    const purchasing_power_change_percent = Math.round(((ipc / baseIpc) - 1) * 100);
    return {
      period,
      nominal_amount,
      real_amount: real,
      purchasing_power_change_percent,
      seasonality_factor,
      ...(programId != null ? { program_id: programId, program_name: programName } : program_id != null ? { program_id, program_name } : {}),
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get("programId") || undefined;
  const periodFrom = searchParams.get("periodFrom") || undefined;
  const periodTo = searchParams.get("periodTo") || undefined;

  const filters: RealSpendFilters = { programId, periodFrom, periodTo };
  const year = periodFrom ? parseInt(periodFrom.slice(0, 4), 10) : periodTo ? parseInt(periodTo.slice(0, 4), 10) : 2024;
  const hasToken = !!getPresupuestoToken();

  let programs: ProgramSummary[] = [];
  let nominalPoints: { period: string; nominal_amount: number; program_id?: string; program_name?: string }[];
  let source: string;
  let realBudget = false;

  if (!hasToken) {
    return NextResponse.json({ error: "PRESUPUESTO_ABIERTO_TOKEN no está configurado." }, { status: 401 });
  }

  try {
    const [programList, nominalFromApi] = await Promise.all([
      fetchProgramas(year),
      fetchNominalSeries(year, programId === "total" || !programId ? undefined : programId),
    ]);
    if (programList.length > 0) {
      programs = [{ id: "total", name: "Total agregado" }, ...programList];
    } else {
      throw new Error("No se pudo obtener la lista de programas desde Presupuesto Abierto.");
    }
    if (nominalFromApi.length > 0) {
      nominalPoints = nominalFromApi;
      realBudget = true;
      source = "Presupuesto Abierto (API)";
    } else {
      throw new Error(`No hay datos de gasto/ejecución disponibles para el año ${year}.`);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  }

  const programName = programs.find((p) => p.id === (programId ?? "total"))?.name ?? "Total agregado";

  let series: RealImpactResult[];
  let realIPC = false;
  let seasonalityFromData = false;
  let versionId: number | undefined;
  let recentEvents: { id: string; type: string; at: string; payload?: unknown }[] = [];

  try {
    const [ipcPoints, seasonalityMap] = await Promise.all([
      fetchIPC(`${year}-01`, 24),
      getSeasonalityFromIPC(year).catch(() => new Map<number, number>()),
    ]);

    const getSeasonality = (period: string): number =>
      seasonalityMap.size > 0 ? seasonalityFactorForPeriod(period, seasonalityMap) : fallbackSeasonalityFactor(period);
    if (seasonalityMap.size > 0) seasonalityFromData = true;

    const budgetSnapshotForVersion = realBudget ? nominalPoints : undefined;
    const eventResult = await detectAndRecordEvents(
      ipcPoints.map((p) => ({ period: p.period, value: p.value })),
      budgetSnapshotForVersion
    );
    versionId = eventResult.versionId;
    recentEvents = eventResult.newEvents.map((e) => ({ id: e.id, type: e.type, at: e.at, payload: e.payload }));

    if (ipcPoints.length > 0) {
      const ipcByPeriod = new Map(ipcPoints.map((p) => [p.period, p.value]));
      const baseIpc = ipcPoints[0]?.value ?? 100;
      series = applyIPC(nominalPoints, ipcByPeriod, baseIpc, getSeasonality, programId ?? undefined, programName);
      realIPC = true;
      source += " + IPC real: datos.gob.ar (INDEC).";
    } else {
      throw new Error(`El INDEC (mediante datos.gob.ar) no devolvió datos del IPC para ${year}.`);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  }

  const filtered = filterByPeriod(series, periodFrom, periodTo);
  const summary = computeSummary(filtered);
  const methodology =
    "Impacto real = gasto nominal × (IPC base / IPC período). Estacionalidad: calculada con historial IPC 36 meses (media por mes / media global); si no hay datos suficientes se usa factor típico. Fuentes: Presupuesto Abierto (crédito/ejecución), datos.gob.ar (IPC INDEC).";

  const response: RealSpendResponse = {
    programs,
    series: filtered,
    meta: {
      source,
      filters,
      updatedAt: new Date().toISOString(),
      realIPC,
      realBudget,
      summary,
      eventsApplied: EVENTS_APPLIED_BASE,
      methodology,
      versionId,
      recentEvents: recentEvents.length > 0 ? recentEvents : undefined,
    },
  };
  return NextResponse.json(response);
}
