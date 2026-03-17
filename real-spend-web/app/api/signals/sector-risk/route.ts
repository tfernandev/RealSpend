import { NextRequest, NextResponse } from "next/server";
import type { SectorRiskResponse, SectorRiskSignal } from "@/lib/types";
import { fetchSectorRiskSignals } from "@/lib/data/sector-risk";

const MOCK_SIGNALS: SectorRiskSignal[] = [
  { sector_id: "CIIU_47", sector_name: "Comercio al por menor", pressure_index: 72, risk_relative: 1.3, trend: "up", period: "2024-12" },
  { sector_id: "CIIU_41", sector_name: "Construcción de edificios", pressure_index: 68, risk_relative: 1.2, trend: "stable", period: "2024-12" },
  { sector_id: "CIIU_56", sector_name: "Actividades de comidas y bebidas", pressure_index: 65, risk_relative: 1.15, trend: "up", period: "2024-12" },
  { sector_id: "CIIU_10", sector_name: "Industria manufacturera (alimentos)", pressure_index: 58, risk_relative: 1.0, trend: "stable", period: "2024-12" },
  { sector_id: "CIIU_64", sector_name: "Servicios financieros", pressure_index: 45, risk_relative: 0.85, trend: "down", period: "2024-12" },
];

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
      signals = MOCK_SIGNALS.map((s) => ({ ...s, period }));
      source = "Sin series sectoriales disponibles; usando ejemplo. Fuente objetivo: datos.gob.ar (EMAE por sector).";
    }
  } catch {
    signals = MOCK_SIGNALS.map((s) => ({ ...s, period }));
    source = "Error al cargar datos.gob.ar; usando ejemplo. Fuente objetivo: INDEC/BCRA por sector.";
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
