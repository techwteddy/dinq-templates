/**
 * Display URLs for trip stop photos (R2/CDN keys or Google Places media).
 * Google media is proxied same-origin so PhotoSwipe and Firefox ETP do not block loads.
 */

import { getR2PublicUrl } from "@/lib/r2-public";

/** `places/{id}/photos/{ref}` — optional trailing `/media` from full media URLs. */
const PLACES_PHOTO_RESOURCE =
  /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+(?:\/media)?$/;

/**
 * Google photo resource name for Place Photos (New): `places/…/photos/…` without `/media`.
 * `buildPlacePhotoMediaUrl` appends `/media` itself — do not pass a path that already ends in `/media`.
 */
export function normalizeGooglePlacePhotoResourceName(path: string): string | null {
  const trimmed = path.trim();
  if (!PLACES_PHOTO_RESOURCE.test(trimmed)) {
    return null;
  }
  return trimmed.replace(/\/media$/i, "");
}

/** Parse a `places.googleapis.com` media URL into a photo resource name (no `/media` suffix). */
export function parseGooglePlacesPhotoMediaPath(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname !== "places.googleapis.com") {
      return null;
    }
    const prefix = "/v1/";
    const idx = u.pathname.indexOf(prefix);
    if (idx < 0) {
      return null;
    }
    const name = u.pathname.slice(idx + prefix.length);
    return normalizeGooglePlacePhotoResourceName(name);
  } catch {
    return null;
  }
}

export function placeIdFromGooglePhotoResourceName(resourceName: string): string | null {
  const match = /^places\/([^/]+)\/photos\//.exec(resourceName.trim());
  return match?.[1] ?? null;
}

export function buildProxiedPlacePhotoUrl(
  resourceName: string,
  maxHeightPx: number,
  placeId?: string | null,
): string {
  const params = new URLSearchParams({
    name: resourceName,
    maxHeightPx: String(maxHeightPx),
  });
  const pid =
    placeId?.trim() || placeIdFromGooglePhotoResourceName(resourceName);
  if (pid) {
    params.set("placeId", pid);
  }
  return `/api/places/photo?${params.toString()}`;
}

function proxiedUrlFromGoogleMediaUrl(url: string): string | null {
  const name =
    parseGooglePlacesPhotoMediaPath(url) ?? normalizeGooglePlacePhotoResourceName(url);
  if (!name) {
    return null;
  }
  let maxHeightPx = 900;
  try {
    const u = new URL(url);
    const raw = u.searchParams.get("maxHeightPx");
    if (raw != null) {
      const n = Number.parseInt(raw, 10);
      if (Number.isFinite(n) && n > 0 && n <= 4800) {
        maxHeightPx = n;
      }
    }
  } catch {
    /* use default */
  }
  return buildProxiedPlacePhotoUrl(name, maxHeightPx, placeIdFromGooglePhotoResourceName(name));
}

/**
 * Resolve a trip location `photo_url` for `<img>` / PhotoSwipe (R2 key, absolute URL, or Google media).
 */
export function resolveTripLocationPhotoUrl(
  photoUrl: string | null | undefined,
): string | null {
  if (photoUrl == null) {
    return null;
  }
  const trimmed = photoUrl.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    const proxied = proxiedUrlFromGoogleMediaUrl(trimmed);
    if (proxied) {
      return proxied;
    }
    return trimmed;
  }
  const resolved = getR2PublicUrl(trimmed);
  if (/^https?:\/\//i.test(resolved)) {
    return resolved;
  }
  return null;
}
