"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Trip, TripGalleryImage } from "@gotrippin/core";

import AuroraBackground from "@/components/effects/aurora-background";
import { TripGallery } from "@/components/trips/trip-gallery";
import { useTripRealtimeSync } from "@/hooks";
import { resolveTripCoverUrl } from "@/lib/r2-public";
import { tripCoverStorageKey } from "@/lib/trip-cover-key";

export default function GalleryPageClient({
  trip,
  shareCode,
  initialGallery,
}: {
  trip: Trip;
  shareCode: string;
  initialGallery: TripGalleryImage[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [tripFromSetCover, setTripFromSetCover] = useState<Trip | null>(null);

  useTripRealtimeSync(trip.id);

  const displayTrip = tripFromSetCover ?? trip;
  const coverImageUrl = resolveTripCoverUrl(displayTrip);

  useEffect(() => {
    if (!tripFromSetCover) {
      return;
    }
    const a = tripCoverStorageKey(tripFromSetCover);
    const b = tripCoverStorageKey(trip);
    if (a !== null && b !== null && a === b) {
      setTripFromSetCover(null);
    }
  }, [trip, tripFromSetCover]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AuroraBackground />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="z-20 shrink-0 border-b border-border/40 bg-background/20 backdrop-blur-xl dark:border-white/[0.08] dark:bg-black/25">
          <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => router.push(`/trips/${shareCode}`)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/80 text-foreground transition-colors hover:bg-muted"
              aria-label={t("trip_gallery.back_to_trip", {
                defaultValue: "Back to trip",
              })}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">
                {t("trip_overview.gallery_title", {
                  defaultValue: "Trip gallery",
                })}
              </h1>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-muted-foreground sm:text-xs">
                {t("trip_gallery.page_subtitle", {
                  defaultValue:
                    "Upload photos, full-screen zoom, set the trip background, or add from Unsplash — shared with everyone on the trip.",
                })}
              </p>
            </div>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15"
              aria-hidden
            >
              <Images className="h-4 w-4 text-primary" />
            </div>
          </div>
        </header>

        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-4 pb-safe-bottom sm:px-6 sm:py-5">
          <TripGallery
            trip={displayTrip}
            tripId={trip.id}
            initialImages={initialGallery}
            coverImageUrl={coverImageUrl ?? null}
            onCoverPersistedFromApi={setTripFromSetCover}
          />
        </div>
      </div>
    </main>
  );
}
