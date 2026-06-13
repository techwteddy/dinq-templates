"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

interface VehicleWithDriver {
  id: string;
  plate_number: string;
  capacity: number;
  assigned_driver_id?: string | null;
  assigned_driver?: {
    id: string;
    name: string;
    license_no: string;
  } | null;
}

interface ReservationFormProps {
  onSubmit: (formData: FormData) => void;
  availableVehicles: Array<VehicleWithDriver>;
  availableDrivers: Array<{ id: string; name: string; license_no: string }>;
  defaultValues?: {
    department_name?: string;
    requestor_name?: string;
    purpose?: string;
    departure_area?: string;
    destination?: string;
    start_time?: string;
    end_time?: string;
    vehicle_id?: string;
    driver_id?: string;
    approval_letter_url?: string | null;
  };
}

export function ReservationForm({
  onSubmit,
  availableVehicles,
  availableDrivers,
  defaultValues,
}: ReservationFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(defaultValues?.vehicle_id || "");
  const [selectedDriverId, setSelectedDriverId] = useState(defaultValues?.driver_id || "");

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    setSelectedVehicleId(vehicleId);
    
    // Auto-select assigned driver if vehicle has one
    const vehicle = availableVehicles.find((v) => v.id === vehicleId);
    if (vehicle?.assigned_driver_id) {
      setSelectedDriverId(vehicle.assigned_driver_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add file if selected
    if (selectedFile) {
      formData.set("approval_letter", selectedFile);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="department_name"
            className="block text-sm font-medium text-gray-900"
          >
            Department Name
          </label>
          <input
            type="text"
            id="department_name"
            name="department_name"
            defaultValue={defaultValues?.department_name}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="requestor_name"
            className="block text-sm font-medium text-gray-900"
          >
            Requestor Name
          </label>
          <input
            type="text"
            id="requestor_name"
            name="requestor_name"
            defaultValue={defaultValues?.requestor_name}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="purpose"
          className="block text-sm font-medium text-gray-900"
        >
          Purpose
        </label>
        <textarea
          id="purpose"
          name="purpose"
          rows={3}
          defaultValue={defaultValues?.purpose}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="departure_area"
            className="block text-sm font-medium text-gray-900"
          >
            Departure Area
          </label>
          <input
            type="text"
            id="departure_area"
            name="departure_area"
            defaultValue={defaultValues?.departure_area}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-900"
          >
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            defaultValue={defaultValues?.destination}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start_time"
            className="block text-sm font-medium text-gray-900"
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            defaultValue={defaultValues?.start_time}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="end_time"
            className="block text-sm font-medium text-gray-900"
          >
            End Time
          </label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            defaultValue={defaultValues?.end_time}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="vehicle_id"
            className="block text-sm font-medium text-gray-900"
          >
            Vehicle
          </label>
          <select
            id="vehicle_id"
            name="vehicle_id"
            value={selectedVehicleId}
            onChange={handleVehicleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a vehicle</option>
            {availableVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_number} (Capacity: {vehicle.capacity})
                {vehicle.assigned_driver && ` - Driver: ${vehicle.assigned_driver.name}`}
              </option>
            ))}
          </select>
          {selectedVehicleId && availableVehicles.find(v => v.id === selectedVehicleId)?.assigned_driver && (
            <p className="mt-1 text-xs text-blue-600">
              This vehicle&apos;s assigned driver has been auto-selected. You can change if needed.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="driver_id"
            className="block text-sm font-medium text-gray-900"
          >
            Driver
          </label>
          <select
            id="driver_id"
            name="driver_id"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a driver</option>
            {availableDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.license_no})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FileUpload
          onFileSelect={setSelectedFile}
          existingFileUrl={defaultValues?.approval_letter_url}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {defaultValues ? "Update Reservation" : "Create Reservation"}
        </button>
      </div>
    </form>
  );
}

