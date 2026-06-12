"use client";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, parseDateLocal } from "@/lib/utils";
import { LOCALE } from "@/lib/constants";
import type { KpisMonth } from "@/types/database";

type Row = { month: string; income: number; expense: number };

function toLabel(iso: string): string {
  const d = parseDateLocal(iso);
  return new Intl.DateTimeFormat(LOCALE, { month: "short", year: "2-digit" }).format(d).replace(".", "");
}

export function RevenueExpenseChartImpl({ data }: { data: KpisMonth[] }) {
  const rows: Row[] = data.map((m) => ({
    month: toLabel(m.month),
    income: Number(m.income_paid ?? 0),
    expense: Number(m.expense_paid ?? 0),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="var(--muted-foreground)"
            tickFormatter={(v) => new Intl.NumberFormat(LOCALE, { notation: "compact" }).format(Number(v))}
          />
          <Tooltip
            formatter={(v) => formatCurrency(Number(v))}
            contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Income paid" fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Expense paid" fill="#DC2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
