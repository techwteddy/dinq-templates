"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";


import { useSessionStore } from "@/stores/session-store";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hydrated, session } = useSessionStore();

  useEffect(() => {
    if (hydrated && session) {
      router.replace("/dashboard");
    }
  }, [hydrated, router, session]);

  if (!hydrated) {
    return <main className="grid min-h-screen place-items-center">Loading...</main>;
  }

  if (session) {
    return null;
  }

  return <>{children}</>;
}
