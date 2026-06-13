import { getReservations } from "@/app/actions/reservations";
import { getAvailableVehicles, getAvailableDrivers } from "@/app/actions/availability";
import { StatCard } from "@/components/ui/stat-card";
import ReservationsClient from "./ReservationsClient";
import { isPast, isFuture } from "date-fns";

export default async function ReservationsPage() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [reservations, availableVehicles, availableDrivers] = await Promise.all([
    getReservations(),
    getAvailableVehicles(), // Show all available vehicles initially
    getAvailableDrivers(), // Show all available drivers initially
  ]);

  const now = new Date();
  const upcomingCount = reservations.filter((r) => isFuture(new Date(r.start_time))).length;
  const activeCount = reservations.filter(
    (r) => !isFuture(new Date(r.start_time)) && !isPast(new Date(r.end_time))
  ).length;
  const completedCount = reservations.filter((r) => isPast(new Date(r.end_time))).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reservations"
          value={reservations.length}
          icon={
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
        <StatCard
          title="Active Now"
          value={activeCount}
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
        <StatCard
          title="Upcoming"
          value={upcomingCount}
          icon={
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon={
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <ReservationsClient 
        reservations={reservations}
        availableVehicles={availableVehicles}
        availableDrivers={availableDrivers}
      />
    </div>
  );
}



