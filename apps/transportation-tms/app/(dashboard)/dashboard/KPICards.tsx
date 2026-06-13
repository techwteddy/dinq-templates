"use client";

import Link from "next/link";

interface KPICardsProps {
  vehicleStats: {
    available: number;
    total: number;
  };
  driverStats: {
    available: number;
    total: number;
  };
  activeTripsCount: number;
  lowStockCount: number;
}

export default function KPICards({
  vehicleStats,
  driverStats,
  activeTripsCount,
  lowStockCount,
}: KPICardsProps) {
  const vehicleHealthy = vehicleStats.available / vehicleStats.total >= 0.5;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Vehicles Available */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className={`h-6 w-6 ${
                  vehicleHealthy ? "text-green-600" : "text-red-600"
                }`}
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
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Vehicles Available
                </dt>
                <dd>
                  <div className="text-3xl font-semibold text-gray-900">
                    {vehicleStats.available} / {vehicleStats.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              href="/dashboard/vehicles"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              View all vehicles
            </Link>
          </div>
        </div>
      </div>

      {/* Active Trips */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
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
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Trips Now
                </dt>
                <dd>
                  <div className="text-3xl font-semibold text-gray-900">
                    {activeTripsCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              href="/dashboard/reservations"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              View all reservations
            </Link>
          </div>
        </div>
      </div>

      {/* Drivers Available */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Drivers Available
                </dt>
                <dd>
                  <div className="text-3xl font-semibold text-gray-900">
                    {driverStats.available} / {driverStats.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              href="/dashboard/drivers"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              View all drivers
            </Link>
          </div>
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {lowStockCount > 0 ? (
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
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
              )}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Inventory Alerts
                </dt>
                <dd>
                  <div
                    className={`text-3xl font-semibold ${
                      lowStockCount > 0 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {lowStockCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              href="/dashboard/inventory"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              View inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




