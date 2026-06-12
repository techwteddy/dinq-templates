import type { AccountType, RecurrenceFreq, TransactionStatus } from "@/types/database";

// App-wide display config. Override via env to localize without touching code.
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Finance Dashboard";
export const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "en-US";
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "USD";

export const PAYMENT_METHODS = [
  "cash",
  "debit_card",
  "credit_card",
  "bank_transfer",
  "check",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  debit_card: "Debit card",
  credit_card: "Credit card",
  bank_transfer: "Bank transfer",
  check: "Check",
  other: "Other",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  credit_card: "Credit card",
  cash: "Cash",
  investment: "Investment",
};

export const RECURRENCE_FREQ_LABELS: Record<RecurrenceFreq, string> = {
  monthly: "Monthly",
  bimonthly: "Bimonthly",
  quarterly: "Quarterly",
  semiannual: "Semiannual",
  annual: "Annual",
};

// Months added per cycle, used to compute the next run date of a recurrence.
export const RECURRENCE_FREQ_MONTHS: Record<RecurrenceFreq, number> = {
  monthly: 1,
  bimonthly: 2,
  quarterly: 3,
  semiannual: 6,
  annual: 12,
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  scheduled: "Scheduled",
};
