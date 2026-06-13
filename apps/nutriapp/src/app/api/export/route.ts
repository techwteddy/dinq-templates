import { NextRequest, NextResponse } from "next/server";
import { buildCSV, buildJSON, exportFilename, type ExportDaySummary } from "@/lib/export";
import { getDaySummariesRange } from "@/db/queries/day-summary";
import { getMealLogsByDate } from "@/db/queries/meal-logs";
import { getTargetCalories } from "@/lib/profile-targets";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const format = (params.get("format") ?? "json") as "csv" | "json";
  if (!from || !to) {
    return NextResponse.json({ error: "Parámetros from y to requeridos" }, { status: 400 });
  }

  const [summaries, goal] = await Promise.all([
    getDaySummariesRange(from, to),
    getTargetCalories(),
  ]);
  const days: ExportDaySummary[] = await Promise.all(
    summaries.map(async (summary) => {
      const logs = await getMealLogsByDate(summary.summary_date);
      return {
        date: summary.summary_date,
        total_kcal: summary.total_kcal,
        total_protein_g: summary.total_protein_g,
        total_carbs_g: summary.total_carbs_g,
        total_fat_g: summary.total_fat_g,
        total_fiber_g: summary.total_fiber_g,
        is_reliable: summary.reliability === "RELIABLE",
        goal_kcal: goal,
        entries: logs.map((log) => ({
          date: log.meal_date,
          meal: log.meal_type,
          food: log.food?.name ?? log.recipe?.name ?? "Alimento",
          amount_g: log.grams,
          kcal: log.kcal ?? 0,
          protein_g: log.protein_g ?? 0,
          carbs_g: log.carbs_g ?? 0,
          fat_g: log.fat_g ?? 0,
          fiber_g: log.fiber_g,
        })),
      };
    })
  );

  const filename = exportFilename(from, to, format);
  if (format === "csv") {
    return new NextResponse(buildCSV(days), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(buildJSON(days, from, to), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
