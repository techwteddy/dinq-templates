import { Badge } from "./badge";
import { TRANSACTION_STATUS_LABELS } from "@/lib/constants";
import type { TransactionStatus } from "@/types/database";

export function StatusBadge({ status }: { status: TransactionStatus | string }) {
  const s = status as TransactionStatus;
  const variant =
    s === "paid" ? "success" : s === "overdue" ? "destructive" : s === "scheduled" ? "secondary" : "warning";
  return <Badge variant={variant}>{TRANSACTION_STATUS_LABELS[s] ?? status}</Badge>;
}
