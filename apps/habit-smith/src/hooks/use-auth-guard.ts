"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSessionStore } from "@/stores/session-store";

export function useAuthGuard() {
  const router = useRouter();
  const { session, hydrated } = useSessionStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/login");
    }
  }, [hydrated, router, session]);

  return { session, hydrated, isAuthenticated: Boolean(session) };
}
