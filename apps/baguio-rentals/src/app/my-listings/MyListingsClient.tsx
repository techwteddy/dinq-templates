"use client";

import { useState } from "react";
import Link from "next/link";
import { AvailabilityToggle } from "@/components/listings/AvailabilityToggle";
import { formatPrice } from "@/lib/utils/format";
import type { ListingWithImages } from "@/lib/types/database";

type Filter = "all" | "available" | "reserved" | "occupied";

const STATS = [
  { key: "all" as Filter, label: "Total Listings", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z", border: "border-stone/60", borderActive: "border-pine ring-2 ring-pine/20", bg: "bg-mist", iconColor: "text-pine-muted" },
  { key: "available" as Filter, label: "Available", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", border: "border-green-200", borderActive: "border-green-500 ring-2 ring-green-200", bg: "bg-green-50", iconColor: "text-green-600" },
  { key: "reserved" as Filter, label: "Reserved", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", border: "border-amber-200", borderActive: "border-amber-500 ring-2 ring-amber-200", bg: "bg-amber-50", iconColor: "text-amber-600" },
  { key: "occupied" as Filter, label: "Occupied", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", border: "border-red-200", borderActive: "border-red-500 ring-2 ring-red-200", bg: "bg-red-50", iconColor: "text-red-600" },
];

export function MyListingsClient({ listings }: { listings: ListingWithImages[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts: Record<Filter, number> = {
    all: listings.length,
    available: listings.filter(l => l.availability === "available").length,
    reserved: listings.filter(l => l.availability === "reserved").length,
    occupied: listings.filter(l => l.availability === "occupied").length,
  };

  const filtered = filter === "all"
    ? listings
    : listings.filter(l => l.availability === filter);

  return (
    <>
      {/* Quick stats / filters */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map(({ key, label, icon, border, borderActive, bg, iconColor }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-xl border bg-warm-white p-5 text-left transition-all cursor-pointer ${
              filter === key ? borderActive : border
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                <svg className={`h-5 w-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={icon} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl text-pine">{counts[key]}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-bark-light">{label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="mt-10">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone bg-warm-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
              <svg className="h-7 w-7 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">No listings yet</p>
            <p className="mt-1 text-sm text-bark-light">Create your first listing and start connecting with renters</p>
            <Link
              href="/listings/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pine px-5 py-2.5 text-sm font-semibold text-amber hover:bg-pine-light transition-colors"
            >
              Create First Listing
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone bg-warm-white p-12 text-center">
            <p className="font-[family-name:var(--font-display)] text-lg text-pine">No {filter} listings</p>
            <p className="mt-1 text-sm text-bark-light">
              You don&apos;t have any {filter} listings right now.
            </p>
            <button
              onClick={() => setFilter("all")}
              className="mt-4 text-sm font-semibold text-pine hover:text-pine-light transition-colors"
            >
              View all listings
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-all hover:shadow-md hover:shadow-bark/5 ${
                  listing.availability === "available"
                    ? "border-green-200 bg-green-50/40"
                    : listing.availability === "reserved"
                    ? "border-amber-200 bg-amber-50/40"
                    : "border-red-200 bg-red-50/40"
                }`}
              >
                <Link
                  href={`/listings/${listing.id}`}
                  className="min-w-0 flex-1 group"
                >
                  <p className="font-semibold text-pine truncate group-hover:text-pine-light transition-colors">
                    {listing.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-bark-light truncate">
                    <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {listing.barangay}
                    <span className="text-stone-dark">&middot;</span>
                    <span className="font-semibold text-pine">{formatPrice(listing.price_monthly)}</span>/mo
                  </div>
                </Link>
                <AvailabilityToggle
                  listingId={listing.id}
                  currentStatus={listing.availability}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
