import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CashflowChart } from "@/components/cashflow-chart";
import { KpiCard } from "@/components/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCashflowProjection, getTransactions } from "@/lib/queries/dashboard";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, toIsoDate } from "@/lib/utils";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { TransactionView } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function CashFlowPage() {
  const supabase = await createClient();
  const [cashflow, futureIncome, futureExpenses, { data: balance }] = await Promise.all([
    getCashflowProjection(90),
    getTransactions("income"),
    getTransactions("expense"),
    supabase.rpc("fn_total_balance"),
  ]);

  const currentBalance = Number(balance ?? 0);
  const totalInflow = cashflow.reduce((a, d) => a + Number(d.inflow), 0);
  const totalOutflow = cashflow.reduce((a, d) => a + Number(d.outflow), 0);
  const projectedBalance90d = currentBalance + totalInflow - totalOutflow;

  const today = toIsoDate(new Date());
  const upcoming = [...futureIncome, ...futureExpenses]
    .filter((t: TransactionView) => t.payment_date === null && t.due_date >= today)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 30);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Cash flow</h1>
        <p className="text-sm text-muted-foreground">Next 90 days projection based on transactions with a due date.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Current balance" value={currentBalance} icon={Wallet} />
        <KpiCard label="Expected inflow (90d)" value={totalInflow} icon={TrendingUp} tone="success" />
        <KpiCard label="Expected outflow (90d)" value={totalOutflow} icon={TrendingDown} tone="destructive" />
        <KpiCard
          label="Projected balance"
          value={projectedBalance90d}
          icon={Wallet}
          tone={projectedBalance90d >= 0 ? "success" : "destructive"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>90-day projection</CardTitle>
          <CardDescription>Daily inflow and outflow with a running balance line.</CardDescription>
        </CardHeader>
        <CardContent>
          <CashflowChart data={cashflow} initialBalance={currentBalance} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming transactions</CardTitle>
          <CardDescription>Up to 30 items due from today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.length === 0 ? (
                <TableEmpty colSpan={5}>No open future transactions.</TableEmpty>
              ) : (
                upcoming.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">{formatDate(t.due_date)}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell className="text-muted-foreground capitalize">{t.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${t.type === "income" ? "text-success" : "text-destructive"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
