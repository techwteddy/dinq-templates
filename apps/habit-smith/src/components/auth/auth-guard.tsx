"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { services } from "@/services";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, isAuthenticated, session } = useAuthGuard();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!session?.user.id) return;

    let active = true;
    void (async () => {
      const profile = await services.profile.getProfile(session.user.id);
      if (!active) return;

      if (pathname.startsWith("/dashboard") && profile && !profile.onboardingComplete) {
        router.replace("/onboarding");
      }
      setCheckingProfile(false);
    })();

    return () => {
      active = false;
    };
  }, [hydrated, pathname, router, session?.user.id]);

  if (!hydrated || !isAuthenticated || checkingProfile) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-zinc-500">Checking session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
