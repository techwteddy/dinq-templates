import { Suspense } from "react";
import { TransactionsTable } from "@/components/transactions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, getAccounts, getTransactions } from "@/lib/queries/dashboard";

export const dynamic = "force-dynamic";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <p className="text-sm text-muted-foreground">Expected and realized outflows.</p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ExpensesTable />
      </Suspense>
    </div>
  );
}

async function ExpensesTable() {
  const [transactions, categories, accounts] = await Promise.all([
    getTransactions("expense"),
    getCategories("expense"),
    getAccounts(true),
  ]);
  return <TransactionsTable type="expense" transactions={transactions} categories={categories} accounts={accounts} />;
}
