"use client";

import { useState } from "react";
import { toggleFavorite } from "@/app/listings/actions";

export function CardFavoriteButton({
  listingId,
  initialFavorited,
}: {
  listingId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setFavorited(!favorited);
    const result = await toggleFavorite(listingId);
    if (result.error) {
      setFavorited(favorited);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-black/50 disabled:opacity-50"
      aria-label={favorited ? "Remove from saved" : "Save listing"}
    >
      <svg
        className={`h-4 w-4 transition-colors ${favorited ? "fill-red-500 text-red-500" : "text-white"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        fill={favorited ? "currentColor" : "none"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
