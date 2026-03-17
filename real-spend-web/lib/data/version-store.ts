/**
 * Persistencia de versiones y detección de eventos (nuevo IPC, nueva publicación presupuesto).
 * Estado en .real-spend-state/state.json (gitignored). En producción reemplazar por DB/KV si hace falta.
 */

import { promises as fs } from "fs";
import path from "path";

const STATE_DIR = ".real-spend-state";
const STATE_FILE = "state.json";

export type StoredEventType = "INFLATION_UPDATE" | "BUDGET_EXECUTION" | "HISTORICAL_CORRECTION" | "FISCAL_CALENDAR_UPDATE" | "STRUCTURAL_CHANGE";

export interface StoredEvent {
  id: string;
  type: StoredEventType;
  at: string; // ISO
  payload: { period?: string; value?: number; exercise?: number; summary?: string };
}

export interface VersionState {
  versionId: number;
  ipc: { lastPeriod: string; lastValue: number; fetchedAt: string };
  presupuesto: { lastFetchedAt: string; exercise: number; rowsHash?: string };
  eventLog: StoredEvent[];
  updatedAt: string;
}

const defaultState: VersionState = {
  versionId: 0,
  ipc: { lastPeriod: "", lastValue: 0, fetchedAt: "" },
  presupuesto: { lastFetchedAt: "", exercise: 0 },
  eventLog: [],
  updatedAt: new Date().toISOString(),
};

function statePath(): string {
  return path.join(process.cwd(), STATE_DIR, STATE_FILE);
}

export async function readVersionState(): Promise<VersionState> {
  try {
    const p = statePath();
    const raw = await fs.readFile(p, "utf-8");
    const data = JSON.parse(raw) as VersionState;
    return {
      ...defaultState,
      ...data,
      eventLog: data.eventLog ?? [],
    };
  } catch {
    return { ...defaultState };
  }
}

export async function writeVersionState(state: VersionState): Promise<void> {
  const dir = path.join(process.cwd(), STATE_DIR);
  await fs.mkdir(dir, { recursive: true });
  state.updatedAt = new Date().toISOString();
  await fs.writeFile(statePath(), JSON.stringify(state, null, 2), "utf-8");
}

function simpleHash(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64").slice(0, 32);
}

/** Detecta nuevos eventos comparando con el estado guardado y persiste si hay cambios. */
export async function detectAndRecordEvents(
  ipcPoints: { period: string; value: number }[],
  budgetRows?: unknown[]
): Promise<{ newEvents: StoredEvent[]; versionId: number; eventLog: StoredEvent[] }> {
  const state = await readVersionState();
  const newEvents: StoredEvent[] = [];
  let newState = { ...state };

  if (ipcPoints.length > 0) {
    const latest = ipcPoints[ipcPoints.length - 1];
    const isNewPeriod = latest.period !== state.ipc.lastPeriod;
    const isNewValue = state.ipc.lastPeriod === latest.period && state.ipc.lastValue !== latest.value;
    if (isNewPeriod || isNewValue) {
      newEvents.push({
        id: `ev-${Date.now()}-ipc`,
        type: "INFLATION_UPDATE",
        at: new Date().toISOString(),
        payload: { period: latest.period, value: latest.value, summary: `IPC ${latest.period}: ${latest.value}` },
      });
      newState = {
        ...newState,
        ipc: { lastPeriod: latest.period, lastValue: latest.value, fetchedAt: new Date().toISOString() },
      };
    }
  }

  if (budgetRows && budgetRows.length > 0) {
    const hash = simpleHash(budgetRows.length + budgetRows.slice(0, 5));
    const lastHash = state.presupuesto.rowsHash;
    const isNewBudget = !lastHash || lastHash !== hash;
    if (isNewBudget) {
      newEvents.push({
        id: `ev-${Date.now()}-budget`,
        type: "BUDGET_EXECUTION",
        at: new Date().toISOString(),
        payload: { exercise: new Date().getFullYear(), summary: `Publicación presupuesto: ${budgetRows.length} filas` },
      });
      newState = {
        ...newState,
        presupuesto: {
          lastFetchedAt: new Date().toISOString(),
          exercise: new Date().getFullYear(),
          rowsHash: hash,
        },
      };
    }
  }

  if (newEvents.length > 0) {
    newState.versionId = state.versionId + 1;
    newState.eventLog = [...state.eventLog, ...newEvents].slice(-100);
    await writeVersionState(newState);
    return { newEvents, versionId: newState.versionId, eventLog: newState.eventLog };
  }

  return { newEvents: [], versionId: state.versionId, eventLog: state.eventLog };
}
