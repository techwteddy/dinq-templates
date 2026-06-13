"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const selectRole = async (role: "property_owner" | "renter") => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ role, has_onboarded: true })
      .eq("id", user.id);

    router.push("/");
  };

  return (
    <div className="mt-8 space-y-4">
      <button
        onClick={() => selectRole("property_owner")}
        disabled={loading}
        className="flex w-full items-center gap-4 rounded-2xl border-2 border-stone/60 bg-warm-white p-6 text-left transition-all hover:border-amber hover:shadow-md disabled:opacity-50"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pine text-amber">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-pine">I&apos;m a Property Owner</p>
          <p className="text-sm text-bark-light">
            List my properties for rent in Baguio City
          </p>
        </div>
      </button>

      <button
        onClick={() => selectRole("renter")}
        disabled={loading}
        className="flex w-full items-center gap-4 rounded-2xl border-2 border-stone/60 bg-warm-white p-6 text-left transition-all hover:border-amber hover:shadow-md disabled:opacity-50"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pine text-amber">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-pine">I&apos;m Looking to Rent</p>
          <p className="text-sm text-bark-light">
            Find apartments, houses, and rooms in Baguio City
          </p>
        </div>
      </button>
    </div>
  );
}
