export interface ExportEntry {
  date: string;
  meal: string;
  food: string;
  amount_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number | null;
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

function csvCell(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildCSV(days: ExportDaySummary[]) {
  const rows = [
    ["date", "meal", "food", "amount_g", "kcal", "protein_g", "carbs_g", "fat_g", "fiber_g"],
    ...days.flatMap((day) =>
      day.entries.map((entry) => [
        entry.date,
        entry.meal,
        entry.food,
        entry.amount_g,
        entry.kcal,
        entry.protein_g,
        entry.carbs_g,
        entry.fat_g,
        entry.fiber_g ?? "",
      ])
    ),
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

export function buildJSON(days: ExportDaySummary[], from: string, to: string) {
  return { from, to, days };
}

export function exportFilename(from: string, to: string, format: "csv" | "json") {
  return `nutriapp-export-${from}-${to}.${format}`;
}
