import Link from "next/link";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { CardFavoriteButton } from "./CardFavoriteButton";
import { formatPrice } from "@/lib/utils/format";
import { getStorageUrl } from "@/lib/utils/format";
import type { ListingWithImages } from "@/lib/types/database";

export function ListingCard({
  listing,
  userId,
  favorited,
}: {
  listing: ListingWithImages;
  userId?: string;
  favorited?: boolean;
}) {
  const coverImage = listing.listing_images?.[0];
  const isOwner = userId === listing.owner_id;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`group overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-lg hover:shadow-bark/5 hover:-translate-y-1 ${
        listing.availability === "available"
          ? "border-green-200 bg-warm-white"
          : listing.availability === "reserved"
          ? "border-amber-200 bg-amber-50/30"
          : "border-red-200 bg-red-50/30"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {coverImage ? (
          <img
            src={getStorageUrl(coverImage.storage_path)}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-stone-dark">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="text-xs">No photo</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute left-3 top-3">
          <AvailabilityBadge status={listing.availability} />
        </div>

        {userId && !isOwner && (
          <div className="absolute right-2 top-2">
            <CardFavoriteButton listingId={listing.id} initialFavorited={favorited ?? false} />
          </div>
        )}

        {/* Price tag */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
          <div className="rounded-md bg-pine/90 px-2 py-1 backdrop-blur-sm sm:rounded-lg sm:px-2.5 sm:py-1">
            <span className="text-[11px] font-bold text-amber sm:text-xs">
              {formatPrice(listing.price_monthly)}
            </span>
            <span className="text-[9px] text-stone-dark/70 sm:text-[10px]">/mo</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 sm:p-4">
        <h3 className="text-sm font-semibold text-pine line-clamp-1 group-hover:text-pine-light transition-colors sm:text-base">
          {listing.title}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-[10px] text-bark-light sm:mt-1.5 sm:gap-1.5 sm:text-xs">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {listing.barangay}, {listing.city}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1 sm:mt-3 sm:gap-1.5">
          {[
            { label: listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bed` },
            { label: `${listing.bathrooms} bath` },
            ...(listing.area_sqm ? [{ label: `${listing.area_sqm} sqm` }] : []),
          ].map(({ label }, i) => (
            <span key={i} className="rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-medium text-bark-light sm:px-2 sm:text-[11px]">
              {label}
            </span>
          ))}
        </div>

        {(listing.pet_friendly || listing.parking || listing.furnished !== "unfurnished") && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1 sm:mt-2 sm:gap-1.5">
            {listing.pet_friendly && (
              <span className="rounded-md bg-pine/5 px-1.5 py-0.5 text-[10px] font-medium text-pine-muted sm:px-2 sm:text-[11px]">
                Pets OK
              </span>
            )}
            {listing.parking && (
              <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 sm:px-2 sm:text-[11px]">
                Parking
              </span>
            )}
            {listing.furnished === "fully_furnished" && (
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 sm:px-2 sm:text-[11px]">
                Fully Furnished
              </span>
            )}
            {listing.furnished === "semi_furnished" && (
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 sm:px-2 sm:text-[11px]">
                Semi-furnished
              </span>
            )}
          </div>
        )}

        <div className="mt-1.5 flex items-center justify-between sm:mt-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-dark capitalize sm:text-[11px]">
            {listing.property_type}
          </span>
          <svg className="h-4 w-4 text-stone-dark transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}
