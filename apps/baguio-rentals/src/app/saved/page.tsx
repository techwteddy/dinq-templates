import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingWithImages } from "@/lib/types/database";
import Link from "next/link";

export const metadata = {
  title: "Saved Listings",
  description: "View your saved rental listings in Baguio City.",
};

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  let savedListings: ListingWithImages[] = [];
  const { data: favs } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", user.id);

  if (favs && favs.length > 0) {
    const ids = favs.map((f) => f.listing_id);
    const { data } = await supabase
      .from("listings")
      .select("*, listing_images(*), profiles!listings_owner_id_fkey(id, full_name, avatar_url)")
      .in("id", ids);
    savedListings = (data ?? []) as unknown as ListingWithImages[];
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Saved</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-pine">
          Saved Listings ({savedListings.length})
        </h1>
      </div>

      {savedListings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone bg-warm-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
            <svg className="h-7 w-7 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">No saved listings</p>
          <p className="mt-1 text-sm text-bark-light">Browse and save properties you are interested in</p>
          <Link
            href="/listings"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pine px-5 py-2.5 text-sm font-semibold text-amber hover:bg-pine-light transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="stagger-children mt-8 grid grid-cols-2 gap-3 sm:gap-7 lg:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} userId={user.id} favorited={true} />
          ))}
        </div>
      )}
    </div>
  );
}
