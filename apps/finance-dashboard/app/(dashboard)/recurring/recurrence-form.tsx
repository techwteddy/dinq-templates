"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/currency-input";
import { toIsoDate } from "@/lib/utils";
import { RECURRENCE_FREQ_LABELS } from "@/lib/constants";
import {
  updateRecurrence,
  createRecurrence,
  type RecurrenceInput,
} from "@/lib/actions/recurrences";
import type { Account, Category, Recurrence, RecurrenceFreq, TransactionType } from "@/types/database";
import { Pencil, Plus } from "lucide-react";

type Mode = "create" | "edit";

type Props = {
  categories: Category[];
  accounts: Account[];
  mode?: Mode;
  recurrence?: Recurrence;
};

const FREQUENCIES = (Object.keys(RECURRENCE_FREQ_LABELS) as RecurrenceFreq[]).map((value) => ({
  value,
  label: RECURRENCE_FREQ_LABELS[value],
}));

function todayIso(): string {
  return toIsoDate(new Date());
}

export function RecurrenceForm({ categories, accounts, mode = "create", recurrence }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [description, setDescription] = useState(recurrence?.description ?? "");
  const [type, setType] = useState<TransactionType>(recurrence?.type ?? "expense");
  const [amount, setAmount] = useState<number>(Number(recurrence?.amount ?? 0));
  const [categoryId, setCategoryId] = useState<string>(recurrence?.category_id ?? "");
  const [accountId, setAccountId] = useState<string>(recurrence?.account_id ?? "");
  const [frequency, setFrequency] = useState<RecurrenceFreq>(recurrence?.frequency ?? "monthly");
  const [dueDay, setDueDay] = useState<string>(String(recurrence?.due_day ?? 1));
  const [startDate, setStartDate] = useState(recurrence?.start_date ?? todayIso());
  const [endDate, setEndDate] = useState(recurrence?.end_date ?? "");
  const [active, setActive] = useState(recurrence?.active ?? true);

  const filteredCategories = categories.filter((c) => c.type === type);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: RecurrenceInput = {
      description,
      type,
      amount,
      category_id: categoryId || null,
      account_id: accountId || null,
      frequency,
      due_day: Number(dueDay) || 1,
      start_date: startDate,
      end_date: endDate || null,
      active,
      next_run: recurrence?.next_run ?? startDate,
    };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createRecurrence(payload)
          : await updateRecurrence(recurrence!.id, payload);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "Recurrence created." : "Recurrence updated.");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button size="icon" variant="ghost">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" /> New recurrence
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New recurrence" : "Edit recurrence"}</DialogTitle>
          <DialogDescription>
            Register fixed transactions (subscriptions, rent, salaries) and generate transactions when they are due.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <CurrencyInput id="amount" value={amount} onChange={setAmount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurrenceFreq)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day">Due day</Label>
              <Input
                id="day"
                type="number"
                min={1}
                max={31}
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End (optional)</Label>
              <Input id="end" type="date" value={endDate ?? ""} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="active" className="cursor-pointer text-sm">
              Active
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !description || amount <= 0}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
