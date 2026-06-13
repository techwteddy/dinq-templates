import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AvailabilityBadge } from "@/components/listings/AvailabilityBadge";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { MapView } from "@/components/listings/MapView";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { StarRating } from "@/components/reviews/StarRating";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { getStorageUrl } from "@/lib/utils/format";
import type { Metadata } from "next";
import Link from "next/link";
import { DeleteListingButton } from "@/components/listings/DeleteListingButton";
import { MessageOwnerButton } from "@/components/messages/MessageOwnerButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("title, description, barangay")
    .eq("id", id)
    .single();

  if (!listing) return { title: "Listing Not Found" };

  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: `${listing.title} - Rental in ${listing.barangay}, Baguio City`,
      description: listing.description.slice(0, 160),
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "*, listing_images(*, id, storage_path, display_order), profiles!listings_owner_id_fkey(id, full_name, avatar_url, bio)"
    )
    .eq("id", id)
    .order("display_order", {
      referencedTable: "listing_images",
      ascending: true,
    })
    .single();

  if (!listing) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === listing.owner_id;

  // Check if favorited
  let isFavorited = false;
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", id)
      .single();
    isFavorited = !!data;
  }

  // Owner rating
  const { data: ownerRating } = await supabase
    .from("owner_ratings")
    .select("*")
    .eq("owner_id", listing.owner_id)
    .single();

  const owner = listing.profiles as unknown as {
    id: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
  };

  const images = (listing.listing_images || []).map((img: { storage_path: string }) => ({
    url: getStorageUrl(img.storage_path),
  }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      {/* Image Gallery */}
      <ImageGallery images={images} title={listing.title} />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-[family-name:var(--font-display)] text-2xl text-pine sm:text-3xl">
                    {listing.title}
                  </h1>
                  <AvailabilityBadge status={listing.availability} />
                </div>
                <p className="mt-1 text-bark-light">
                  {listing.address_line}, {listing.barangay}, {listing.city}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {user && !isOwner && (
                  <FavoriteButton listingId={id} initialFavorited={isFavorited} />
                )}
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-display)] text-3xl text-pine">
                {formatPrice(listing.price_monthly)}
              </span>
              <span className="text-bark-light">/month</span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-stone/60 bg-mist p-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-pine">
                {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}
              </p>
              <p className="text-xs text-bark-light">
                {listing.bedrooms === 0 ? "" : "Bedrooms"}
              </p>
            </div>
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-pine">
                {listing.bathrooms}
              </p>
              <p className="text-xs text-bark-light">Bathrooms</p>
            </div>
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-pine">
                {listing.area_sqm ?? "—"}
              </p>
              <p className="text-xs text-bark-light">sqm</p>
            </div>
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-pine capitalize">
                {listing.property_type}
              </p>
              <p className="text-xs text-bark-light">Type</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {listing.pet_friendly && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Pet-friendly
              </span>
            )}
            {listing.parking && (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                Dedicated Parking
              </span>
            )}
            {listing.furnished === "fully_furnished" && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Fully Furnished
              </span>
            )}
            {listing.furnished === "semi_furnished" && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Semi-furnished
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-pine">Description</h2>
            <p className="mt-2 whitespace-pre-line text-bark-light">
              {listing.description}
            </p>
          </div>

          {/* Map */}
          {listing.latitude && listing.longitude && (
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-lg text-pine">Location</h2>
              <div className="mt-2">
                <MapView
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-stone-dark">
            Listed on {formatDate(listing.created_at)}
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Owner card */}
          <div className="rounded-2xl border border-stone/60 bg-warm-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-bark-light">Property Owner</h3>
            <Link
              href={`/profile/${owner.id}`}
              className="mt-3 flex items-center gap-3 hover:opacity-80"
            >
              {owner.avatar_url ? (
                <img
                  src={owner.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pine/10 font-semibold text-pine">
                  {owner.full_name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-pine">{owner.full_name}</p>
                {ownerRating && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={ownerRating.average_rating} />
                    <span className="text-xs text-bark-light">
                      ({ownerRating.review_count})
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {!isOwner && (
              <div className="mt-5 flex gap-2.5 rounded-xl bg-amber/10 border border-amber/20 px-4 py-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-xs font-semibold text-bark">Safety Reminder</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-bark-light">Never send money or deposits before visiting the property in person. BaguioRentals is a listing platform only and is not responsible for any transactions or losses.</p>
                </div>
              </div>
            )}

            {user && !isOwner && (
              <div className="mt-4">
                <MessageOwnerButton
                  listingId={id}
                  ownerId={listing.owner_id}
                />
              </div>
            )}

            {isOwner && (
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/listings/${id}/edit`}
                  className="flex-1 rounded-lg bg-mist px-4 py-3 text-center text-sm font-medium text-bark hover:bg-stone/50"
                >
                  Edit
                </Link>
                <DeleteListingButton listingId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
