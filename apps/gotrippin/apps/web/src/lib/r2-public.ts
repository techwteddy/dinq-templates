/**
 * Browser-safe R2 URL helpers (no AWS SDK / Node built-ins).
 * Use this from Client Components. Server uploads use `@/lib/r2` for `r2Client` only.
 *
 * Vercel production: set `NEXT_PUBLIC_R2_PUBLIC_URL` (e.g. https://cdn.gotrippin.app) so
 * storage keys become loadable URLs. Uploads also need `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
 * `R2_SECRET_ACCESS_KEY` on the web app. See `docs/diploma/deploy-env.md` (local; docs/ is gitignored).
 */

// Bucket "cdn" → URLs: cdn.gotrippin.app/avatars/... and cdn.gotrippin.app/trip-images/...
export const AVATARS_BUCKET = "cdn";
export const TRIP_IMAGES_KEY_PREFIX = "trip-images/";
export const TRIP_IMAGES_BUCKET = AVATARS_BUCKET;

/**
 * Build a public URL for an object in R2.
 * Uses NEXT_PUBLIC_R2_PUBLIC_URL only — your custom domain (e.g. https://cdn.gotrippin.app).
 */
export function getR2PublicUrl(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) {
    return key;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const normalizedKey = trimmed.replace(/^\/+/, "");
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
  if (!base) {
    return normalizedKey;
  }
  return `${base.replace(/\/$/, "")}/${normalizedKey}`;
}

/**
 * Resolve the display URL for a trip's cover photo.
 */
export function resolveTripCoverUrl(trip: {
  cover_photo?: { storage_key: string } | null;
}): string | null {
  if (trip.cover_photo?.storage_key) {
    return getR2PublicUrl(trip.cover_photo.storage_key);
  }
  return null;
}

export { resolveTripLocationPhotoUrl } from "@/lib/place-photo-display";
