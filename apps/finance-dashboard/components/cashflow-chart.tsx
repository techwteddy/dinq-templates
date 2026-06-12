"use client";
import dynamic from "next/dynamic";
import type { CashflowDay } from "@/types/database";

const Impl = dynamic(
  () => import("./cashflow-chart-impl").then((m) => m.CashflowChartImpl),
  {
    ssr: false,
    loading: () => <div className="h-80 w-full animate-pulse rounded-md bg-muted" />,
  },
);

export function CashflowChart({ data, initialBalance = 0 }: { data: CashflowDay[]; initialBalance?: number }) {
  return <Impl data={data} initialBalance={initialBalance} />;
}
