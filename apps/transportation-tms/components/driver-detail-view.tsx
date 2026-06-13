"use client";

import { Driver } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";

interface DriverDetailViewProps {
  driver: Driver;
}

export function DriverDetailView({ driver }: DriverDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Driver Information
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Driver Name
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 flex items-center">
                <div className="mr-3">
                  <Avatar name={driver.name} size="md" />
                </div>
                {driver.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                License Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {driver.license_no}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Status
              </dt>
              <dd className="mt-1">
                <StatusBadge status={driver.status} type="driver" />
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Created At
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(driver.created_at), "MMMM dd, yyyy")}
              </dd>
            </div>

            {driver.updated_at && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(driver.updated_at), "MMMM dd, yyyy")}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Driver Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* License Document */}
            <div>
              <dt className="text-sm font-medium text-gray-900 mb-2">
                Driver&apos;s License
              </dt>
              {driver.license_image_url ? (
                <div className="mt-2">
                  <img
                    src={driver.license_image_url}
                    alt="Driver's License"
                    className="w-full h-64 object-contain border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <a
                    href={driver.license_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              ) : (
                <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-sm text-gray-500">No license document uploaded</p>
                </div>
              )}
            </div>

            {/* Driver Photo */}
            <div>
              <dt className="text-sm font-medium text-gray-900 mb-2">
                Driver&apos;s Photo
              </dt>
              {driver.photo_url ? (
                <div className="mt-2">
                  <img
                    src={driver.photo_url}
                    alt="Driver Photo"
                    className="w-full h-64 object-contain border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <a
                    href={driver.photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              ) : (
                <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-sm text-gray-500">No photo uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

