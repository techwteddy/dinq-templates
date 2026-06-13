import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ListingWithImages } from "@/lib/types/database";
import Link from "next/link";
import { MyListingsClient } from "./MyListingsClient";

export const metadata = {
  title: "My Listings",
  description: "Manage your rental property listings in Baguio City.",
};

const AVAILABILITY_ORDER = { available: 0, reserved: 1, occupied: 2 } as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  if (profile.role !== "property_owner") redirect("/");

  const { data } = await supabase
    .from("listings")
    .select("*, listing_images(*), profiles!listings_owner_id_fkey(id, full_name, avatar_url)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const myListings = ((data ?? []) as unknown as ListingWithImages[]).sort(
    (a, b) =>
      AVAILABILITY_ORDER[a.availability as keyof typeof AVAILABILITY_ORDER] -
      AVAILABILITY_ORDER[b.availability as keyof typeof AVAILABILITY_ORDER]
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-pine">
          My Listings
        </h1>
        <Link
          href="/listings/new"
          className="flex items-center gap-2 rounded-xl bg-pine px-5 py-2.5 text-sm font-semibold text-amber shadow-lg shadow-pine/20 hover:bg-pine-light transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Post a Listing
        </Link>
      </div>

      <MyListingsClient listings={myListings} />
    </div>
  );
}
