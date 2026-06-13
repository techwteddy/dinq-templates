"use client";

import { useState } from "react";
import { updateAvailability } from "@/app/listings/actions";
import { AVAILABILITY_STATUSES } from "@/lib/utils/constants";
import type { Availability } from "@/lib/types/database";

export function AvailabilityToggle({
  listingId,
  currentStatus,
}: {
  listingId: string;
  currentStatus: Availability;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: Availability) => {
    setLoading(true);
    setStatus(newStatus);
    await updateAvailability(listingId, newStatus);
    setLoading(false);
  };

  const config = AVAILABILITY_STATUSES.find((s) => s.value === status);

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Availability)}
      disabled={loading}
      className={`rounded-lg border-0 px-3 py-1.5 text-xs font-medium ${config?.color} disabled:opacity-50`}
    >
      {AVAILABILITY_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
