import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeGooglePlacePhotoResourceName,
  parseGooglePlacesPhotoMediaPath,
  placeIdFromGooglePhotoResourceName,
} from "@/lib/place-photo-display";
import {
  fetchFreshPlacePhotoResourceName,
  fetchPlacePhotoMedia,
  googlePlacesApiKeyForServer,
} from "@/lib/googlePlaces";

/**
 * Same-origin proxy for Google Places Photo (New) media.
 * Sends Referer + X-Goog-Api-Key for referrer-restricted keys on Vercel.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const nameRaw = requestUrl.searchParams.get("name")?.trim();
  if (!nameRaw) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  let resourceName = nameRaw.startsWith("http")
    ? parseGooglePlacesPhotoMediaPath(nameRaw)
    : normalizeGooglePlacePhotoResourceName(nameRaw);
  if (!resourceName) {
    return NextResponse.json({ error: "Invalid photo name" }, { status: 400 });
  }

  if (!googlePlacesApiKeyForServer()) {
    return NextResponse.json({ error: "Places API not configured" }, { status: 503 });
  }

  let maxHeightPx = 900;
  const maxRaw = requestUrl.searchParams.get("maxHeightPx");
  if (maxRaw != null) {
    const n = Number.parseInt(maxRaw, 10);
    if (Number.isFinite(n) && n > 0 && n <= 4800) {
      maxHeightPx = n;
    }
  }

  const placeIdParam = requestUrl.searchParams.get("placeId")?.trim();
  const placeId =
    placeIdParam && placeIdParam.length > 0
      ? placeIdParam
      : placeIdFromGooglePhotoResourceName(resourceName);

  try {
    let upstreamRes = await fetchPlacePhotoMedia(resourceName, maxHeightPx);

    if (
      !upstreamRes.ok &&
      placeId &&
      (upstreamRes.status === 400 || upstreamRes.status === 404)
    ) {
      const freshName = await fetchFreshPlacePhotoResourceName(placeId);
      if (freshName && freshName !== resourceName) {
        resourceName = freshName;
        upstreamRes = await fetchPlacePhotoMedia(resourceName, maxHeightPx);
      }
    }

    if (!upstreamRes.ok) {
      console.error(
        "[api/places/photo] upstream",
        upstreamRes.status,
        resourceName.slice(0, 80),
        placeId ?? "",
      );
      const clientStatus =
        upstreamRes.status === 403
          ? 502
          : upstreamRes.status === 404 || upstreamRes.status === 400
            ? 404
            : 502;
      return NextResponse.json({ error: "Photo unavailable" }, { status: clientStatus });
    }

    const contentType = upstreamRes.headers.get("content-type") ?? "image/jpeg";
    const body = await upstreamRes.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err: unknown) {
    console.error("[api/places/photo] fetch failed", err);
    return NextResponse.json({ error: "Photo fetch failed" }, { status: 502 });
  }
}
