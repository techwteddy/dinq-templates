"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startConversation } from "@/app/messages/actions";

export function MessageOwnerButton({
  listingId,
  ownerId,
}: {
  listingId: string;
  ownerId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    const result = await startConversation(listingId, ownerId);
    if (result.conversationId) {
      router.push(`/messages/${result.conversationId}`);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
    >
      {loading ? "Opening chat..." : "Message Owner"}
    </button>
  );
}
