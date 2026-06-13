# Fase 3 — Implementación completa

## Archivos creados / modificados

### Base de datos
| Archivo | Descripción |
|---|---|
| `supabase/migrations/20240301_000000_phase3_barcode_analytics.sql` | Amplía `foods_master` con `source`, `barcode`, `off_raw`; crea `weight_logs`; vista `v_week_analytics`; función `export_diary()` |

### Librerías internas
| Archivo | Descripción |
|---|---|
| `src/lib/off-client.ts` | Cliente Open Food Facts: fetch por barcode, normalización, niveles de confianza |
| `src/lib/analytics.ts` | Cálculo de `WeekAnalytics`, `MonthAnalytics`, `DRIEntry`. Compatibles con el sistema de confianza de Fase 2 |
| `src/lib/export.ts` | Generación de CSV y JSON para exportaciones |

### API Routes
| Ruta | Método(s) | Descripción |
|---|---|---|
| `/api/off/[barcode]` | GET, POST | Lookup OFF + upsert en `foods_master`; POST para override manual |
| `/api/analytics/week` | GET | Devuelve `WeekAnalytics` para la semana de `?date=` |
| `/api/analytics/month` | GET | Devuelve `MonthAnalytics` para el mes de `?date=` |
| `/api/export` | GET | Genera y descarga CSV o JSON para `?from=&to=&format=` |
| `/api/weight-logs/batch` | GET, POST, PATCH | Gestión de registros de peso |
| `/api/profile` | GET, PATCH | Perfil de usuario + `onboarding_completed` |

### Componentes
| Archivo | Descripción |
|---|---|
| `src/components/barcode/BarcodeScanner.tsx` | Escáner de cámara con ZXing, linterna, animación de línea |
| `src/components/barcode/BarcodeFlow.tsx` | Flujo completo: botón → escáner → resultado OFF → override → añadir al diario |
| `src/components/analytics/WeekChart.tsx` | Gráfico semanal: calorías vs meta, macros, DRI |
| `src/components/analytics/MonthChart.tsx` | Gráfico mensual: tendencia de calorías + línea de peso + adherencia |
| `src/components/export/ExportPanel.tsx` | Panel de exportación con presets, selector de fechas y formato |
| `src/components/onboarding/OnboardingFlow.tsx` | 4 pasos: bienvenida, filosofía, funciones, peso histórico opcional |

### Páginas
| Ruta | Archivo |
|---|---|
| `/analytics` | `src/app/(app)/analytics/page.tsx` |
| `/settings/export` | `src/app/(app)/settings/export/page.tsx` |
| `/onboarding` | `src/app/onboarding/page.tsx` |

---

## Instalación de dependencias nuevas

```bash
# Barcode scanner
npm install @zxing/browser @zxing/library

# date-fns (si no está ya instalado)
npm install date-fns

# recharts (si no está ya instalado)
npm install recharts
```

---

## Setup de la migración

```bash
# Aplicar la migración con Supabase CLI
supabase db push
# o directamente:
supabase migration up
```

---

## Variables de entorno

No se añaden nuevas variables. Open Food Facts es una API pública sin key.

---

## Integración con Fase 2

### Sistema de confianza
`off-client.ts` → `calcConfidence()` devuelve niveles 1-5 compatibles con el campo `confidence_level` de `foods_master` definido en Fase 2:

| Nivel | Criterio OFF |
|---|---|
| 4 | completeness ≥ 80% y macros completos |
| 3 | completeness ≥ 60% y macros completos |
| 2 | completeness ≥ 40% |
| 1 | datos insuficientes |

Cuando el usuario hace un **override manual** → nivel sube automáticamente a 4.

### Tabla `foods_master`
Se añaden 3 columnas sin tocar las existentes:
- `source TEXT DEFAULT 'FDC'` — diferencia FDC / OFF / CUSTOM
- `barcode TEXT` — código EAN/UPC
- `off_raw JSONB` — payload original de OFF para auditoría

El índice único `(barcode, source)` evita duplicados.

---

## Flujo de escáner end-to-end

```
Usuario toca "Escanear producto"
  → BarcodeScanner abre cámara (getUserMedia)
  → ZXing detecta EAN/UPC
  → BarcodeFlow llama GET /api/off/[barcode]
      → API busca en foods_master (caché)
      → Si no: consulta OFF, normaliza, upsert en foods_master
  → BarcodeFlow muestra resultado con nivel de confianza
  → Si datos incompletos: usuario puede hacer override (POST /api/off/[barcode])
  → Usuario confirma cantidad en gramos
  → onConfirm() recibe { product, amountG } para añadir al diary
```

---

## Notas y consideraciones

- **Permisos de cámara**: `BarcodeScanner` solicita `facingMode: 'environment'` para la cámara trasera en móvil. En desktop usará la webcam disponible.
- **Linterna**: `track.applyConstraints({ advanced: [{ torch }] })` funciona en Chrome/Android; en iOS Safari es limitado.
- **ZXing**: soporta EAN-8, EAN-13, UPC-A, UPC-E, Code 128, QR y más. Para productos alimentarios, EAN-13 es el más común.
- **OFF rate limiting**: la API es pública pero pide identificación via `User-Agent`. El caché en `foods_master` reduce las llamadas repetidas.
- **Exportación**: el endpoint genera el archivo en streaming. Para rangos muy grandes (>1 año) considerar paginar o mover a un Supabase Edge Function con timeout ampliado.
- **onboarding_completed**: añadir este campo a la tabla `profiles` si no existe: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;`
