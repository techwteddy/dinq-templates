"use client";

import Button from "@/components/ui/Button";
import type { Tables } from "@/types_db";
import { getStripe } from "@/utils/stripe/client";
import { checkoutWithStripe } from "@/utils/stripe/server";
import { getErrorRedirect } from "@/utils/helpers";
import { User } from "@supabase/supabase-js";
import cn from "classnames";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { translateInterval } from "@/utils/translation/translateInterval";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = {
  interval: "month" | "year" | "day" | "week" | "quarter" | "life";
  count: number;
};

// """"""""""""""""""""""""""""""""""""""""""""""""""""""""//
// """"""""""""""""""""""""""""""""""""""""""""""""""""""""//

export default function Pricing({ user, products, subscription }: Props) {
  // Filter out only products with recurring prices for subscriptions
  const subscriptionProducts = products.filter((product) =>
    product.prices.some((price) => price.type === "recurring"),
  );

  // Create an array of all intervals from all products
  const intervals = subscriptionProducts.flatMap((product) =>
    product.prices.map((price) => ({
      interval: price.interval,
      count: price.interval_count,
    })),
  );

  // Then, create a Set to get unique intervals (this removes duplicates)
  const uniqueIntervalsSet = new Set(
    intervals.map((interval) => JSON.stringify(interval)),
  );

  // Finally, convert the Set back to an array of objects
  const uniqueBillingIntervals: BillingInterval[] = Array.from(
    uniqueIntervalsSet,
  ).map((interval) => JSON.parse(interval));

  // Utility function to compare BillingInterval objects
  const isSameBillingInterval = (a: BillingInterval, b: BillingInterval) =>
    a.interval === b.interval && a.count === b.count;

  const router = useRouter();

  const [billingInterval, setBillingInterval] = useState<BillingInterval>({
    interval: "year",
    count: 1,
  });

  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const currentPath = usePathname();

  // """"""""""""""""""""""""""""""""""""""""""""""""""""""""//
  // """"""""""""""""""""""""""""""""""""""""""""""""""""""""//

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push("/signin/signup");
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath,
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          "En ukendt fejl opstod.",
          "Prøv lige senere eller kontakt Frigear support gennem kontaktformen på forsiden.",
        ),
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Appen er under opdatering, så prøv lige igen senere, eller kontakt
            Frigear support gennem kontaktformen på forsiden.
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Medlemskab
            </h1>
            <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
              {uniqueBillingIntervals.map((intervalOption) => {
                // Determine if this intervalOption is the current selected one
                const isActive = isSameBillingInterval(
                  billingInterval,
                  intervalOption,
                );

                // Apply active or inactive styles based on the condition
                const buttonClass = isActive
                  ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                  : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400";

                return (
                  <button
                    key={`${intervalOption.interval}-${intervalOption.count}`}
                    onClick={() => setBillingInterval(intervalOption)}
                    type="button"
                    className={`${buttonClass} rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                  >
                    {translateInterval(
                      intervalOption.interval,
                      intervalOption.count,
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {products.map((product) => {
              const price = product.prices.find(
                (p) =>
                  p.interval === billingInterval.interval &&
                  p.interval_count === billingInterval.count,
              );
              if (!price) return null;
              const priceString = new Intl.NumberFormat("da-DK", {
                style: "currency",
                currency: price.currency!,
                minimumFractionDigits: 0,
              }).format((price?.unit_amount || 0) / 100);
              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900",
                    {
                      "border border-pink-500": subscription
                        ? product.name === subscription?.prices?.products?.name
                        : product.name === "Frigear medlemskab",
                    },
                    "flex-1", // This makes the flex item grow to fill the space
                    "basis-1/3", // Assuming you want each card to take up roughly a third of the container's width
                    "max-w-xs", // Sets a maximum width to the cards to prevent them from getting too large
                  )}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold leading-6 text-white">
                      {product.name}
                    </h2>
                    <p className="mt-4 text-zinc-300">{product.description}</p>
                    <p className="mt-8">
                      <span className="text-5xl font-extrabold white">
                        {priceString}
                      </span>
                      <span className="text-base font-medium text-zinc-100">
                        /
                        {translateInterval(
                          billingInterval.interval,
                          billingInterval.count,
                        )}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {"\n *Betalingsgebyr er indeholdt i beløb"}
                      </span>
                    </p>
                    <Button
                      variant="slim"
                      type="button"
                      loading={priceIdLoading === price.id}
                      onClick={() => handleStripeCheckout(price)}
                      className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                    >
                      {subscription ? "SKIFT MEDLEMSKAB" : "BLIV MEDLEM"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <LogoCloud />
        </div>
      </section>
    );
  }
}

function LogoCloud() {
  return (
    <div>
      <p className="mt-20 text-lg uppercase sm:text-2xl text-zinc-400 text-center font-bold tracking-[0.2em]">
        <h3>Frigear Medlemsgoodies og skide meget lov til</h3>
      </p>
      <ul>
        <li>
          <p className="max-w-2xl m-auto mt-5 text-md text-zinc-200 sm:text-center sm:text-2xl">
            ★ First in line til info, medindflydelse og deltagelse i upcoming
            frivilligprojekter.
          </p>
        </li>
        <li>
          <p className="max-w-2xl m-auto mt-5 text-md text-zinc-200 sm:text-center sm:text-2xl">
            ★ Mulighed for at foreslå og ansøge om midler eller frivillige til
            interne Frigear projekter.
          </p>
        </li>
        <li>
          <p className="max-w-2xl m-auto mt-5 text-md text-zinc-200 sm:text-center sm:text-2xl">
            ★ Stille forslag til støtte af eksterne non-profit projekter og
            foreninger.
          </p>
        </li>
        <li>
          <p className="max-w-2xl m-auto mt-5 text-md text-zinc-200 sm:text-center sm:text-2xl">
            ★ Stemmeret ved generalforsamling.
          </p>
        </li>
        <li>
          <p className="max-w-2xl m-auto mt-5 text-md text-zinc-200 sm:text-center sm:text-2xl">
            ★ Rabatter på Frigear merch.
          </p>
        </li>
        <li>
          <p className="max-w-2xl m-auto mt-5 text-md text-zinc-200 sm:text-center sm:text-2xl">
            ★ Og massere af andet spas . . .
          </p>
        </li>
      </ul>
    </div>
  );
}
