import { NextRequest, NextResponse } from "next/server";
import type { SectorRiskResponse, SectorRiskSignal } from "@/lib/types";
import { fetchSectorRiskSignals } from "@/lib/data/sector-risk";



function lastPeriod(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const month = m === 0 ? 12 : m;
  const year = m === 0 ? y - 1 : y;
  return `${year}-${String(month).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") || lastPeriod();
  let signals: SectorRiskSignal[];
  let source: string;
  let realData = false;

  try {
    const fromApi = await fetchSectorRiskSignals(period);
    if (fromApi.length > 0) {
      signals = fromApi;
      source = "datos.gob.ar (series de actividad / EMAE). Presión desde variación interanual.";
      realData = true;
    } else {
      throw new Error("Sin series sectoriales disponibles en la fecha seleccionada.");
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  }

  const response: SectorRiskResponse = {
    signals,
    meta: {
      source,
      period,
      updatedAt: new Date().toISOString(),
      realData,
    },
  };
  return NextResponse.json(response);
}
