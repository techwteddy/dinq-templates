"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PricingCard } from "@/components/billing/pricing-card";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { SubscriptionPlan, UserSubscription } from "@/types";

export default function PricingPage() {
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const userId = session?.user.id ?? "";

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    void (async () => {
      const nextPlans = await services.billing.getPlans();
      setPlans(nextPlans);

      if (userId) {
        const nextSubscription = await services.billing.getSubscription(userId);
        setSubscription(nextSubscription);
      }
    })();
  }, [userId]);

  const choosePlan = async (planId: string) => {
    if (!userId) {
      router.push("/signup");
      return;
    }

    const sessionResult = await services.billing.createCheckoutSession(userId, planId);
    router.push(sessionResult.checkoutUrl);
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100 md:p-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Free for core tracking. Premium unlocks advanced analytics, deep insights, and expanded social accountability.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              active={plan.tier === (subscription?.tier ?? "free")}
              onChoose={(id) => void choosePlan(id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
