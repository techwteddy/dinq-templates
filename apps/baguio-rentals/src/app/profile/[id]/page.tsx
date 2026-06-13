import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/reviews/StarRating";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ListingCard } from "@/components/listings/ListingCard";
import { formatDate } from "@/lib/utils/format";
import type { ListingWithImages } from "@/lib/types/database";
import Link from "next/link";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .single();

  return {
    title: profile
      ? `${profile.full_name} - BaguioRentals`
      : "Profile Not Found",
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = profile.role === "property_owner";

  // Get user rating (works for both owners and renters)
  const { data: userRating } = await supabase
    .from("user_ratings")
    .select("*")
    .eq("user_id", id)
    .single();

  // Get reviews about this person
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles!reviews_reviewer_id_fkey(full_name, avatar_url)")
    .eq("owner_id", id)
    .order("created_at", { ascending: false });

  // Get listings if owner (exclude occupied from public view)
  let listings: ListingWithImages[] = [];
  let totalListings = 0;
  let availableListings = 0;
  if (isOwner) {
    const { data, count } = await supabase
      .from("listings")
      .select("*, listing_images(*), profiles!listings_owner_id_fkey(id, full_name, avatar_url)", { count: "exact" })
      .eq("owner_id", id)
      .neq("availability", "occupied")
      .order("created_at", { ascending: false });
    listings = (data ?? []) as unknown as ListingWithImages[];
    totalListings = count ?? 0;
    availableListings = listings.filter(l => l.availability === "available").length;
  }

  // Check if current user can review (must have a conversation with this person)
  let canReview = false;
  let hasReviewed = false;
  if (user && user.id !== id) {
    // Check for existing conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(renter_id.eq.${user.id},owner_id.eq.${id}),and(owner_id.eq.${user.id},renter_id.eq.${id})`
      )
      .limit(1)
      .single();

    canReview = !!conversation;

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("reviewer_id", user.id)
      .eq("owner_id", id)
      .single();
    hasReviewed = !!existingReview;
  }

  const memberSince = formatDate(profile.created_at);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      {/* Profile header */}
      <div className="rounded-2xl border border-stone/60 bg-warm-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-4 ring-stone/40"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-pine text-3xl font-bold text-amber ring-4 ring-stone/40">
              {profile.full_name[0]}
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-pine">
              {profile.full_name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bark-light">
                <span className={`h-1.5 w-1.5 rounded-full ${isOwner ? "bg-amber" : "bg-pine-muted"}`} />
                {profile.role.replace("_", " ")}
              </div>
              <span className="text-xs text-bark-light">
                Member since {memberSince}
              </span>
            </div>

            {/* Rating */}
            {userRating && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={userRating.average_rating} />
                <span className="text-sm font-medium text-pine">
                  {userRating.average_rating}
                </span>
                <span className="text-sm text-bark-light">
                  ({userRating.review_count} {userRating.review_count === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-bark-light">
                {profile.bio}
              </p>
            )}

            {/* Contact info */}
            {(profile.email || profile.phone) && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                {profile.email && (
                  user && user.id !== id ? (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-sm text-bark-light hover:text-pine transition-colors">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {profile.email}
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-bark-light">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {profile.email}
                    </span>
                  )
                )}
                {profile.phone && (
                  user && user.id !== id ? (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 text-sm text-bark-light hover:text-pine transition-colors">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {profile.phone}
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-bark-light">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {profile.phone}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Stats for owners */}
      {isOwner && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Listings", value: totalListings, icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" },
            { label: "Available", value: availableListings, icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Rating", value: userRating ? userRating.average_rating : "N/A", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
            { label: "Reviews", value: userRating ? userRating.review_count : 0, icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl border border-stone/60 bg-warm-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist">
                  <svg className="h-4.5 w-4.5 text-pine-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={icon} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl text-pine">{value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-bark-light">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renter stats */}
      {!isOwner && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: "Rating", value: userRating ? userRating.average_rating : "N/A", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
            { label: "Reviews", value: userRating ? userRating.review_count : 0, icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl border border-stone/60 bg-warm-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist">
                  <svg className="h-4.5 w-4.5 text-pine-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={icon} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl text-pine">{value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-bark-light">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Owner's listings (hide on own profile — they have My Listings page) */}
      {listings.length > 0 && (!user || user.id !== id) && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-pine">
            Listed Properties ({listings.length})
          </h2>
          <div className="stagger-children mt-5 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {/* Edit profile (own profile only) */}
      {user && user.id === id && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-pine">
            Edit Profile
          </h2>
          <div className="mt-5 rounded-2xl border border-stone/60 bg-warm-white p-5 sm:p-6">
            <EditProfileForm profile={profile} />
          </div>
        </div>
      )}

      {/* Reviews section */}
      <div className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-pine">
          Reviews {userRating ? `(${userRating.review_count})` : ""}
        </h2>

        {/* Review form */}
        {canReview && !hasReviewed && (
          <div className="mt-5 rounded-2xl border border-stone/60 bg-warm-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-bark">
              Leave a Review for {profile.full_name}
            </h3>
            <p className="mt-1 text-xs text-bark-light">
              Share your experience {isOwner ? "renting from" : "with"} this {isOwner ? "property owner" : "renter"}
            </p>
            <div className="mt-4">
              <ReviewForm ownerId={id} />
            </div>
          </div>
        )}

        {canReview && hasReviewed && (
          <div className="mt-5 rounded-xl bg-mist px-4 py-3 text-sm text-bark-light">
            You have already reviewed {profile.full_name}.
          </div>
        )}

        {!canReview && user && user.id !== id && (
          <div className="mt-5 rounded-xl bg-mist px-4 py-3 text-sm text-bark-light">
            You can leave a review after exchanging messages with {profile.full_name}.
          </div>
        )}

        {/* Review list */}
        <div className="mt-5">
          <ReviewList reviews={(reviews ?? []) as Parameters<typeof ReviewList>[0]["reviews"]} />
        </div>
      </div>
    </div>
  );
}
