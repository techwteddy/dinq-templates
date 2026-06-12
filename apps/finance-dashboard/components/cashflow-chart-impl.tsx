"use client";
import {
  Area,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { formatCurrency, parseDateLocal } from "@/lib/utils";
import { LOCALE } from "@/lib/constants";
import type { CashflowDay } from "@/types/database";

type Row = { day: string; inflow: number; outflow: number; cumulative: number };

function buildRows(data: CashflowDay[], initialBalance: number): Row[] {
  let acc = initialBalance;
  return data.map((d) => {
    acc += Number(d.inflow ?? 0) - Number(d.outflow ?? 0);
    return {
      day: new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "2-digit" }).format(parseDateLocal(d.day)),
      inflow: Number(d.inflow ?? 0),
      outflow: Number(d.outflow ?? 0),
      cumulative: acc,
    };
  });
}

export function CashflowChartImpl({ data, initialBalance = 0 }: { data: CashflowDay[]; initialBalance?: number }) {
  const rows = buildRows(data, initialBalance);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DC2626" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
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
          <Area type="monotone" dataKey="inflow" name="Inflow" stroke="#22C55E" fill="url(#inflow)" />
          <Area type="monotone" dataKey="outflow" name="Outflow" stroke="#DC2626" fill="url(#outflow)" />
          <Line type="monotone" dataKey="cumulative" name="Running balance" stroke="#18181b" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
