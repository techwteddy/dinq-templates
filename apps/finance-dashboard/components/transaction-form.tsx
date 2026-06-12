"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CurrencyInput } from "@/components/currency-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  updateTransaction,
  createTransaction,
  deleteTransaction,
  type TransactionInput,
} from "@/lib/actions/transactions";
import { createRecurrence, type RecurrenceInput } from "@/lib/actions/recurrences";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, RECURRENCE_FREQ_LABELS, type PaymentMethod } from "@/lib/constants";
import type { Account, Category, RecurrenceFreq, TransactionView } from "@/types/database";
import { Plus, Pencil, Trash2 } from "lucide-react";

export type TransactionFormMode = "create" | "edit";

type Props = {
  type: "income" | "expense";
  categories: Category[];
  accounts: Account[];
  mode?: TransactionFormMode;
  transaction?: TransactionView;
  trigger?: React.ReactNode;
};

const FREQUENCIES = (Object.keys(RECURRENCE_FREQ_LABELS) as RecurrenceFreq[]).map((value) => ({
  value,
  label: RECURRENCE_FREQ_LABELS[value],
}));

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isPaymentMethod(v: string | null | undefined): v is PaymentMethod {
  return !!v && (PAYMENT_METHODS as readonly string[]).includes(v);
}

export function TransactionForm({ type, categories, accounts, mode = "create", transaction, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [description, setDescription] = useState(transaction?.description ?? "");
  const [amount, setAmount] = useState<number>(Number(transaction?.amount ?? 0));
  const [categoryId, setCategoryId] = useState<string>(transaction?.category_id ?? "");
  const [accountId, setAccountId] = useState<string>(transaction?.account_id ?? "");
  const [dueDate, setDueDate] = useState(transaction?.due_date ?? todayIso());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(
    isPaymentMethod(transaction?.payment_method) ? (transaction!.payment_method as PaymentMethod) : "",
  );
  const [notes, setNotes] = useState<string>(transaction?.notes ?? "");

  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFreq>("monthly");

  const dateLabel = type === "income" ? "Receipt date" : "Due date";
  const filteredCategories = categories.filter((c) => c.type === type);

  function reset() {
    setDescription("");
    setAmount(0);
    setCategoryId("");
    setAccountId("");
    setDueDate(todayIso());
    setPaymentMethod("");
    setNotes("");
    setIsRecurring(false);
    setFrequency("monthly");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: TransactionInput = {
      description,
      type,
      amount,
      category_id: categoryId || null,
      account_id: accountId || null,
      due_date: dueDate,
      payment_method: paymentMethod || null,
      notes: notes || null,
    };

    startTransition(async () => {
      if (mode === "edit") {
        const result = await updateTransaction(transaction!.id, payload);
        if ("error" in result && result.error) { toast.error(result.error); return; }
        toast.success("Transaction updated.");
      } else {
        const result = await createTransaction(payload);
        if ("error" in result && result.error) { toast.error(result.error); return; }

        if (isRecurring) {
          const dv = new Date(dueDate);
          const recPayload: RecurrenceInput = {
            description,
            type,
            amount,
            category_id: categoryId || null,
            account_id: accountId || null,
            frequency,
            due_day: dv.getDate(),
            start_date: dueDate,
            end_date: null,
            active: true,
            next_run: dueDate,
          };
          const recResult = await createRecurrence(recPayload, false);
          if ("error" in recResult && recResult.error) {
            toast.warning(`Transaction created, but recurrence failed: ${recResult.error}`);
          } else {
            toast.success("Transaction and recurrence created.");
          }
        } else {
          toast.success("Transaction created.");
        }
        reset();
      }
      setOpen(false);
    });
  }

  function onDelete() {
    if (!transaction) return;
    if (!confirm("Delete this transaction?")) return;
    startTransition(async () => {
      const result = await deleteTransaction(transaction.id);
      if ("error" in result && result.error) { toast.error(result.error); return; }
      toast.success("Transaction deleted.");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size={mode === "edit" ? "icon" : "default"} variant={mode === "edit" ? "ghost" : "default"}>
            {mode === "edit" ? <Pencil className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> New transaction</>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New" : "Edit"} {type}
          </DialogTitle>
          <DialogDescription>
            {type === "income" ? "Record an inflow." : "Record an outflow."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <CurrencyInput id="amount" value={amount} onChange={setAmount} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Payment method</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((f) => (
                    <SelectItem key={f} value={f}>{PAYMENT_METHOD_LABELS[f]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due">{dateLabel}</Label>
              <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>

          {mode === "create" && (
            <div className="space-y-3 rounded-md border p-3">
              <div className="flex items-center gap-2">
                <input
                  id="recurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="recurring" className="cursor-pointer text-sm">
                  Create as a recurrence
                </Label>
              </div>
              {isRecurring && (
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurrenceFreq)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            {mode === "edit" ? (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete} disabled={pending}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending || !description || amount <= 0}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
