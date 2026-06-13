/**
 * src/lib/export.ts
 * Generación de archivos de exportación CSV y JSON
 */

import { format } from 'date-fns';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ExportEntry {
  date: string;
  meal: string;
  food: string;
  amount_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
}

export interface ExportDaySummary {
  date: string;
  total_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  is_reliable: boolean;
  goal_kcal: number;
  entries: ExportEntry[];
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

const CSV_ENTRY_HEADERS = [
  'Fecha', 'Comida', 'Alimento', 'Cantidad (g)',
  'Calorías', 'Proteínas (g)', 'Carbos (g)', 'Grasas (g)', 'Fibra (g)',
];

function escapeCsv(val: string | number | undefined): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCSV(days: ExportDaySummary[]): string {
  const rows: string[] = [CSV_ENTRY_HEADERS.join(',')];

  for (const day of days) {
    for (const entry of day.entries) {
      rows.push([
        escapeCsv(day.date),
        escapeCsv(entry.meal),
        escapeCsv(entry.food),
        escapeCsv(entry.amount_g),
        escapeCsv(entry.kcal),
        escapeCsv(entry.protein_g),
        escapeCsv(entry.carbs_g),
        escapeCsv(entry.fat_g),
        escapeCsv(entry.fiber_g ?? 0),
      ].join(','));
    }

    // Fila de resumen diario
    rows.push([
      escapeCsv(day.date),
      escapeCsv('RESUMEN'),
      escapeCsv(`Meta: ${day.goal_kcal} kcal | Fiable: ${day.is_reliable ? 'Sí' : 'No'}`),
      '', // amount
      escapeCsv(day.total_kcal),
      escapeCsv(day.total_protein_g),
      escapeCsv(day.total_carbs_g),
      escapeCsv(day.total_fat_g),
      escapeCsv(day.total_fiber_g),
    ].join(','));

    rows.push(''); // separador entre días
  }

  return rows.join('\r\n');
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

export interface ExportJSON {
  exported_at: string;
  range: { from: string; to: string };
  days: ExportDaySummary[];
}

export function buildJSON(
  days: ExportDaySummary[],
  from: string,
  to: string
): ExportJSON {
  return {
    exported_at: new Date().toISOString(),
    range: { from, to },
    days,
  };
}

// ─── Filename helpers ─────────────────────────────────────────────────────────

export function exportFilename(from: string, to: string, ext: 'csv' | 'json'): string {
  const f = from.replace(/-/g, '');
  const t = to.replace(/-/g, '');
  return `nutricion_${f}_${t}.${ext}`;
}
