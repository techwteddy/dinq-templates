// Hand-written types. Replace with `supabase gen types typescript` once the project is connected.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type TransactionType = "income" | "expense";
export type TransactionStatus = "paid" | "pending" | "overdue" | "scheduled";
export type AccountType = "checking" | "savings" | "credit_card" | "cash" | "investment";
export type CategoryType = "income" | "expense";
export type RecurrenceFreq = "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual";
export type UserRole = "admin" | "member" | "viewer";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  mfa_enrolled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string | null;
  icon: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  name: string;
  bank: string | null;
  type: AccountType;
  initial_balance: number;
  currency: string;
  active: boolean;
  color: string | null;
  last_digits: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  description: string;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  account_id: string | null;
  accrual_date: string;
  due_date: string;
  payment_date: string | null;
  payment_method: string | null;
  notes: string | null;
  attachment_url: string | null;
  recurrence_id: string | null;
  installment_current: number | null;
  installment_total: number | null;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionView extends Transaction {
  status: TransactionStatus;
  category_name: string | null;
  category_color: string | null;
  account_name: string | null;
  account_color: string | null;
}

export interface Recurrence {
  id: string;
  description: string;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  account_id: string | null;
  frequency: RecurrenceFreq;
  due_day: number;
  start_date: string;
  end_date: string | null;
  active: boolean;
  next_run: string;
  created_at: string;
  updated_at: string;
}

export interface KpisMonth {
  month: string;
  income_paid: number;
  expense_paid: number;
  income_pending: number;
  expense_pending: number;
  balance: number;
}

export interface CashflowDay {
  day: string;
  inflow: number;
  outflow: number;
  day_balance: number;
}

// Flatten forces TypeScript to treat interfaces as closed objects (satisfies Record<string, unknown>).
type Flatten<T> = { [K in keyof T]: T[K] };

// Helper for tables following postgrest-js' GenericTable contract.
type TableShape<Row, InsertRequired extends keyof Row = never> = {
  Row: Flatten<Row>;
  Insert: Flatten<Partial<Row> & Pick<Row, InsertRequired>>;
  Update: Flatten<Partial<Row>>;
  Relationships: [];
};

// Placeholder for the Supabase CLI generated types.
export type Database = {
  public: {
    Tables: {
      profiles: TableShape<Profile, "id" | "email">;
      categories: TableShape<Category, "name" | "type">;
      accounts: TableShape<Account, "name">;
      transactions: TableShape<Transaction, "description" | "type" | "amount" | "due_date">;
      allowed_emails: {
        Row: { id: string; email: string; role: UserRole; invited_by: string | null; created_at: string };
        Insert: { id?: string; email: string; role?: UserRole; invited_by?: string | null; created_at?: string };
        Update: { email?: string; role?: UserRole; invited_by?: string | null };
        Relationships: [];
      };
      recurrences: TableShape<Recurrence, "description" | "type" | "amount">;
      audit_log: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: {
      v_transactions: { Row: Flatten<TransactionView>; Relationships: [] };
    };
    Functions: {
      fn_account_balance: { Args: { p_account: string }; Returns: number };
      fn_kpis_month: { Args: { p_ref?: string }; Returns: KpisMonth[] };
      fn_kpis_series: { Args: { p_months?: number; p_ref?: string }; Returns: KpisMonth[] };
      fn_cashflow_projection: { Args: { p_days?: number }; Returns: CashflowDay[] };
      fn_total_balance: { Args: Record<string, never>; Returns: number };
    };
    Enums: {
      transaction_type: TransactionType;
      transaction_status: TransactionStatus;
      account_type: AccountType;
      category_type: CategoryType;
      user_role: UserRole;
      recurrence_freq: RecurrenceFreq;
    };
    CompositeTypes: Record<string, never>;
  };
};
