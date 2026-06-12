import { Suspense } from "react";
import { TrendingUp, TrendingDown, Wallet, Gauge, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { KpiCard } from "@/components/kpi-card";
import { RevenueExpenseChart } from "@/components/revenue-expense-chart";
import { PeriodSelector } from "@/components/period-selector";
import { getOverviewHeader, getOverviewPending } from "@/lib/queries/dashboard";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PERIODS = [3, 6, 12, 24] as const;
type Period = (typeof PERIODS)[number];

function parsePeriod(raw: string | undefined): Period {
  const n = Number(raw);
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 12;
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period } = await searchParams;
  const months = parsePeriod(period);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">Your financial snapshot for the current month.</p>
      </header>

      <Suspense fallback={<HeaderSkeleton months={months} />}>
        <HeaderSection months={months} />
      </Suspense>

      <Suspense fallback={<PendingSkeleton />}>
        <PendingSection />
      </Suspense>
    </div>
  );
}

async function HeaderSection({ months }: { months: number }) {
  const { kpisMonth, totalBalance, runwayMonths, monthsSeries } = await getOverviewHeader({ months });

  const incomeMonth = Number(kpisMonth?.income_paid ?? 0);
  const expenseMonth = Number(kpisMonth?.expense_paid ?? 0);
  const pendingIncome = Number(kpisMonth?.income_pending ?? 0);
  const pendingExpense = Number(kpisMonth?.expense_pending ?? 0);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total balance" value={totalBalance} icon={Wallet} tone={totalBalance >= 0 ? "default" : "destructive"} />
        <KpiCard label="Income this month" value={incomeMonth} icon={TrendingUp} tone="success" hint={`Receivable: ${formatCurrency(pendingIncome)}`} />
        <KpiCard label="Expenses this month" value={expenseMonth} icon={TrendingDown} tone="destructive" hint={`Payable: ${formatCurrency(pendingExpense)}`} />
        <KpiCard
          label="Estimated runway"
          value={runwayMonths != null ? `${runwayMonths} months` : "no baseline"}
          icon={Gauge}
          hint="Based on the 3-month average"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Income vs Expenses ({months} months)</CardTitle>
            <CardDescription>Only values with a recorded payment.</CardDescription>
          </div>
          <PeriodSelector current={months} />
        </CardHeader>
        <CardContent>
          <RevenueExpenseChart data={monthsSeries} />
        </CardContent>
      </Card>
    </>
  );
}

async function PendingSection() {
  const { upcoming, overdue } = await getOverviewPending();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="flex-1">Due soon (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.length === 0 ? (
                <TableEmpty colSpan={3}>Nothing in the next 7 days.</TableEmpty>
              ) : (
                upcoming.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(t.due_date)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(t.amount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <CardTitle className="flex-1">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdue.length === 0 ? (
                <TableEmpty colSpan={3}>No overdue items.</TableEmpty>
              ) : (
                overdue.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(t.amount)}</TableCell>
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

function HeaderSkeleton({ months }: { months: number }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses ({months} months)</CardTitle>
          <CardDescription>Loading monthly series...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </>
  );
}

function PendingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
