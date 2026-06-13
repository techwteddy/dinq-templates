"use client";

import { Reservation } from "@/lib/types";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { isPast, isFuture } from "date-fns";
import { formatGMT8, toGMT8, nowGMT8 } from "@/lib/date-utils";

interface ReservationDetailViewProps {
  reservation: Reservation;
  onEdit?: () => void;
}

export function ReservationDetailView({ reservation, onEdit }: ReservationDetailViewProps) {
  const startTime = toGMT8(reservation.start_time);
  const endTime = toGMT8(reservation.end_time);
  const now = nowGMT8();
  const isUpcoming = isFuture(startTime);
  const isCompleted = isPast(endTime);
  const isActive = !isUpcoming && !isCompleted;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end space-x-2 pb-4 border-b">
        <Link
          href={`/dashboard/reservations/${reservation.id}/print`}
          target="_blank"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
        >
          Print Trip Ticket
        </Link>
        {onEdit ? (
          <button
            onClick={onEdit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Edit
          </button>
        ) : (
          <Link
            href={`/dashboard/reservations/${reservation.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Edit
          </Link>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Reservation Information
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Department Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.department_name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Requestor Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.requestor_name}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Purpose
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.purpose}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Departure Area
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.departure_area}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Destination
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.destination}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Start Time
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatGMT8(reservation.start_time, "MMMM dd, yyyy 'at' h:mm a")}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                End Time
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatGMT8(reservation.end_time, "MMMM dd, yyyy 'at' h:mm a")}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Status
              </dt>
              <dd className="mt-1">
                {isActive && (
                  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Active
                  </span>
                )}
                {isUpcoming && (
                  <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Upcoming
                  </span>
                )}
                {isCompleted && (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Completed
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Vehicle & Driver Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vehicle & Driver
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Vehicle
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.vehicle ? (
                  <div>
                    <div className="font-medium">{reservation.vehicle.plate_number}</div>
                    {reservation.vehicle.vehicle_type && (
                      <div className="text-xs text-gray-500">
                        {reservation.vehicle.vehicle_type} - Capacity: {reservation.vehicle.capacity}
                      </div>
                    )}
                    <StatusBadge status={reservation.vehicle.status} type="vehicle" />
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Not assigned</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Driver
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {reservation.driver ? (
                  <div>
                    <div className="font-medium">{reservation.driver.name}</div>
                    <div className="text-xs text-gray-500">
                      License: {reservation.driver.license_no}
                    </div>
                    <StatusBadge status={reservation.driver.status} type="driver" />
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Not assigned</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Approval Letter */}
      {reservation.approval_letter_url && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Approval Letter
            </h3>
            <div>
              <a
                href={reservation.approval_letter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Approval Letter
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

