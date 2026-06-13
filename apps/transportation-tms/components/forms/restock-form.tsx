"use client";

import { useState } from "react";

interface RestockFormProps {
  onSubmit: (formData: FormData) => void;
  currentQuantity: number;
  unit: string;
}

export function RestockForm({ onSubmit, currentQuantity, unit }: RestockFormProps) {
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
          Amount to Add <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          min="1"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Current stock: <span className="font-medium text-gray-900">{currentQuantity} {unit}</span>
        </p>
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
          placeholder="e.g., Restocked from supplier"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
        >
          Restock Item
        </button>
      </div>
    </form>
  );
}




