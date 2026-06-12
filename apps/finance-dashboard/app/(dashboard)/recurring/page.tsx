import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RecurrenceForm } from "./recurrence-form";
import { RowActions } from "./row-actions";
import { listRecurrences } from "@/lib/queries/recurrences";
import { getCategories, getAccounts } from "@/lib/queries/dashboard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RECURRENCE_FREQ_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function RecurringPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Recurring</h1>
          <p className="text-sm text-muted-foreground">
            Fixed transactions — subscriptions, rent, salaries. Click{" "}
            <span className="font-medium">Generate</span> to materialize the next transaction.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-9 w-40" />}>
          <RecurrenceFormLoader />
        </Suspense>
      </header>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <RecurringTableSection />
      </Suspense>
    </div>
  );
}

async function RecurrenceFormLoader() {
  const [categories, accounts] = await Promise.all([getCategories(), getAccounts(true)]);
  return <RecurrenceForm categories={categories} accounts={accounts} />;
}

async function RecurringTableSection() {
  const recurrences = await listRecurrences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered</CardTitle>
        <CardDescription>
          Active recurrences appear first, ordered by the next run date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next run</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recurrences.length === 0 ? (
              <TableEmpty colSpan={7}>No recurrences registered.</TableEmpty>
            ) : (
              recurrences.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.description}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{r.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {RECURRENCE_FREQ_LABELS[r.frequency] ?? r.frequency}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.next_run)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(r.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={r.active ? "success" : "outline"}>{r.active ? "Active" : "Paused"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions recurrence={r} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
