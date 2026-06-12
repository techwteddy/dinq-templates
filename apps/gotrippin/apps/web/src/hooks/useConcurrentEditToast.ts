"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/trips";
import {
  isConflictMessage,
  isHttpConflict,
  isTripUpdateConflict,
} from "@/lib/concurrency";

/**
 * Toast + refresh when a save hits a stale row (409 / conflict message).
 */
export function useConcurrentEditToast() {
  const router = useRouter();
  const { t } = useTranslation();

  const notifyConcurrentEdit = useCallback(() => {
    toast.error(t("trips.concurrent_edit"), {
      description: t("trips.concurrent_edit_hint"),
    });
    router.refresh();
  }, [router, t]);

  const handleApiError = useCallback(
    (err: unknown): boolean => {
      if (err instanceof ApiError) {
        if (isHttpConflict(err.statusCode) || isConflictMessage(err.message)) {
          notifyConcurrentEdit();
          return true;
        }
      }
      return false;
    },
    [notifyConcurrentEdit],
  );

  const handleTripUpdateResult = useCallback(
    (result: { success: boolean; conflict?: boolean; error?: string }): boolean => {
      if (isTripUpdateConflict(result)) {
        notifyConcurrentEdit();
        return true;
      }
      return false;
    },
    [notifyConcurrentEdit],
  );

  return { notifyConcurrentEdit, handleApiError, handleTripUpdateResult };
}
