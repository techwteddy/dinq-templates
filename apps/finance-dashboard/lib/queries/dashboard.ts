import { createClient } from "@/lib/supabase/server";
import { toIsoDate } from "@/lib/utils";
import type { Account, CashflowDay, KpisMonth, TransactionStatus, TransactionView } from "@/types/database";

export type OverviewHeaderData = {
  kpisMonth: KpisMonth | null;
  totalBalance: number;
  runwayMonths: number | null;
  monthsSeries: KpisMonth[];
};

export type OverviewPendingData = {
  upcoming: TransactionView[];
  overdue: TransactionView[];
};

// KPIs + monthly series + balance. One RPC for the whole series (was N awaits before).
export async function getOverviewHeader({ months = 12 }: { months?: number } = {}): Promise<OverviewHeaderData> {
  const supabase = await createClient();

  const [seriesRes, balanceRes] = await Promise.all([
    supabase.rpc("fn_kpis_series", { p_months: months }),
    supabase.rpc("fn_total_balance"),
  ]);

  const monthsSeries = (seriesRes.data as KpisMonth[] | null) ?? [];
  const totalBalance = Number(balanceRes.data ?? 0);
  const kpisMonth = monthsSeries[monthsSeries.length - 1] ?? null;

  // Runway: current balance / average expense over the last 3 months.
  const last3 = monthsSeries.slice(-3);
  const avgExpense =
    last3.reduce((acc, m) => acc + Number(m.expense_paid ?? 0), 0) / Math.max(last3.length, 1);
  const runwayMonths = avgExpense > 0 ? Number((totalBalance / avgExpense).toFixed(1)) : null;

  return { kpisMonth, totalBalance, runwayMonths, monthsSeries };
}

// Lower tables: due soon + overdue. Fired in parallel.
export async function getOverviewPending(): Promise<OverviewPendingData> {
  const supabase = await createClient();

  const today = new Date();
  const in7days = new Date(today);
  in7days.setDate(in7days.getDate() + 7);
  const todayStr = toIsoDate(today);
  const in7daysStr = toIsoDate(in7days);

  const [upcomingRes, overdueRes] = await Promise.all([
    supabase
      .from("v_transactions")
      .select("*")
      .is("payment_date", null)
      .gte("due_date", todayStr)
      .lte("due_date", in7daysStr)
      .order("due_date", { ascending: true })
      .limit(10),
    supabase
      .from("v_transactions")
      .select("*")
      .is("payment_date", null)
      .lt("due_date", todayStr)
      .order("due_date", { ascending: true })
      .limit(10),
  ]);

  return {
    upcoming: (upcomingRes.data ?? []) as TransactionView[],
    overdue: (overdueRes.data ?? []) as TransactionView[],
  };
}

export async function getTransactions(
  type: "income" | "expense",
  filters?: { status?: string; category_id?: string; account_id?: string; from?: string; to?: string },
) {
  const supabase = await createClient();
  let q = supabase.from("v_transactions").select("*").eq("type", type);

  if (filters?.status) q = q.eq("status", filters.status as TransactionStatus);
  if (filters?.category_id) q = q.eq("category_id", filters.category_id);
  if (filters?.account_id) q = q.eq("account_id", filters.account_id);
  if (filters?.from) q = q.gte("due_date", filters.from);
  if (filters?.to) q = q.lte("due_date", filters.to);

  const { data, error } = await q.order("due_date", { ascending: false }).limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as TransactionView[];
}

export async function getCategories(type?: "income" | "expense") {
  const supabase = await createClient();
  let q = supabase.from("categories").select("*").order("name", { ascending: true });
  if (type) q = q.eq("type", type);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAccounts(onlyActive = false): Promise<Account[]> {
  const supabase = await createClient();
  let q = supabase.from("accounts").select("*").order("name", { ascending: true });
  if (onlyActive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Account[];
}

export async function getAccountBalance(accountId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("fn_account_balance", { p_account: accountId });
  return Number(data ?? 0);
}

export async function getCashflowProjection(days = 90): Promise<CashflowDay[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("fn_cashflow_projection", { p_days: days });
  return (data as CashflowDay[] | null) ?? [];
}
