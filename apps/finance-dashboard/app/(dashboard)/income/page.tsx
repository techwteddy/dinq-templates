import { Suspense } from "react";
import { TransactionsTable } from "@/components/transactions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, getAccounts, getTransactions } from "@/lib/queries/dashboard";

export const dynamic = "force-dynamic";

export default function IncomePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Income</h1>
        <p className="text-sm text-muted-foreground">Expected and realized inflows.</p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <IncomeTable />
      </Suspense>
    </div>
  );
}

async function IncomeTable() {
  const [transactions, categories, accounts] = await Promise.all([
    getTransactions("income"),
    getCategories("income"),
    getAccounts(true),
  ]);
  return <TransactionsTable type="income" transactions={transactions} categories={categories} accounts={accounts} />;
}
