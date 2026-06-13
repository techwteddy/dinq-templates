import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { MobileFilterToggle } from "@/components/listings/MobileFilterToggle";
import type { ListingWithImages } from "@/lib/types/database";
import { Suspense } from "react";

export const metadata = {
  title: "Browse Rentals in Baguio City",
  description: "Search apartments, houses, rooms, and condos for rent in Baguio City. Filter by price, location, property type, and amenities.",
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, listing_images(*), profiles!listings_owner_id_fkey(id, full_name, avatar_url)", { count: "exact" });

  // Full-text search
  if (params.q) {
    query = query.textSearch("fts", params.q, { type: "websearch" });
  }

  // Hide occupied listings from browse (owners see them on dashboard)
  query = query.neq("availability", "occupied");

  // Filters
  if (params.type) query = query.eq("property_type", params.type);
  if (params.beds) query = query.eq("bedrooms", parseInt(params.beds));
  if (params.min_price)
    query = query.gte("price_monthly", parseFloat(params.min_price));
  if (params.max_price)
    query = query.lte("price_monthly", parseFloat(params.max_price));
  if (params.barangay) query = query.eq("barangay", params.barangay);
  if (params.availability)
    query = query.eq("availability", params.availability);
  if (params.pet_friendly === "true") query = query.eq("pet_friendly", true);
  if (params.parking === "true") query = query.eq("parking", true);
  if (params.furnished) query = query.eq("furnished", params.furnished);

  // Sort
  switch (params.sort) {
    case "price_asc":
      query = query.order("price_monthly", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_monthly", { ascending: false });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  // Pagination
  const page = parseInt(params.page ?? "1");
  const perPage = 12;
  const from = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data: listings, count } = await query;

  // Get user's favorites
  const { data: { user } } = await supabase.auth.getUser();
  let favoriteIds: Set<string> = new Set();
  if (user) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id);
    favoriteIds = new Set(favs?.map((f) => f.listing_id) ?? []);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Browse</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-pine">Browse Rentals</h1>
        <p className="mt-1 text-sm text-bark-light">
          Find your next home in Baguio City
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters sidebar */}
        <aside className="lg:col-span-1">
          <MobileFilterToggle>
            <Suspense>
              <ListingFilters />
            </Suspense>
          </MobileFilterToggle>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing as unknown as ListingWithImages}
                  userId={user?.id}
                  favorited={favoriteIds.has(listing.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-stone/60 bg-warm-white py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
                <svg className="h-7 w-7 text-bark-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">No listings found</p>
              <p className="mt-1 text-sm text-bark-light">
                Try adjusting your filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {(() => {
            const totalPages = Math.ceil((count ?? 0) / perPage);
            if (totalPages <= 1) return null;

            const buildHref = (p: number) => {
              const q = new URLSearchParams(
                Object.entries(params).filter(
                  (entry): entry is [string, string] => entry[1] !== undefined
                )
              );
              q.set("page", String(p));
              return `/listings?${q.toString()}`;
            };

            const pages: (number | "...")[] = [];
            for (let i = 1; i <= totalPages; i++) {
              if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
              }
            }

            return (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
                <a
                  href={page > 1 ? buildHref(page - 1) : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors ${
                    page > 1
                      ? "border border-stone bg-warm-white text-bark hover:bg-mist"
                      : "pointer-events-none text-stone-dark/40"
                  }`}
                  aria-label="Previous page"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/>
                  </svg>
                </a>

                {pages.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-bark-light">
                      ...
                    </span>
                  ) : (
                    <a
                      key={p}
                      href={buildHref(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-pine text-amber shadow-sm"
                          : "border border-stone bg-warm-white text-bark hover:bg-mist"
                      }`}
                    >
                      {p}
                    </a>
                  )
                )}

                <a
                  href={page < totalPages ? buildHref(page + 1) : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors ${
                    page < totalPages
                      ? "border border-stone bg-warm-white text-bark hover:bg-mist"
                      : "pointer-events-none text-stone-dark/40"
                  }`}
                  aria-label="Next page"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
                  </svg>
                </a>

                <span className="ml-3 text-xs text-bark-light">
                  Page {page} of {totalPages}
                </span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
