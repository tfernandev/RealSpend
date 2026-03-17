export type EventType =
    | 'BUDGET_EXECUTION' // Publicación de nuevos datos
    | 'HISTORICAL_CORRECTION' // Corrección de datos pasados
    | 'INFLATION_UPDATE' // Nuevo IPC
    | 'FISCAL_CALENDAR_UPDATE' // Cierre de períodos
    | 'STRUCTURAL_CHANGE'; // Cambio en partidas

export interface ValidationStatus {
    isValid: boolean;
    sourceUrl: string;
    hash: string; // Para auditabilidad
    timestamp: string;
}

export interface InflationIndex {
    date: string; // ISO Date YYYY-MM-DD
    value: number; // Valor del índice
    source: string;
    version: number;
}

export interface BudgetItem {
    id: string;
    program_id: string;
    program_name: string;
    nominal_amount: number;
    period: string; // YYYY-MM
    currency: string;
}

export interface RealImpactResult {
    period: string;
    nominal_amount: number;
    real_amount: number; // Ajustado a base 100 o fecha base
    purchasing_power_change_percent: number;
    seasonality_factor: number;
    program_id?: string;
    program_name?: string;
}

/** Formato para gráficos: RealImpactResult + etiqueta de mes (ej. "Ene", "Feb") */
export type RealSpendChartPoint = RealImpactResult & { month: string };

/** Programa para selector (Vista A). Fuente: Presupuesto Abierto / estructura programática. */
export interface ProgramSummary {
    id: string;
    name: string;
}

/** Filtros para GET /api/signals/real-spend. periodFrom/periodTo en YYYY-MM. */
export interface RealSpendFilters {
    programId?: string;
    periodFrom?: string;
    periodTo?: string;
}

/** Respuesta resumida a las preguntas del proyecto (puntapie §3). */
export interface RealSpendSummary {
    firstPeriod: string;
    lastPeriod: string;
    nominalChangePercent: number;
    realChangePercent: number;
    /** Si el aumento nominal compensó la inflación (real >= 0 o mejora). */
    inflationCompensated: boolean;
    /** Cambio de poder de compra en el período (ej. -15 = cayó 15%). */
    purchasingPowerChangePercent: number;
    /** "compró más" | "compró menos" | "lo mismo" respecto al inicio. */
    realPurchaseVsStart: "more" | "less" | "same";
}

/** Respuesta de GET /api/signals/real-spend: lista de programas + serie filtrada. */
export interface RealSpendResponse {
    programs: ProgramSummary[];
    series: RealImpactResult[];
    meta: {
        source: string;
        filters: RealSpendFilters;
        updatedAt: string; // ISO
        realIPC?: boolean;
        realBudget?: boolean;
        summary?: RealSpendSummary;
        /** Eventos considerados para este cálculo (observar → versionar → comparar → recalcular). */
        eventsApplied?: string[];
        methodology?: string;
        /** Versión del estado de datos (incrementa cuando hay INFLATION_UPDATE o BUDGET_EXECUTION). */
        versionId?: number;
        /** Últimos eventos detectados (nuevo IPC, nueva publicación presupuesto). */
        recentEvents?: { id: string; type: string; at: string; payload?: unknown }[];
    };
}

/** Vista B: señal de riesgo económico sectorial-regional (agregado, no individual). */
export interface SectorRiskSignal {
    sector_id: string;
    sector_name: string;
    region_id?: string;
    region_name?: string;
    pressure_index: number;   // 0-100, mayor = más presión
    risk_relative: number;   // relativo al promedio (1 = promedio, >1 = más riesgo)
    trend: "up" | "stable" | "down"; // tendencia reciente
    period: string;         // YYYY-MM
}

export interface SectorRiskResponse {
    signals: SectorRiskSignal[];
    meta: { source: string; period: string; updatedAt: string; realData?: boolean };
}

export interface SystemEvent {
    id: string;
    type: EventType;
    timestamp: string;
    payload: any;
    affected_periods: string[];
}
