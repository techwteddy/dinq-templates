import { getReservation } from "@/app/actions/reservations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGMT8 } from "@/lib/date-utils";

export default async function ReservationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const reservation = await getReservation(params.id);

  if (!reservation) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reservation Details</h1>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/reservations/${reservation.id}/print`}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Print Trip Ticket
          </Link>
          <Link
            href={`/dashboard/reservations/${reservation.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
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
                <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatGMT8(reservation.start_time, "MMMM dd, yyyy 'at' h:mm a")}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">End Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatGMT8(reservation.end_time, "MMMM dd, yyyy 'at' h:mm a")}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {reservation.vehicle?.plate_number || "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Driver</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {reservation.driver?.name || "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {reservation.approval_letter_url && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Approval Letter
              </h3>
              <div className="flex items-center space-x-4">
                <a
                  href={reservation.approval_letter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  View Approval Letter
                </a>
                <a
                  href={reservation.approval_letter_url}
                  download
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



