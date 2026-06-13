"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/types";

interface ConsumeFormProps {
  onSubmit: (formData: FormData) => void;
  currentQuantity: number;
  unit: string;
  vehicles: Vehicle[];
}

export function ConsumeForm({ onSubmit, currentQuantity, unit, vehicles }: ConsumeFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-900"
        >
          Amount to Use <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          min="1"
          max={currentQuantity}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Available: <span className="font-medium text-gray-900">{currentQuantity} {unit}</span>
        </p>
      </div>

      <div>
        <label
          htmlFor="vehicle_id"
          className="block text-sm font-medium text-gray-900"
        >
          Vehicle (Optional)
        </label>
        <select
          id="vehicle_id"
          name="vehicle_id"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate_number}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-900"
        >
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Oil change for vehicle"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
        >
          Use Item
        </button>
      </div>
    </form>
  );
}




