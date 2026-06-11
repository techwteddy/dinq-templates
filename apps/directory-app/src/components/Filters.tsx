"use client";

import { Listbox } from "@headlessui/react";
import { useState } from "react";

interface FiltersProps {
  categories: string[];
  countries: string[];
  selectedCategory: string;
  selectedCountries: string[];
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onCountriesChange: (countries: string[]) => void;
  onSearchChange: (term: string) => void;
}

export default function Filters({
  categories,
  countries,
  selectedCategory,
  selectedCountries,
  searchTerm,
  onCategoryChange,
  onCountriesChange,
  onSearchChange
}: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Networks
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Listbox value={selectedCategory} onChange={onCategoryChange}>
            <div className="relative">
              <Listbox.Button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                {categories.map((category) => (
                  <Listbox.Option
                    key={category}
                    value={category}
                    className={({ active }) =>
                      `px-3 py-2 cursor-pointer ${active ? "bg-blue-100 text-blue-700" : "text-gray-900"}`
                    }
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Countries Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Countries
          </label>
          <Listbox value={selectedCountries} onChange={onCountriesChange} multiple>
            <div className="relative">
              <Listbox.Button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                {selectedCountries.length === 0 
                  ? 'All Countries' 
                  : selectedCountries.length === 1 
                    ? selectedCountries[0] 
                    : `${selectedCountries.length} countries selected`
                }
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                {countries.map((country) => (
                  <Listbox.Option
                    key={country}
                    value={country}
                    className={({ active }) =>
                      `px-3 py-2 cursor-pointer ${active ? "bg-blue-100 text-blue-700" : "text-gray-900"}`
                    }
                  >
                    {country}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
} 