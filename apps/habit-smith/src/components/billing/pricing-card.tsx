"use client";

import type { SubscriptionPlan } from "@/types";

export function PricingCard({
  plan,
  active,
  onChoose,
}: {
  plan: SubscriptionPlan;
  active: boolean;
  onChoose: (planId: string) => void;
}) {
  return (
    <article className={`rounded-2xl border p-6 shadow-sm ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-900"}`}>
      <h2 className="text-xl font-semibold">{plan.name}</h2>
      <p className={`mt-2 text-sm ${active ? "text-zinc-300" : "text-zinc-500"}`}>
        {plan.tier === "free" ? "Perfect for getting started" : "For ambitious builders and teams"}
      </p>
      <p className="mt-4 text-3xl font-semibold">${plan.priceMonthly}<span className="text-base font-normal">/mo</span></p>
      <ul className={`mt-4 space-y-2 text-sm ${active ? "text-zinc-200" : "text-zinc-600"}`}>
        {plan.features.map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <button
        className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"}`}
        onClick={() => onChoose(plan.id)}
      >
        {active ? "Current Plan" : "Choose Plan"}
      </button>
    </article>
  );
}
