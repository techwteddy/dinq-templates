import type { Availability } from "@/lib/types/database";

const STATUS_CONFIG = {
  available: { label: "Available", bg: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  reserved: { label: "Reserved", bg: "bg-amber-50 text-amber-700 ring-amber-200" },
  occupied: { label: "Occupied", bg: "bg-red-50 text-red-700 ring-red-200" },
} as const;

export function AvailabilityBadge({ status }: { status: Availability }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 backdrop-blur-sm ${config.bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === "available" ? "bg-emerald-500" :
        status === "reserved" ? "bg-amber-500" : "bg-red-500"
      }`} />
      {config.label}
    </span>
  );
}
