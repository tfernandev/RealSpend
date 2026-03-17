/**
 * Cliente para API Presupuesto Abierto (Argentina).
 * POST /credito — crédito vigente por programa y mes.
 * Auth: Bearer token (PRESUPUESTO_ABIERTO_TOKEN).
 * Doc: https://presupuesto-abierto.argentina.apidocs.ar/
 */

const BASE_URL = "https://www.presupuestoabierto.gob.ar/api/v1";

export function getToken(): string | undefined {
  return process.env.PRESUPUESTO_ABIERTO_TOKEN;
}

export interface PresupuestoCreditoRow {
  impacto_presupuestario_anio?: number;
  impacto_presupuestario_mes?: number;
  programa_id?: string | number;
  programa_desc?: string;
  credito_vigente?: number;
  credito_ejecutado?: number;
  [key: string]: unknown;
}

export interface PresupuestoCreditoResponse {
  data?: PresupuestoCreditoRow[];
  [key: string]: unknown;
}

/**
 * Llama a POST /credito con columnas por programa y mes. Devuelve filas con año, mes, programa y monto.
 */
export async function fetchCreditoByProgramAndMonth(
  year: number,
  columns: string[] = [
    "impacto_presupuestario_anio",
    "impacto_presupuestario_mes",
    "programa_id",
    "programa_desc",
    "credito_vigente",
  ]
): Promise<PresupuestoCreditoRow[]> {
  const token = process.env.PRESUPUESTO_ABIERTO_TOKEN;
  if (!token) throw new Error("PRESUPUESTO_ABIERTO_TOKEN no configurado");

  const res = await fetch(`${BASE_URL}/credito?format=json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Crédito por programa y mes",
      columns,
      ejercicios: [year],
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Token Presupuesto Abierto inválido o expirado");
    throw new Error(`Presupuesto Abierto: ${res.status}`);
  }

  const json = (await res.json()) as PresupuestoCreditoResponse;
  const data = json?.data ?? json;
  if (!Array.isArray(data)) return [];
  return data;
}

/**
 * Obtiene lista única de programas (programa_id, programa_desc) desde la API.
 */
export async function fetchProgramas(year: number): Promise<{ id: string; name: string }[]> {
  const rows = await fetchCreditoByProgramAndMonth(year, [
    "programa_id",
    "programa_desc",
  ]);
  const seen = new Set<string>();
  const programs: { id: string; name: string }[] = [];
  for (const r of rows) {
    const id = String(r.programa_id ?? "").trim();
    const name = String(r.programa_desc ?? "Sin nombre").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    programs.push({ id, name });
  }
  programs.sort((a, b) => a.name.localeCompare(b.name));
  return programs;
}

/**
 * Devuelve serie nominal por período (YYYY-MM) y opcionalmente por programa_id.
 * Agrupa por (anio, mes) o por (anio, mes, programa_id) y suma credito_vigente (o credito_ejecutado si existe).
 */
export async function fetchNominalSeries(
  year: number,
  programId?: string
): Promise<{ period: string; nominal_amount: number; program_id?: string; program_name?: string }[]> {
  const rows = await fetchCreditoByProgramAndMonth(year);
  const byPeriod = new Map<string, { nominal: number; program_id?: string; program_name?: string }>();

  for (const r of rows) {
    const anio = r.impacto_presupuestario_anio ?? year;
    const mes = r.impacto_presupuestario_mes;
    if (mes == null || mes < 1 || mes > 12) continue;
    const pid = String(r.programa_id ?? "").trim();
    if (programId != null && programId !== "" && pid !== programId) continue;

    const period = `${anio}-${String(mes).padStart(2, "0")}`;
    const monto = Number(r.credito_ejecutado ?? r.credito_vigente ?? 0);
    const key = programId ? `${period}-${pid}` : period;
    const prev = byPeriod.get(key);
    const name = String(r.programa_desc ?? "").trim();
    if (prev) {
      prev.nominal += monto;
    } else {
      byPeriod.set(key, { nominal: monto, program_id: pid || undefined, program_name: name || undefined });
    }
  }

  return Array.from(byPeriod.entries())
    .map(([key, v]) => {
      const period = programId ? key.slice(0, 7) : key;
      return {
        period,
        nominal_amount: Math.round(v.nominal),
        program_id: v.program_id,
        program_name: v.program_name,
      };
    })
    .sort((a, b) => a.period.localeCompare(b.period));
}
