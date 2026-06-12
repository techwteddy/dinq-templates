/**
 * Normalize Nest / API error bodies for toasts and action results.
 */
export function formatApiErrorMessage(message: unknown, fallback = "Request failed"): string {
  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }
  if (Array.isArray(message)) {
    const parts = message.filter((m): m is string => typeof m === "string" && m.length > 0);
    if (parts.length > 0) {
      return parts.join(". ");
    }
  }
  return fallback;
}

/** Map common Nest trip-save errors to i18n keys (caller passes `t`). */
export function tripSaveErrorDescription(
  message: string,
  t: (key: string, opts?: { defaultValue?: string }) => string,
): string {
  const m = message.toLowerCase();
  if (m.includes("only editors can change")) {
    return t("trips.save_editors_only", {
      defaultValue: "Only editors can change this trip",
    });
  }
  if (m.includes("invalid trip data") || m.includes("validation failed")) {
    return t("trips.save_validation_failed", {
      defaultValue: "Could not save — refresh the page and try again.",
    });
  }
  return message;
}
