"use client";

import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { motion } from "framer-motion";
import type { RealImpactResult, RealSpendChartPoint } from "@/lib/types";

const MONTH_LABELS: Record<string, string> = {
    "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

function toChartPoint(r: RealImpactResult): RealSpendChartPoint {
    const [, month] = r.period.split("-");
    return {
        ...r,
        month: MONTH_LABELS[month] ?? r.period,
    };
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: RealSpendChartPoint }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="glass p-4 rounded-lg shadow-xl border border-slate-700">
            <p className="text-slate-200 font-bold mb-2">{label}</p>
            <p className="text-slate-400 text-sm">
                Nominal: <span className="text-slate-200">${d.nominal_amount}</span>
            </p>
            <p className="text-emerald-400 text-sm font-bold">
                Real: <span>${d.real_amount}</span>
            </p>
            <p className="text-red-400 text-xs mt-1">
                Pérdida acum: {d.purchasing_power_change_percent}%
            </p>
        </div>
    );
}

interface RealSpendChartProps {
    data: RealImpactResult[];
    programName?: string;
    loading?: boolean;
    error?: string | null;
    /** true si el IPC proviene de datos.gob.ar (INDEC). */
    realIPC?: boolean;
    /** true si el gasto nominal proviene de Presupuesto Abierto (API). */
    realBudget?: boolean;
}

export default function RealSpendChart({ data, programName = "Total agregado", loading = false, error = null, realIPC = false, realBudget = false }: RealSpendChartProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const chartData = data.map(toChartPoint);

    if (!mounted) {
        return <div className="h-[400px] w-full animate-pulse bg-slate-900/50 rounded-xl" />;
    }

    if (error) {
        return (
            <div className="h-[400px] w-full p-6 glass rounded-xl border border-slate-800 flex items-center justify-center text-red-400">
                {error}
            </div>
        );
    }

    if (loading && !chartData.length) {
        return <div className="h-[400px] w-full animate-pulse bg-slate-900/50 rounded-xl" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-[400px] p-6 glass rounded-xl border border-slate-800"
        >
            <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    {realIPC ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            IPC real — datos.gob.ar (INDEC)
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            IPC no disponible — usando ejemplo
                        </span>
                    )}
                    {realBudget ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Gasto nominal: Presupuesto Abierto (API)
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-600/40 text-slate-400 border border-slate-600/60">
                            Gasto nominal: ejemplo (configure PRESUPUESTO_ABIERTO_TOKEN)
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-slate-100">Evolución: Nominal vs Real</h3>
                <p className="text-slate-400 text-sm">
                    Vista A — {programName}. Impacto real deflactado con IPC oficial cuando está disponible.
                </p>
            </div>

            {!chartData.length ? (
                <div className="h-[300px] flex items-center justify-center text-slate-500 text-sm">
                    Sin datos para el filtro seleccionado.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            tick={{ fill: "#64748b" }}
                            axisLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: "#64748b" }}
                            axisLine={{ stroke: "#334155" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="nominal_amount"
                            name="Gasto Nominal ($)"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="real_amount"
                            name="Impacto Real (Base 100)"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                            activeDot={{ r: 8, fill: "#10b981" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="purchasing_power_change_percent"
                            name="Pérdida acum (%)"
                            stroke="#ef4444"
                            strokeWidth={1}
                            dot={false}
                            hide
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
}
