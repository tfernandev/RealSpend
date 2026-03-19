# RealSpend — Decision Intelligence Engine (MVP)

Sistema de análisis que transforma datos públicos en **señales económicas reales** ajustadas por inflación y estacionalidad. Diseñado para B2B (Fintechs, SaaS financieros, Analistas) que necesitan navegar la "ilusión nominal" en contextos de alta inflación.

## Valor Estratégico
- **Reality Check Engine™:** Motor de deflactación y normalización que revela la variación real (poder de compra) detrás de los montos nominales.
- **Decision Intelligence:** Transforma datos brutos (Open Data) en señales operativas para priorizar cobranzas, ajustar presupuestos y detectar desvíos reales.
- **Arquitectura Senior:** Motor orientado a eventos con trazabilidad de versiones de datos y reprocesamiento automático.

## Roadmap del Nivel Senior
- [x] **Motor de Deflactación:** Integración via API con INDEC (IPC) y Presupuesto Abierto.
- [x] **Detección de Eventos:** Sistema `version-store` para inmutabilidad de señales.
- [/] **Senior Architecture (WIP):**
    - [ ] Migración de Next.js API Routes a Backend dedicado en **.NET Core**.
    - [ ] Persistencia en **PostgreSQL** (Tablas: `budget_versions`, `ipc_index`, `real_adjustments`).
    - [ ] ETL Jobs mensuales para ingestión de Open Data.

## Stack Técnico
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts, Framer Motion.
- **Backend:** Next.js API Routes (actual) -> Migrando a .NET Core.
- **Signals:** `lib/data/version-store.ts` (Event sourcing conceptual).

## Cómo correr
```bash
npm install
npm run dev
```
Abrir [http://localhost:3001](http://localhost:3001) (o puerto disponible).

## Qué NO hace
No evalúa eficiencia política ni predice default individual. Produce contexto económico corregido; la decisión final es del usuario humano.

---
**Senior Portfolio Insight:** Este no es un dashboard de visualización tradicional. Es un sistema de *Data Engineering* que da significado económico al dato ciego.
