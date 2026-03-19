import RealSpendDataSection from "@/components/RealSpendDataSection";
import SectorRiskTable from "@/components/SectorRiskTable";
import {
  TrendingUp,
  CalendarClock,
  Landmark,
  ArrowRight,
  Activity,
  Search,
  ShieldCheck,
  Building2,
  Ban,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center pb-20 overflow-x-hidden selection:bg-emerald-500/30">

      {/* Navbar */}
      <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-100">
            Real<span className="text-emerald-500">Spend</span> <span className="text-xs font-normal text-slate-500 ml-1">Decision Intelligence</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#concept" className="hover:text-emerald-400 transition-colors">Concepto</a>
          <a href="#data" className="hover:text-emerald-400 transition-colors">Datos</a>
          <a href="#vista-b" className="hover:text-emerald-400 transition-colors">Vista B</a>
          <a href="#limits" className="hover:text-emerald-400 transition-colors">Límites</a>
          <a href="#api" className="hover:text-emerald-400 transition-colors">API</a>
        </div>
        <a
          href="#data"
          className="px-5 py-2 text-sm font-medium bg-slate-100 text-slate-900 rounded-full hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/20"
        >
          Ver Demo
        </a>
      </nav>

      {/* Hero */}
      <main className="w-full max-w-7xl px-6 pt-20 md:pt-32 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 space-y-8 relative">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-medium text-emerald-400 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Decision Intelligence Engine — V0.1 Alpha
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-100 leading-[1.1]">
            Decision Intelligence sobre <span className="bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">datos públicos</span> en contextos <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">inflacionarios</span>.
          </h1>
          <p className="text-slate-500 text-sm max-w-xl font-mono uppercase tracking-widest">Reality Check Engine — Built for Seniors</p>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Un sistema que transforma datos públicos agregados en <span className="text-emerald-400 font-semibold italic">señales económicas reales</span>. No solo mostramos números; revelamos la pérdida de poder adquisitivo y el riesgo sectorial detrás de la ilusión nominal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="#data"
              className="px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 group"
            >
              Explorar Datos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#concept"
              className="px-8 py-4 bg-slate-900 text-slate-300 font-medium rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-500 transition-all"
            >
              Leer Concepto
            </a>
          </div>
        </div>
        <div className="flex-1 w-full relative z-0 scroll-mt-24" id="data">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-3xl rounded-full opacity-40 pointer-events-none" />
          <RealSpendDataSection />
          <div className="mt-4 flex justify-center gap-8 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full opacity-50" /> Gasto Nominal</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Impacto Real</span>
          </div>
        </div>
      </main>

      {/* Concepto: idea central + problema + qué hace */}
      <section id="concept" className="w-full max-w-7xl px-6 py-24 scroll-mt-20">
        <h2 className="text-3xl font-bold text-slate-100 mb-8">Idea central</h2>
        <p className="text-slate-400 text-lg max-w-3xl mb-8">
          El proyecto cruza tres dimensiones que hoy se observan por separado: finanzas públicas (ejecución presupuestaria), inflación y estacionalidad. Utiliza exclusivamente datos públicos, no personales, publicados por organismos oficiales, y no opera en tiempo real.
        </p>
        <p className="text-slate-300 max-w-3xl mb-12">
          En contextos inflacionarios, el gasto público se comunica y se evalúa en números que no representan su efecto real. El valor del sistema no está en descubrir datos nuevos, sino en dar significado económico real a datos que ya existen.
        </p>

        <h3 className="text-xl font-bold text-slate-200 mb-4">El problema sin técnica</h3>
        <p className="text-slate-400 mb-4">
          Mirar gasto en términos nominales es engañoso: los números crecen aunque la capacidad de compra caiga. Un presupuesto puede duplicarse en pesos y aun así comprar menos. La inflación rompe la comparación en el tiempo; la estacionalidad, la comparación entre meses. Se concluye mal porque se comparan montos sin contexto y se interpretan variaciones nominales como mejoras reales.
        </p>
        <p className="text-slate-500 text-sm italic mb-12">El problema no es la falta de datos; es la falta de una lectura económica integrada y consistente.</p>

        <h3 className="text-xl font-bold text-slate-200 mb-4">Preguntas que responde el proyecto</h3>
        <ul className="space-y-2 text-slate-400 mb-6">
          <li>¿Este gasto hoy compra más, menos o lo mismo que antes?</li>
          <li>¿El aumento presupuestario compensó la inflación o no?</li>
          <li>¿Esta variación es real o es estacional?</li>
          <li>¿Qué parte del gasto perdió poder adquisitivo de forma sostenida?</li>
        </ul>
        <p className="text-slate-400 mb-12">Las respuestas son comparativas, cuantificables, reproducibles y explicables. No dicen qué hacer; ordenan prioridades.</p>

        <h3 className="text-xl font-bold text-slate-200 mb-4">Qué hace el sistema</h3>
        <ul className="space-y-2 text-slate-400 mb-6">
          <li>Observa publicaciones oficiales</li>
          <li>Ajusta por inflación y patrones históricos (estacionalidad)</li>
          <li>Detecta desvíos reales (no nominales)</li>
          <li>Produce señales económicas comparables</li>
        </ul>
      </section>

      {/* Los 5 eventos que el sistema escucha */}
      {/* Reality Check Engine: Nicho B2B */}
      <section className="w-full max-w-7xl px-6 py-24 border-t border-slate-800">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-slate-100 italic underline decoration-emerald-500 underline-offset-8">Target: B2B Decision Intelligence</h2>
            <p className="text-slate-400 text-lg">
              Diseñado para Fintechs, estudios contables y SaaS financieros que necesitan responder una pregunta crítica: <span className="text-white">"¿Nuestros ingresos están mejorando o es solo inflación?"</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-emerald-500 font-bold">Fintechs & SaaS</span>
                <p className="text-xs text-slate-500 mt-1">Normalización de carteras de cobro contra IPC real.</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-amber-500 font-bold">Analistas & Periodistas</span>
                <p className="text-xs text-slate-500 mt-1">Explicar la economía real con métricas auditables.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all" />
            <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-100 underline decoration-slate-800 underline-offset-4">Reality Check Engine™</h3>
            <p className="text-slate-500 text-sm mt-4">
              Detección automática de "Engaños Nominales": <br /> 
              Identifica programas que parecen crecer pero pierden poder de compra real de manera crítica.
            </p>
          </div>
        </div>
      </section>

      {/* Dos vistas, un motor */}
      <section className="w-full bg-slate-900/50 border-y border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Dos vistas, un mismo motor</h2>
          <p className="text-slate-400 mb-12">Lo que cambia es quién mira y para qué.</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-slate-100">Vista A — RealSpend</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">Impacto del gasto público.</p>
              <ul className="text-slate-400 text-sm space-y-2 mb-4">
                <li>• Índice de poder de compra real del gasto</li>
                <li>• Deterioro o recuperación histórica</li>
                <li>• Desvíos no estacionales</li>
              </ul>
              <p className="text-slate-500 text-xs">Decisiones: identificar programas que pierden capacidad real; detectar aumentos nominales engañosos; comparar impacto real entre períodos. No juzga política, mide realidad económica.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-8 h-8 text-amber-400" />
                <h3 className="text-xl font-bold text-slate-100">Vista B — Riesgo sectorial-regional</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">Riesgo económico agregado (en desarrollo).</p>
              <ul className="text-slate-400 text-sm space-y-2 mb-4">
                <li>• Índice de presión económica agregada</li>
                <li>• Riesgo sectorial-regional relativo</li>
                <li>• Tendencias de deterioro económico</li>
              </ul>
              <p className="text-slate-500 text-xs">Decisiones: priorizar gestión de cobranza; asignar recursos de fiscalización; ajustar estrategias de contacto. No predice morosidad individual, orienta foco operativo.</p>
            </div>
          </div>

          <section id="vista-b" className="scroll-mt-20 mt-12">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Señales Vista B (ejemplo)</h3>
            <SectorRiskTable />
          </section>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-12">
            <Zap className="w-6 h-6 text-emerald-500 shrink-0" />
            <p className="text-slate-300 text-sm">
              Ambas transforman datos públicos agregados en señales que corrigen decisiones tomadas con números nominales. Inflación, estacionalidad y contexto macro erosionan gasto público y capacidad de pago privada; el fenómeno es el mismo, solo cambia dónde impacta.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid: motor en práctica */}
      <section className="w-full max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold text-slate-100 mb-8">El motor en práctica</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Landmark, title: "Finanzas Públicas", desc: "Ejecución presupuestaria oficial. Versionamos cada publicación para trazabilidad histórica.", color: "text-blue-400" },
            { icon: TrendingUp, title: "Ajuste por Inflación", desc: "Cruzamos cada partida con índices de precios para revelar el verdadero poder de compra.", color: "text-red-400" },
            { icon: CalendarClock, title: "Estacionalidad", desc: "Detectamos picos de calendario para no confundir ciclos normales con ahorros o gastos excepcionales.", color: "text-amber-400" },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
            <div key={i} className="group p-8 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-emerald-500/30 transition-all hover:bg-slate-900/50">
              <Icon className={`w-10 h-10 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-bold text-slate-200 mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          );
          })}
        </div>
      </section>

      {/* Principio operativo */}
      <section className="w-full bg-slate-900/50 border-y border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-slate-100">Principio operativo</h2>
            <p className="text-slate-400 text-lg">
              No operamos en tiempo real porque el gasto público no es instantáneo. Operamos por <span className="text-emerald-400 font-semibold">eventos</span>.
            </p>
            <ul className="space-y-4 pt-4">
              {["Observar publicaciones oficiales", "Versionar cada estado del dato", "Comparar contra estados anteriores", "Recalcular el impacto económico"].map((step, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300">
                  <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-emerald-500 border border-slate-700">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center items-center text-center">
              <Search className="w-8 h-8 text-emerald-500 mb-2" />
              <h4 className="font-bold text-slate-200">Auditables</h4>
              <p className="text-xs text-slate-500 mt-1">Datos 100% oficiales</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center items-center text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
              <h4 className="font-bold text-slate-200">Reproducibles</h4>
              <p className="text-xs text-slate-500 mt-1">Sin cajas negras</p>
            </div>
            <div className="col-span-2 p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center items-center text-center">
              <Activity className="w-8 h-8 text-emerald-500 mb-2" />
              <h4 className="font-bold text-slate-200">Análisis Económico, No Político</h4>
              <p className="text-xs text-slate-500 mt-1">No emitimos juicios de valor, solo medimos impacto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué NO hace */}
      <section className="w-full max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold text-slate-100 mb-6">Qué NO hace</h2>
        <p className="text-slate-400 mb-4">El proyecto no emite juicios de valor. No responde si el gasto está bien o mal, si es eficiente o ineficiente, si hay corrupción, ni si el impacto social es positivo o negativo. No recomienda políticas públicas, no predice el futuro, no acusa ni justifica decisiones.</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            "No evalúa eficiencia política",
            "No predice default individual",
            "No acusa corrupción",
            "No reemplaza análisis humano",
            "No promete tiempo real",
          ].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-sm">
              <Ban className="w-4 h-4 text-slate-500 shrink-0" />
              {item}
            </span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Límite conceptual: este proyecto no evalúa decisiones políticas; evalúa cómo cambia el poder de compra del gasto en el tiempo. La decisión final siempre es externa.</p>
      </section>

      {/* Límites, riesgos y supuestos */}
      <section id="limits" className="w-full max-w-7xl px-6 py-24 scroll-mt-20 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-slate-100 mb-6">Límites, riesgos y supuestos</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Límites del proyecto</h3>
            <p className="text-slate-400 text-sm">El proyecto pierde valor cuando la inflación es baja y estable por largos períodos, cuando los datos públicos son discontinuos o poco confiables, o cuando se pretende usarlo para juzgar impacto social o político.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Supuestos económicos</h3>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• El índice de inflación elegido es una aproximación válida.</li>
              <li>• El gasto puede compararse en términos reales aunque su composición cambie.</li>
              <li>• La estacionalidad histórica es relevante para interpretar el presente.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Interpretaciones incorrectas</h3>
            <p className="text-slate-400 text-sm">Sería incorrecto usar el sistema para acusar corrupción, afirmar eficiencia o ineficiencia final, o comparar impacto social entre programas distintos. El proyecto no reemplaza análisis cualitativos; los precede y los ordena.</p>
          </div>
        </div>
      </section>

      {/* Definición y API */}
      <section id="api" className="w-full max-w-7xl px-6 py-24 scroll-mt-20">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">Definición del proyecto</h2>
        <p className="text-slate-400 mb-2">Un sistema que traduce el gasto público nominal en impacto económico real, ajustado por inflación y estacionalidad, usando solo datos públicos.</p>
        <p className="text-slate-500 text-sm mb-8 italic">No es solo un dashboard: cruza variables que se leen separadas, produce comparaciones que no existen de forma estándar, revela cambios reales donde antes había ilusión nominal. Puede exponerse como API porque las respuestas dependen del estado económico actualizado del dato, no del “ahora”.</p>
        <h3 className="text-xl font-bold text-slate-200 mb-4">API</h3>
        <p className="text-slate-400 mb-6">Contrato de señales para integración. Datos públicos, reproducibles, no sensibles.</p>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 font-mono text-sm">
            <p className="text-emerald-400">GET /api/signals/real-spend</p>
            <p className="text-slate-500 mt-2">Query: programId, periodFrom, periodTo (YYYY-MM). Devuelve {`{ programs, series, meta }`}. Serie de impacto real vs nominal por programa. Producción: Presupuesto Abierto + IPC INDEC.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 font-mono text-sm">
            <p className="text-amber-400">GET /api/signals/sector-risk</p>
            <p className="text-slate-500 mt-2">Devuelve {`{ signals: SectorRiskSignal[], meta }`}. Vista B: presión económica agregada por sector. Producción: INDEC, BCRA, datos agregados.</p>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-7xl px-6 py-12 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm border-t border-slate-800 mt-12">
        <p>&copy; 2026 Economic Signal Engine — RealSpend. Open Data.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-emerald-500 transition-colors">GitHub</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Fuentes de datos</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Licencia</a>
        </div>
      </footer>
    </div>
  );
}
