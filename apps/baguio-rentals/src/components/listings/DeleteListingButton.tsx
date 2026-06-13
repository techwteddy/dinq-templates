"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteListing } from "@/app/listings/actions";

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteListing(listingId);
    if (!result.error) {
      router.push("/my-listings");
    }
    setLoading(false);
  };

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-stone px-4 py-3 text-sm text-bark-light hover:bg-mist"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
    >
      Delete
    </button>
  );
}
