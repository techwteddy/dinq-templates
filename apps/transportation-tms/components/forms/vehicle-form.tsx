"use client";

import { useState, useEffect } from "react";
import { getDrivers } from "@/app/actions/drivers";
import type { Driver } from "@/lib/types";

interface VehicleFormProps {
  onSubmit: (formData: FormData) => void;
  defaultValues?: {
    plate_number?: string;
    vehicle_type?: string;
    capacity?: number;
    status?: string;
    assigned_driver_id?: string | null;
    or_image_url?: string | null;
    cr_image_url?: string | null;
  };
}

export function VehicleForm({ onSubmit, defaultValues }: VehicleFormProps) {
  const [orPreview, setOrPreview] = useState<string | null>(defaultValues?.or_image_url || null);
  const [crPreview, setCrPreview] = useState<string | null>(defaultValues?.cr_image_url || null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const allDrivers = await getDrivers();
        setDrivers(allDrivers);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      } finally {
        setLoadingDrivers(false);
      }
    }
    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  const handleOrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <label
          htmlFor="plate_number"
          className="block text-sm font-medium text-gray-900"
        >
          Plate Number
        </label>
        <input
          type="text"
          id="plate_number"
          name="plate_number"
          defaultValue={defaultValues?.plate_number}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="vehicle_type"
          className="block text-sm font-medium text-gray-900"
        >
          Vehicle Type <span className="text-red-500">*</span>
        </label>
        <select
          id="vehicle_type"
          name="vehicle_type"
          defaultValue={defaultValues?.vehicle_type || ""}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select vehicle type</option>
          <option value="Private Vehicle">Private Vehicle</option>
          <option value="Coaster">Coaster</option>
          <option value="Canter">Canter</option>
          <option value="Bus">Bus</option>
          <option value="Van">Van</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Truck">Truck</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="capacity"
          className="block text-sm font-medium text-gray-900"
        >
          Capacity (Passengers) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          defaultValue={defaultValues?.capacity}
          required
          min="1"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-900"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status || "available"}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="available">Available</option>
          <option value="maintenance">Maintenance</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="assigned_driver_id"
          className="block text-sm font-medium text-gray-900"
        >
          Assigned Driver
        </label>
        <select
          id="assigned_driver_id"
          name="assigned_driver_id"
          defaultValue={defaultValues?.assigned_driver_id || ""}
          disabled={loadingDrivers}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">No driver assigned</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name} - {driver.license_no}
              {driver.id === defaultValues?.assigned_driver_id ? " (Current)" : ""}
            </option>
          ))}
        </select>
        {loadingDrivers && (
          <p className="mt-1 text-xs text-gray-500">Loading drivers...</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="or_image"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Official Receipt (OR)
          </label>
          <input
            type="file"
            id="or_image"
            name="or_image"
            accept="image/*"
            onChange={handleOrChange}
            className="hidden"
          />
          <label
            htmlFor="or_image"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload OR Image
          </label>
          {(orPreview || defaultValues?.or_image_url) && (
            <div className="mt-2">
              <img
                src={orPreview || defaultValues?.or_image_url || ""}
                alt="OR Preview"
                className="h-48 w-full object-contain rounded border border-gray-300 bg-gray-50"
              />
              {defaultValues?.or_image_url && !orPreview && (
                <p className="mt-1 text-xs text-gray-500">Current document</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="cr_image"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Certificate of Registration (CR)
          </label>
          <input
            type="file"
            id="cr_image"
            name="cr_image"
            accept="image/*"
            onChange={handleCrChange}
            className="hidden"
          />
          <label
            htmlFor="cr_image"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload CR Image
          </label>
          {(crPreview || defaultValues?.cr_image_url) && (
            <div className="mt-2">
              <img
                src={crPreview || defaultValues?.cr_image_url || ""}
                alt="CR Preview"
                className="h-48 w-full object-contain rounded border border-gray-300 bg-gray-50"
              />
              {defaultValues?.cr_image_url && !crPreview && (
                <p className="mt-1 text-xs text-gray-500">Current document</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {defaultValues ? "Update Vehicle" : "Create Vehicle"}
        </button>
      </div>
    </form>
  );
}

