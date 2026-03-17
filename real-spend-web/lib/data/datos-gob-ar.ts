/**
 * Cliente para API de Series de Tiempo (datos.gob.ar).
 * IPC: Índice de Precios al Consumidor GBA, base diciembre 2016 (INDEC).
 * Fuente: https://apis.datos.gob.ar/series/
 * Sin autenticación.
 */

const BASE_URL = "https://apis.datos.gob.ar/series/api/series";
/** IPC GBA, nivel general, base dic 2016, mensual (INDEC). */
const IPC_SERIE_ID = "101.1_I2NG_2016_M_22";

export interface DatosGobSeriePoint {
  period: string; // YYYY-MM
  value: number;
}

export interface DatosGobSeriesResponse {
  data: [string, number][]; // [["YYYY-MM-DD", value], ...]
  count: number;
  meta?: unknown;
}

/**
 * Obtiene IPC mensual desde datos.gob.ar.
 * @param startDate YYYY-MM-DD o YYYY-MM
 * @param limit cantidad de puntos (default 24)
 */
export async function fetchIPC(
  startDate?: string,
  limit = 24
): Promise<DatosGobSeriePoint[]> {
  const params = new URLSearchParams({
    ids: IPC_SERIE_ID,
    format: "json",
    limit: String(limit),
  });
  if (startDate) {
    const date = startDate.length === 7 ? `${startDate}-01` : startDate;
    params.set("start_date", date);
  }

  const res = await fetch(`${BASE_URL}/?${params.toString()}`, {
    next: { revalidate: 3600 }, // cache 1h en server
  });
  if (!res.ok) throw new Error(`datos.gob.ar: ${res.status}`);

  const json = (await res.json()) as DatosGobSeriesResponse;
  if (!Array.isArray(json.data)) return [];

  return json.data.map(([dateStr, value]) => ({
    period: dateStr.slice(0, 7), // YYYY-MM
    value,
  }));
}

/**
 * Obtiene una serie genérica por ID (ej. EMAE, actividad por sector).
 * @param seriesId ID en API datos.gob.ar (ej. "143.3" para EMAE)
 * @param startDate YYYY-MM opcional
 * @param limit cantidad de puntos
 */
export async function fetchSeries(
  seriesId: string,
  startDate?: string,
  limit = 24
): Promise<DatosGobSeriePoint[]> {
  const params = new URLSearchParams({
    ids: seriesId,
    format: "json",
    limit: String(limit),
  });
  if (startDate) {
    const date = startDate.length === 7 ? `${startDate}-01` : startDate;
    params.set("start_date", date);
  }
  const res = await fetch(`${BASE_URL}/?${params.toString()}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`datos.gob.ar series ${seriesId}: ${res.status}`);
  const json = (await res.json()) as DatosGobSeriesResponse;
  if (!Array.isArray(json.data)) return [];
  return json.data.map(([dateStr, value]) => ({
    period: dateStr.slice(0, 7),
    value: Number(value),
  }));
}
