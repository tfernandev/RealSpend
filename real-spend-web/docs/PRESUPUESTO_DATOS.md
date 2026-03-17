# Presupuesto Abierto: datos abiertos y token API

## 1. URLs de datos abiertos (sin token)

Hay fuentes públicas con descarga directa. No reemplazan la API para ejecución mensual por programa, pero sirven para totales y series anuales por finalidad/función.

### 1.1 Datos.gob.ar — Presupuesto Administración Pública Nacional

**Dataset:** [Presupuesto de la Administración Pública Nacional](https://datos.gob.ar/dataset/sspre-presupuesto-administracion-publica-nacional)  
**Fuente:** Ministerio de Economía, Subsecretaría de Presupuesto. Licencia CC 4.0.

| Recurso | Descripción | Formato | URL de descarga |
|--------|-------------|---------|------------------|
| **Serie anual gastos, recursos y PIB** | Gastos, recursos y PIB por año | CSV | `https://dgsiaf-repo.mecon.gob.ar/repository/pa/datasets/serie_pib_anual.csv` |
| **Serie anual de gastos por finalidad y función** | Gastos por finalidad y función + PIB | CSV | `https://dgsiaf-repo.mecon.gob.ar/repository/pa/datasets/serie_finfun_anual.csv` |
| **Total Presupuesto y ejecución de gastos y recursos** | Totales presupuesto y ejecución | ZIP | `https://dgsiaf-repo.mecon.gob.ar/repository/pa/datasets/totales-de-presupuesto.zip` |
| **Clasificador Unidad Ejecutora** | Clasificador presupuestario | ZIP | `https://dgsiaf-repo.mecon.gob.ar/repository/pa/datasets/d-unidad-ejecutora.zip` |

- **serie_finfun_anual.csv** es el más útil para “programas” a nivel agregado: finalidad/función con montos anuales.
- **totales-de-presupuesto.zip** puede traer ejecución agregada; hay que inspeccionar el contenido.
- Frecuencia de actualización: eventual (no hay garantía de mensual).
- Página de referencia del dataset: https://www.presupuestoabierto.gob.ar/sici/datos-abiertos

### 1.2 Presupuesto Abierto — Datos abiertos (portal)

- **URL:** https://www.presupuestoabierto.gob.ar/sici/datos-abiertos  
- Listado por año; los archivos se descargan desde la misma web (no hay una URL única pública documentada para “ejecución mensual por programa” sin usar la API).
- Para **gastos por programa** (visualización): https://www.presupuestoabierto.gob.ar/sici/gastos-por-programa

### 1.3 Resumen para el pipeline

- **Sin token:** podés usar los CSV del repo DGSIAF (serie anual por finalidad/función y totales) para tener programas/finalidades y montos anuales. No hay URLs documentadas de ejecución **mensual** por programa sin API.
- **Con token:** la API de Presupuesto Abierto permite consultar ejecución y estructura programática de forma más granular y actualizada.

---

## 2. Paso a paso: conseguir token de la API Presupuesto Abierto

### 2.1 Dónde pedir el token

- **Página oficial de solicitud:** https://www.presupuestoabierto.gob.ar/sici/api-pac  
- **Documentación API:** https://presupuesto-abierto.argentina.apidocs.ar/  
- **Servidor de producción:** https://www.presupuestoabierto.gob.ar/api/v1  
- **Contacto / consultas:** https://www.presupuestoabierto.gob.ar/api/

### 2.2 Pasos recomendados

1. **Entrar a la página de solicitud**  
   Abrí en el navegador: https://www.presupuestoabierto.gob.ar/sici/api-pac

2. **Completar el formulario**  
   En esa página suele haber un formulario para pedir acceso a la API. Completá con:
   - Nombre y apellido (o nombre del proyecto/organización)
   - Correo electrónico
   - Uso previsto (ej.: “Proyecto RealSpend / Economic Signal Engine: análisis de impacto real del gasto público usando datos oficiales e IPC. Solo lectura, sin redistribución masiva de datos crudos.”)
   - Si piden URL del proyecto o repositorio, podés poner el repo de RealSpend o “en desarrollo”.

3. **Enviar y guardar**  
   Enviá el formulario. Guardá el mail de confirmación o número de solicitud si te lo dan.

4. **Esperar respuesta**  
   No hay SLA público. Si en 1–2 semanas no hay respuesta, contactar por la página de la API: https://www.presupuestoabierto.gob.ar/api/

5. **Recibir el token**  
   Te enviarán (por mail) un token de acceso. Ejemplo de uso:
   - Header: `Authorization: Bearer <token>`  
   - O según indiquen en la documentación (a veces es un query param `api_key=`).

6. **Configurarlo en el proyecto**  
   - Crear `.env.local` en la raíz de `real-spend-web` (ya está en `.gitignore`).
   - Variable: `PRESUPUESTO_ABIERTO_TOKEN=<el token que te dieron>`.
   - El cliente en `lib/data/presupuesto-abierto.ts` usa ese token en el header `Authorization: Bearer <token>`.

### 2.3 Cómo usar el token una vez que lo tengas

- En la documentación OpenAPI (presupuesto-abierto.argentina.apidocs.ar) revisá:
  - Endpoints de **gastos** o **ejecución** (por programa, período, etc.).
  - Si la autenticación es por header `Authorization: Bearer <token>` o por parámetro.
- En este repo, el siguiente paso será:
  - Crear un cliente en `lib/data/presupuesto-abierto.ts` que llame a `https://www.presupuestoabierto.gob.ar/api/v1/...` con el token.
  - Mapear la respuesta a `ProgramSummary[]` y a ítems con `period` (YYYY-MM) y `nominal_amount` por programa.
  - En `app/api/signals/real-spend/route.ts`: si existe `PRESUPUESTO_ABIERTO_TOKEN`, usar ese cliente; si no, seguir con el mock nominal como ahora.

---

## 3. Integración en RealSpend

| Origen | Qué da | Limitación |
|--------|--------|------------|
| **CSV datos.gob.ar (serie_finfun_anual, totales)** | Programas/finalidad-función y montos anuales | Anual, no mensual; URLs pueden ser inestables |
| **API Presupuesto Abierto (con token)** | Ejecución y estructura por programa, más granular y actualizada | Requiere solicitar y obtener token |

Recomendación: en paralelo, (1) probar descarga de `serie_finfun_anual.csv` o `totales-de-presupuesto.zip` para tener programas y montos reales a nivel anual; (2) solicitar el token y, cuando lo tengas, integrar la API para ejecución más detallada y actualizada.
