"use client";

import Button from "@/components/ui/Button";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { createStripePortal } from "@/utils/stripe/server";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { Tables } from "@/types_db";
import { translateInterval } from "@/utils/translation/translateInterval";

type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;
type Product = Tables<"products">;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card
      title="Medlemskab"
      description={
        subscription
          ? `Du er tilknyttet: \n 
           ${subscription?.prices?.products?.name} plan.`
          : "Du har ik´ valgt et medlemskab af Frigear endnu. "
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Opdatér dit medlemskab via Stripe.</p>
          <Button
            variant="slim"
            onClick={handleStripePortalRequest}
            loading={isSubmitting}
          >
            Medlemsportal
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice} /${translateInterval(subscription?.prices?.interval as string, subscription?.prices?.interval_count as number)}`
        ) : (
          <Link href="/pricing">Vælg medlemskab</Link>
        )}
        <span className="text-xs text-zinc-500">
          {"\n *Betalingsgebyr er indeholdt i beløb"}
        </span>
      </div>
    </Card>
  );
}
