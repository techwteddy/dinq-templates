"use client";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TransactionForm } from "@/components/transaction-form";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { unmarkPayment, markAsPaid } from "@/lib/actions/transactions";
import type { Account, Category, TransactionView } from "@/types/database";
import { Check, Undo2 } from "lucide-react";

type Props = {
  type: "income" | "expense";
  transactions: TransactionView[];
  categories: Category[];
  accounts: Account[];
};

export function TransactionsTable({ type, transactions, categories, accounts }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.description.toLowerCase().includes(q) ||
        (t.category_name ?? "").toLowerCase().includes(q) ||
        (t.account_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [transactions, search, statusFilter]);

  const total = filtered.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalPaid = filtered
    .filter((t) => t.status === "paid")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const totalPending = total - totalPaid;

  function onToggleStatus(t: TransactionView) {
    startTransition(async () => {
      const result =
        t.status === "paid" ? await unmarkPayment(t.id) : await markAsPaid(t.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t.status === "paid" ? "Marked as pending." : "Marked as paid.");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search by description, category, account..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <TransactionForm type={type} categories={categories} accounts={accounts} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <span className="text-muted-foreground">
          Total: <strong className="text-foreground">{formatCurrency(total)}</strong>
        </span>
        <span className="text-success">Paid: {formatCurrency(totalPaid)}</span>
        <span className="text-warning">Pending: {formatCurrency(totalPending)}</span>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableEmpty colSpan={7}>No transactions found.</TableEmpty>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="text-muted-foreground">{t.category_name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{t.account_name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(t.due_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={pending}
                        title={t.status === "paid" ? "Unmark paid" : "Mark as paid"}
                        onClick={() => onToggleStatus(t)}
                      >
                        {t.status === "paid" ? <Undo2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <TransactionForm
                        mode="edit"
                        type={type}
                        categories={categories}
                        accounts={accounts}
                        transaction={t}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
