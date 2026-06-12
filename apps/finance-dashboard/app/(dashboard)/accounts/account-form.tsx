"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CurrencyInput } from "@/components/currency-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateAccount, createAccount, deleteAccount, type AccountInput } from "@/lib/actions/accounts";
import { ACCOUNT_TYPE_LABELS, CURRENCY } from "@/lib/constants";
import type { Account, AccountType } from "@/types/database";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Props = {
  mode?: "create" | "edit";
  account?: Account;
};

const TYPES = (Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((value) => ({
  value,
  label: ACCOUNT_TYPE_LABELS[value],
}));

export function AccountForm({ mode = "create", account }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(account?.name ?? "");
  const [bank, setBank] = useState(account?.bank ?? "");
  const [type, setType] = useState<AccountType>((account?.type as AccountType) ?? "checking");
  const [initialBalance, setInitialBalance] = useState<number>(Number(account?.initial_balance ?? 0));
  const [notes, setNotes] = useState(account?.notes ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: AccountInput = {
      name,
      bank: bank || null,
      type,
      initial_balance: initialBalance,
      currency: account?.currency ?? CURRENCY,
      active: account?.active ?? true,
      notes: notes || null,
    };
    startTransition(async () => {
      const result = mode === "create" ? await createAccount(payload) : await updateAccount(account!.id, payload);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "Account created." : "Account updated.");
      setOpen(false);
    });
  }

  function onDelete() {
    if (!account) return;
    if (!confirm("Delete this account? Linked transactions will lose their reference.")) return;
    startTransition(async () => {
      const result = await deleteAccount(account.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Account deleted.");
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
            <Plus className="h-4 w-4" /> New account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New account" : "Edit account"}</DialogTitle>
          <DialogDescription>Bank details and initial balance.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bank">Bank</Label>
              <Input id="bank" value={bank ?? ""} onChange={(e) => setBank(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Initial balance</Label>
            <CurrencyInput id="balance" value={initialBalance} onChange={setInitialBalance} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
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
              <Button type="submit" disabled={pending || !name}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
