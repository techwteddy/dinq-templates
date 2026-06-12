import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountForm } from "./account-form";
import { getAccounts, getAccountBalance } from "@/lib/queries/dashboard";
import { formatCurrency } from "@/lib/utils";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants";
import { KpiCard } from "@/components/kpi-card";
import { Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = await getAccounts();
  const balances = await Promise.all(accounts.map((c) => getAccountBalance(c.id).then((s) => [c.id, s] as const)));
  const balanceMap = new Map(balances);
  const totalBalance = Array.from(balanceMap.values()).reduce((acc, s) => acc + Number(s), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <p className="text-sm text-muted-foreground">Register banks, cards and cash. Balance is calculated automatically.</p>
        </div>
        <AccountForm />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard label="Total balance" value={totalBalance} icon={Wallet} tone={totalBalance >= 0 ? "default" : "destructive"} />
        <KpiCard label="Active accounts" value={String(accounts.filter((c) => c.active).length)} icon={Wallet} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No accounts yet</CardTitle>
              <CardDescription>Click &quot;New account&quot; above to get started.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          accounts.map((c) => {
            const balance = Number(balanceMap.get(c.id) ?? 0);
            return (
              <Card key={c.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{c.name}</CardTitle>
                    <CardDescription>
                      {ACCOUNT_TYPE_LABELS[c.type] ?? c.type}
                      {c.bank ? ` • ${c.bank}` : ""}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {!c.active && <Badge variant="outline">Inactive</Badge>}
                    <AccountForm mode="edit" account={c} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Current balance</div>
                  <div className={`text-2xl font-semibold tabular-nums ${balance < 0 ? "text-destructive" : "text-foreground"}`}>
                    {formatCurrency(balance)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Initial: {formatCurrency(Number(c.initial_balance))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
