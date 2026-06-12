"use client";
import dynamic from "next/dynamic";
import type { KpisMonth } from "@/types/database";

const Impl = dynamic(
  () => import("./revenue-expense-chart-impl").then((m) => m.RevenueExpenseChartImpl),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full animate-pulse rounded-md bg-muted" />,
  },
);

export function RevenueExpenseChart({ data }: { data: KpisMonth[] }) {
  return <Impl data={data} />;
}
