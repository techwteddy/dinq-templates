# Fase 2 — Tracking & Nutrición

Implementación completa del flujo de tracking diario, conforme a `phase-2-tracking.md` y `context-general.md`.

---

## Archivos creados / modificados

```
phase2/
├── .env.example
├── supabase/
│   └── migrations/
│       └── 002_phase2_tracking.sql          ← DDL completo de la fase
│
├── src/
│   ├── types/
│   │   └── nutrition.ts                     ← Todos los tipos de dominio
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── server.ts                    ← Cliente Supabase (server)
│   │   │
│   │   ├── fdc/
│   │   │   ├── client.ts                    ← HTTP client FDC (search + detail)
│   │   │   └── normalize.ts                 ← Mapeo FDC → Nutrients100g
│   │   │
│   │   └── nutrition/
│   │       ├── food-repository.ts              ← Búsqueda + caché FDC
│   │       ├── recipes.ts                   ← CRUD recetas + cálculo totales
│   │       ├── meal-logs.ts                 ← Registro de comidas con snapshot
│   │       ├── day-summary.ts               ← Agregación diaria
│   │       ├── frequent-meals.ts            ← Detección de hábitos
│   │       └── confidence.ts               ← Reglas de nivel de confianza
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── foods/
│   │   │   │   ├── search/route.ts          ← GET ?q=
│   │   │   │   └── [id]/route.ts            ← GET por fdcId o UUID
│   │   │   ├── meal-logs/
│   │   │   │   ├── route.ts                 ← GET ?date= · POST
│   │   │   │   └── [id]/route.ts            ← PATCH · DELETE
│   │   │   ├── recipes/
│   │   │   │   ├── route.ts                 ← GET · POST
│   │   │   │   └── [id]/route.ts            ← GET · PATCH · DELETE
│   │   │   ├── day-summary/
│   │   │   │   └── [date]/route.ts          ← GET · POST (recompute)
│   │   │   └── habits/
│   │   │       ├── route.ts                 ← GET · POST (detect)
│   │   │       └── [id]/apply/route.ts      ← POST (apply to date)
│   │   │
│   │   └── (app)/
│   │       ├── diary/page.tsx               ← Pantalla del día
│   │       └── recipes/page.tsx             ← Lista + creador de recetas
│   │
│   └── components/
│       └── nutrition/
│           ├── FoodSearch.tsx               ← Input con debounce + resultados
│           ├── AddMealLogModal.tsx           ← Modal 3 pasos para agregar comida
│           ├── DayView.tsx                  ← Vista diaria completa
│           ├── ConfidenceDot.tsx            ← Indicador visual de confianza
│           ├── FrequentMeals.tsx            ← Chips de hábitos frecuentes
│           └── RecipeBuilder.tsx            ← Formulario de recetas
```

---

## Cómo ejecutar la migración

```bash
# Con Supabase CLI
supabase db push

# O pegar el contenido de 002_phase2_tracking.sql directamente
# en el SQL Editor de Supabase Dashboard
```

---

## Flujo de datos central

```
Usuario escribe alimento
  → GET /api/foods/search?q=pollo
    → Busca en foods_master (full-text)
    → Si no hay suficientes → llama FDC POST /foods/search
    → Normaliza nutrientes por 100g → upsert en foods_master
    → Retorna lista

Usuario selecciona + indica gramos
  → POST /api/meal-logs
    → Lee food de foods_master
    → Calcula snapshot (kcal, macros) = nutrients_per_100g × grams/100
    → Asigna confidence level
    → Guarda en meal_logs
    → Background: recomputa day_summary + detecta habits

GET /api/day-summary/YYYY-MM-DD
  → Agrega todos los meal_logs del día
  → Calcula flag de fiabilidad (% kcal de entradas HIGH/MEDIUM)
  → Upsert en day_summary
```

---

## Reglas de confianza

| Nivel  | Criterio                                              |
|--------|-------------------------------------------------------|
| HIGH   | Fuente FDC + nutrientes completos                     |
| MEDIUM | Receta con datos completos o alimento manual completo |
| LOW    | Estimaciones o datos incompletos                      |

**Fiabilidad del día:**
- `RELIABLE`   ≥ 75% de kcal con confianza HIGH o MEDIUM
- `PARTIAL`    40–74%
- `UNRELIABLE` < 40%

---

## Dependencias npm necesarias

```bash
npm install @supabase/supabase-js
```

El resto usa únicamente APIs de Next.js (App Router) y TypeScript.

---

## Criterios de salida de Fase 2 ✓

- [x] Búsqueda de alimentos FDC → cacheados en `foods_master`
- [x] Registro de comidas por gramos con snapshot de nutrientes
- [x] Recetas compuestas con cálculo de totales por porción
- [x] Detección y aplicación con un toque de comidas frecuentes
- [x] Resúmenes diarios con flag de fiabilidad
- [x] Niveles de confianza por registro y bandera en el día
