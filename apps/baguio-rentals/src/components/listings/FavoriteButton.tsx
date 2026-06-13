"use client";

import { useState } from "react";
import { toggleFavorite } from "@/app/listings/actions";

export function FavoriteButton({
  listingId,
  initialFavorited,
}: {
  listingId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    setFavorited(!favorited); // Optimistic
    const result = await toggleFavorite(listingId);
    if (result.error) {
      setFavorited(favorited); // Revert
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
    >
      <svg
        className={`h-6 w-6 ${favorited ? "fill-red-500 text-red-500" : "text-gray-400"}`}
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
