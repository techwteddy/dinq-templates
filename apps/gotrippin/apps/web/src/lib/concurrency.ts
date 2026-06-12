/** Row version from API (`updated_at`) for optimistic locking. */
/** Normalize Postgres/Supabase timestamps to ISO Z (Zod `.datetime()` requires `Z`). */
export function normalizeRowVersionTimestamp(
  value: string | null | undefined,
): string | undefined {
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) {
    return undefined;
  }
  return new Date(ms).toISOString();
}

export function readRowUpdatedAt(row: {
  updated_at?: string | null | undefined;
}): string | undefined {
  return normalizeRowVersionTimestamp(row.updated_at);
}

/** Attach `expected_updated_at` when the row has a server timestamp. */
export function mergeExpectedUpdatedAt<T extends Record<string, unknown>>(
  row: { updated_at?: string | null | undefined },
  patch: T,
): T & { expected_updated_at?: string } {
  const at = readRowUpdatedAt(row);
  if (!at) {
    return patch;
  }
  return { ...patch, expected_updated_at: at };
}

export function isHttpConflict(statusCode: number): boolean {
  return statusCode === 409;
}

export function isConflictMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("modified") ||
    m.includes("someone else") ||
    m.includes("конфликт") ||
    m.includes("conflict")
  );
}

export type TripUpdateActionResult =
  | { success: true; data: unknown }
  | { success: false; error: string; conflict?: boolean };

export function isTripUpdateConflict(
  result: { success: boolean; conflict?: boolean; error?: string },
): boolean {
  if (result.success) {
    return false;
  }
  if (result.conflict === true) {
    return true;
  }
  return typeof result.error === "string" && isConflictMessage(result.error);
}
