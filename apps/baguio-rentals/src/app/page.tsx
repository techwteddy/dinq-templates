import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingWithImages } from "@/lib/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role ?? null;
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*, listing_images(*), profiles!listings_owner_id_fkey(id, full_name, avatar_url)")
    .eq("availability", "available")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);

  let favoriteIds: Set<string> = new Set();
  if (user) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id);
    favoriteIds = new Set(favs?.map((f) => f.listing_id) ?? []);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine px-5 py-24 sm:py-32">
        {/* Lion's Head background */}
        <div className="absolute inset-0">
          <img
            src="/images/lion-head-baguio.webp"
            alt="Baguio City landscape with pine trees"
            width={1920}
            height={1083}
            className="h-full w-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-pine/40" />
        </div>

        {/* Mountain silhouette background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-black" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,197.3C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/>
          </svg>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-black/50" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
          </svg>
        </div>

        {/* Decorative pine trees */}
        <div className="absolute bottom-0 left-8 opacity-[0.06]">
          <svg width="120" height="200" viewBox="0 0 120 200" fill="white">
            <polygon points="60,10 20,80 100,80"/>
            <polygon points="60,50 15,130 105,130"/>
            <polygon points="60,90 10,180 110,180"/>
            <rect x="52" y="175" width="16" height="25"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-12 opacity-[0.04]">
          <svg width="90" height="160" viewBox="0 0 120 200" fill="white">
            <polygon points="60,10 20,80 100,80"/>
            <polygon points="60,50 15,130 105,130"/>
            <polygon points="60,90 10,180 110,180"/>
            <rect x="52" y="175" width="16" height="25"/>
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber">
              Baguio City, Philippines
            </p>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-tight text-cream sm:text-6xl sm:leading-[1.1]">
              Find Your Home in
              <br />
              <span className="text-amber">the City of Pines</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-stone-dark/70">
              Browse apartments, houses, rooms, and condos for rent.
              Connect directly with property owners.
            </p>
          </div>

          {/* Search bar */}
          <form
            action="/listings"
            className="animate-fade-up mx-auto mt-10 flex max-w-xl overflow-hidden rounded-2xl bg-warm-white shadow-2xl shadow-black/20 ring-1 ring-white/10"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex flex-1 items-center gap-3 px-5">
              <svg className="h-5 w-5 shrink-0 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Search by location, property type..."
                aria-label="Search rental listings"
                className="w-full py-4 text-sm text-bark placeholder:text-stone-dark/50 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-pine px-7 text-sm font-semibold text-amber hover:bg-pine-light transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick filters */}
          <div
            className="animate-fade-up mt-8 flex flex-wrap justify-center gap-2"
            style={{ animationDelay: "300ms" }}
          >
            {[
              { label: "Apartments", type: "apartment" },
              { label: "Houses", type: "house" },
              { label: "Rooms", type: "room" },
              { label: "Condos", type: "condo" },
              { label: "Townhouses", type: "townhouse" },
            ].map(({ label, type }) => (
              <Link
                key={type}
                href={`/listings?type=${type}`}
                className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-stone-dark/60 backdrop-blur-sm hover:border-amber/40 hover:text-amber transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-stone/60 bg-warm-white">
        <div className="mx-auto flex max-w-4xl items-center justify-center divide-x divide-stone/60 py-6">
          {[
            { value: "100%", label: "Free to List" },
            { value: "129", label: "Barangays Covered" },
            { value: "Direct", label: "Owner Contact" },
          ].map(({ value, label }) => (
            <div key={label} className="px-8 text-center sm:px-14">
              <p className="font-[family-name:var(--font-display)] text-xl text-pine">{value}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-bark-light">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety notice */}
      <section className="mx-auto max-w-2xl px-5 pt-8">
        <div className="flex items-center justify-center gap-3 rounded-xl bg-amber/10 border border-amber/20 px-5 py-3 text-center">
          <svg className="h-5 w-5 shrink-0 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-xs text-bark-light">
            <span className="font-semibold text-bark">Stay safe:</span> Never send money before visiting a property in person. We are a listing platform only.
          </p>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Available Now</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-pine">
              Latest Listings
            </h2>
          </div>
          <Link
            href="/listings"
            className="group flex items-center gap-1.5 text-sm font-semibold text-pine-muted hover:text-pine transition-colors"
          >
            View all
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="stagger-children mt-10 grid grid-cols-2 gap-3 sm:gap-7 lg:grid-cols-3">
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
          <div className="mt-10 rounded-2xl border border-stone/60 bg-warm-white py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mist">
              <svg className="h-8 w-8 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">No listings yet</p>
            <p className="mt-1 text-sm text-bark-light">Be the first to post a property in Baguio City</p>
          </div>
        )}
      </section>

      {/* CTA for owners — only show to visitors (not signed-in users) */}
      {!user && <section className="relative overflow-hidden bg-mist px-5 py-20">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pine">
            <svg className="h-7 w-7 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-pine">
            Own a Property in Baguio?
          </h2>
          <p className="mt-3 text-bark-light leading-relaxed">
            List your property for free and connect with renters looking for their next home in the City of Pines.
          </p>
          <Link
            href="/listings/new"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pine px-8 py-3.5 text-sm font-semibold text-amber shadow-lg shadow-pine/20 hover:bg-pine-light hover:shadow-xl transition-all"
          >
            Post a Listing for Free
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>
      </section>}

    </div>
  );
}
