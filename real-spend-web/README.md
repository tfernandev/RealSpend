# Economic Signal Engine — RealSpend

Motor de señales económicas que traduce **datos públicos agregados** en indicadores de riesgo e impacto económico, para orientar decisiones de asignación de recursos (sector público y privado).

El sistema **no predice comportamientos individuales**. Reinterpreta señales macro y meso-económicas para responder: *¿Dónde el dinero rinde menos de lo que parece, y dónde se concentra el riesgo económico?*

## Dos vistas, un motor

- **Vista A — RealSpend:** impacto del gasto público (índice de poder de compra real, deterioro histórico, desvíos no estacionales). Decisiones: programas que pierden capacidad real, aumentos nominales engañosos, comparación entre períodos.
- **Vista B — Riesgo sectorial-regional:** (en desarrollo) índice de presión económica agregada, riesgo sectorial-regional, tendencias de deterioro. Decisiones: priorizar cobranza, fiscalización, estrategias de contacto.

Ambas comparten: ajuste por inflación, estacionalidad, detección de desvíos reales. Datos **reproducibles, auditables, no sensibles**.

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Recharts**, **Framer Motion**, **Tailwind CSS 4**
- Tipos de dominio en `lib/types.ts`; API de señales en `app/api/signals/real-spend`

## Cómo correr

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Presupuesto Abierto: datos abiertos y token

- **Datos abiertos (sin token):** Ver [docs/PRESUPUESTO_DATOS.md](docs/PRESUPUESTO_DATOS.md) — URLs de CSV/ZIP en datos.gob.ar (serie anual por finalidad/función, totales).
- **Token API:** Solicitud en https://www.presupuestoabierto.gob.ar/sici/api-pac. Paso a paso en el mismo doc. Si tenés token, configurá `PRESUPUESTO_ABIERTO_TOKEN` en `.env.local` (ver `.env.example`).

## Fuentes de datos (producción)

- **Vista A (RealSpend):** [Presupuesto Abierto](https://www.presupuestoabierto.gob.ar/) — ejecución presupuestaria, estructura programática (desde 2002). API: presupuestoabierto.gob.ar/api/v1 (token). IPC: INDEC.
- **Vista B (riesgo sectorial):** INDEC (actividad por sector), BCRA (crédito, tasas), registros agregados por sector/región. Todo público, no sensible.

## API

- `GET /api/signals/real-spend?programId=&periodFrom=&periodTo=` — Devuelve `{ programs, series, meta }`. Lista de programas + serie nominal vs real (filtrable por programa y período). Hoy mock; producción: Presupuesto Abierto + IPC + estacionalidad.
- `GET /api/signals/sector-risk` — Devuelve `{ signals: SectorRiskSignal[], meta }`. Vista B: índice de presión por sector. Hoy mock; producción: INDEC, BCRA.

## Qué NO hace

No evalúa eficiencia política, no predice default individual, no acusa corrupción, no reemplaza análisis humano, no promete tiempo real. Produce contexto económico corregido; la decisión final es externa.

## Licencia

Open Data. (Ajustar según repo.)
