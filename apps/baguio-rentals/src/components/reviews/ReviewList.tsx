import { StarRating } from "./StarRating";
import { formatDate } from "@/lib/utils/format";
import type { Review, Profile } from "@/lib/types/database";
import Link from "next/link";

type ReviewWithReviewer = Review & {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
};

export function ReviewList({ reviews }: { reviews: ReviewWithReviewer[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl bg-mist px-4 py-8 text-center">
        <p className="text-sm text-bark-light">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-stone/60 bg-warm-white p-4"
        >
          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${review.reviewer_id}`}
              className="flex items-center gap-2.5 group"
            >
              {review.profiles.avatar_url ? (
                <img
                  src={review.profiles.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-stone/40"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-xs font-semibold text-amber ring-2 ring-stone/40">
                  {review.profiles.full_name[0]}
                </div>
              )}
              <span className="text-sm font-semibold text-pine group-hover:text-pine-light transition-colors">
                {review.profiles.full_name}
              </span>
            </Link>
            <span className="text-[11px] text-bark-light">
              {formatDate(review.created_at)}
            </span>
          </div>
          <div className="mt-2">
            <StarRating rating={review.rating} />
          </div>
          {review.comment && (
            <p className="mt-2 text-sm leading-relaxed text-bark-light">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
