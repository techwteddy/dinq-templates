"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Network } from "@/data/networks";

interface NetworkFiltersProps {
  networks: Network[];
  onFilterChange: (filteredNetworks: Network[]) => void;
}

export default function NetworkFilters({ networks, onFilterChange }: NetworkFiltersProps) {
  const [trackingSoftware, setTrackingSoftware] = useState<string>("");
  const [paymentFrequency, setPaymentFrequency] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  
  // Use ref to store the latest onFilterChange function
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // Get unique values for filter options
  const trackingSoftwareOptions = Array.from(
    new Set(networks.map(n => n.tracking_software).filter(Boolean))
  );
  const paymentFrequencyOptions = Array.from(
    new Set(networks.map(n => n.payment_frequency).filter(Boolean))
  );
  const paymentMethodOptions = Array.from(
    new Set(networks.flatMap(n => n.payment_methods || []))
  );

  const applyFilters = useCallback(() => {
    let filtered = networks;

    if (trackingSoftware) {
      filtered = filtered.filter(n => n.tracking_software === trackingSoftware);
    }

    if (paymentFrequency) {
      filtered = filtered.filter(n => n.payment_frequency === paymentFrequency);
    }

    if (paymentMethod) {
      filtered = filtered.filter(n => 
        n.payment_methods?.includes(paymentMethod)
      );
    }

    onFilterChangeRef.current(filtered);
  }, [trackingSoftware, paymentFrequency, paymentMethod, networks]);

  const clearFilters = () => {
    setTrackingSoftware("");
    setPaymentFrequency("");
    setPaymentMethod("");
    onFilterChangeRef.current(networks);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Networks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tracking Software Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Software
          </label>
          <select
            value={trackingSoftware}
            onChange={(e) => {
              setTrackingSoftware(e.target.value);
            }}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Tracking Software</option>
            {trackingSoftwareOptions.map((software) => (
              <option key={software} value={software}>
                {software}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Frequency Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Frequency
          </label>
          <select
            value={paymentFrequency}
            onChange={(e) => {
              setPaymentFrequency(e.target.value);
            }}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Payment Frequencies</option>
            {paymentFrequencyOptions.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
            }}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Payment Methods</option>
            {paymentMethodOptions.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-amber-100 border border-amber-300 rounded-md hover:bg-amber-200 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
} 