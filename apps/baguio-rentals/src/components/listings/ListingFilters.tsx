"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  PROPERTY_TYPES,
  BEDROOM_OPTIONS,
  BARANGAYS,
  SORT_OPTIONS,
} from "@/lib/utils/constants";

export function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/listings?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/listings");
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label htmlFor="filter-search" className="text-sm font-medium text-bark">Search</label>
        <input
          id="filter-search"
          type="text"
          placeholder="Search listings..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateFilter("q", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="filter-sort" className="text-sm font-medium text-bark">Sort By</label>
        <select
          id="filter-sort"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label htmlFor="filter-type" className="text-sm font-medium text-bark">Property Type</label>
        <select
          id="filter-type"
          value={searchParams.get("type") ?? ""}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label htmlFor="filter-beds" className="text-sm font-medium text-bark">Bedrooms</label>
        <select
          id="filter-beds"
          value={searchParams.get("beds") ?? ""}
          onChange={(e) => updateFilter("beds", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        >
          <option value="">Any</option>
          {BEDROOM_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label htmlFor="filter-min-price" className="text-sm font-medium text-bark">Min Price</label>
        <input
          id="filter-min-price"
          type="number"
          placeholder="0"
          defaultValue={searchParams.get("min_price") ?? ""}
          onChange={(e) => updateFilter("min_price", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>
      <div>
        <label htmlFor="filter-max-price" className="text-sm font-medium text-bark">Max Price</label>
        <input
          id="filter-max-price"
          type="number"
          placeholder="No limit"
          defaultValue={searchParams.get("max_price") ?? ""}
          onChange={(e) => updateFilter("max_price", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      {/* Barangay */}
      <div>
        <label htmlFor="filter-barangay" className="text-sm font-medium text-bark">Barangay</label>
        <select
          id="filter-barangay"
          value={searchParams.get("barangay") ?? ""}
          onChange={(e) => updateFilter("barangay", e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        >
          <option value="">All Barangays</option>
          {BARANGAYS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Pet Friendly */}
      <label className="flex items-center gap-2 text-sm text-bark">
        <input
          id="filter-pet"
          type="checkbox"
          checked={searchParams.get("pet_friendly") === "true"}
          onChange={(e) =>
            updateFilter("pet_friendly", e.target.checked ? "true" : "")
          }
          className="h-5 w-5 rounded border-gray-300 text-pine focus:ring-pine"
        />
        Pet-friendly only
      </label>

      {/* Parking */}
      <label className="flex items-center gap-2 text-sm text-bark">
        <input
          id="filter-parking"
          type="checkbox"
          checked={searchParams.get("parking") === "true"}
          onChange={(e) =>
            updateFilter("parking", e.target.checked ? "true" : "")
          }
          className="h-5 w-5 rounded border-gray-300 text-pine focus:ring-pine"
        />
        With parking
      </label>

      {/* Furnished */}
      <div>
        <label htmlFor="filter-furnished" className="block text-sm font-medium text-bark mb-1">Furnishing</label>
        <select
          id="filter-furnished"
          value={searchParams.get("furnished") || ""}
          onChange={(e) => updateFilter("furnished", e.target.value)}
          className="w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        >
          <option value="">Any</option>
          <option value="fully_furnished">Fully Furnished</option>
          <option value="semi_furnished">Semi-furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      <button
        onClick={clearFilters}
        className="w-full rounded-lg border border-stone px-4 py-2 text-sm font-medium text-bark-light hover:bg-mist"
      >
        Clear All Filters
      </button>
    </div>
  );
}
