"use client";

import { Vehicle } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";

interface VehicleDetailViewProps {
  vehicle: Vehicle;
}

export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vehicle Information
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Plate Number
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {vehicle.plate_number}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Vehicle Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {vehicle.vehicle_type || "Not specified"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Capacity
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {vehicle.capacity} passengers
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Status
              </dt>
              <dd className="mt-1">
                <StatusBadge status={vehicle.status} type="vehicle" />
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Assigned Driver
              </dt>
              <dd className="mt-1">
                {vehicle.assigned_driver ? (
                  <div className="flex items-center">
                    {vehicle.assigned_driver.photo_url ? (
                      <img
                        src={vehicle.assigned_driver.photo_url}
                        alt={vehicle.assigned_driver.name}
                        className="h-8 w-8 rounded-full object-cover border border-gray-200 mr-2"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                        {vehicle.assigned_driver.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.assigned_driver.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        License: {vehicle.assigned_driver.license_no}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">No driver assigned</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Created At
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(vehicle.created_at), "MMMM dd, yyyy")}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(vehicle.updated_at), "MMMM dd, yyyy")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vehicle Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OR Document */}
            <div>
              <dt className="text-sm font-medium text-gray-900 mb-2">
                Official Receipt (OR)
              </dt>
              {vehicle.or_image_url ? (
                <div className="mt-2">
                  <img
                    src={vehicle.or_image_url}
                    alt="Official Receipt"
                    className="w-full h-64 object-contain border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <a
                    href={vehicle.or_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              ) : (
                <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-sm text-gray-500">No OR document uploaded</p>
                </div>
              )}
            </div>

            {/* CR Document */}
            <div>
              <dt className="text-sm font-medium text-gray-900 mb-2">
                Certificate of Registration (CR)
              </dt>
              {vehicle.cr_image_url ? (
                <div className="mt-2">
                  <img
                    src={vehicle.cr_image_url}
                    alt="Certificate of Registration"
                    className="w-full h-64 object-contain border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <a
                    href={vehicle.cr_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              ) : (
                <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-sm text-gray-500">No CR document uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

