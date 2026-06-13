"use client";

import { Reservation } from "@/lib/types";
import Link from "next/link";
import { formatGMT8 } from "@/lib/date-utils";

interface DepartingTodayProps {
  departures: Reservation[];
}

export default function DepartingToday({ departures }: DepartingTodayProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Departing Today
        </h3>

        {departures.length === 0 ? (
          <p className="text-sm text-gray-500">No departures scheduled for today.</p>
        ) : (
          <div className="space-y-3">
            {departures.map((departure) => (
              <div
                key={departure.id}
                className="flex items-center justify-between border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="text-lg font-bold text-blue-900">
                        {formatGMT8(departure.start_time, "h:mm a")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {departure.vehicle?.plate_number || "No vehicle"} 
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        Driver: {departure.driver?.name || "Not assigned"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {departure.departure_area} → {departure.destination}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/reservations/${departure.id}/print`}
                    target="_blank"
                    className="inline-flex items-center p-2 border border-transparent rounded text-blue-600 hover:bg-blue-100"
                    title="Print Ticket"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                  </Link>
                  <Link
                    href={`/dashboard/reservations/${departure.id}`}
                    className="inline-flex items-center p-2 border border-transparent rounded text-blue-600 hover:bg-blue-100"
                    title="View Details"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

