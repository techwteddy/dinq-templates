"use client";

import Link from "next/link";
import { Crown } from "lucide-react";

export function PremiumUpgradeCard() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-800 p-5 text-white shadow-xl">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <Crown className="h-4 w-4" /> Premium
      </div>
      <h2 className="mt-3 text-xl font-semibold">Unlock deep insights</h2>
      <p className="mt-2 text-sm text-zinc-300">
        Upgrade for unlimited habits, advanced analytics, and premium themes.
      </p>
      <Link
        href="/pricing"
        className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
      >
        See Plans
      </Link>
    </section>
  );
}
