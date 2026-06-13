"use client";

interface FleetHealthProps {
  vehicleStats: {
    total: number;
    available: number;
    maintenance: number;
    unavailable: number;
  };
}

export default function FleetHealth({ vehicleStats }: FleetHealthProps) {
  const getPercentage = (value: number) => {
    if (vehicleStats.total === 0) return 0;
    return Math.round((value / vehicleStats.total) * 100);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Fleet Health
        </h3>

        <div className="space-y-4">
          {/* Available */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Available</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {vehicleStats.available}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${getPercentage(vehicleStats.available)}%` }}
              ></div>
            </div>
          </div>

          {/* On Trip - We'll calculate this from active trips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">On Trip</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {vehicleStats.total - vehicleStats.available - vehicleStats.maintenance - vehicleStats.unavailable}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${getPercentage(
                    vehicleStats.total - vehicleStats.available - vehicleStats.maintenance - vehicleStats.unavailable
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Maintenance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Maintenance</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {vehicleStats.maintenance}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${getPercentage(vehicleStats.maintenance)}%` }}
              ></div>
            </div>
          </div>

          {/* Unavailable */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Unavailable</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {vehicleStats.unavailable}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${getPercentage(vehicleStats.unavailable)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {vehicleStats.maintenance > vehicleStats.total * 0.3 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              ⚠️ High maintenance count. Consider prioritizing repairs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}




