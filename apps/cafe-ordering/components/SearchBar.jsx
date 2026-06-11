"use client";

import { Search, X } from "lucide-react";
import { useMenuFilterStore } from "@/hooks/useMenuFilterStore";

export function SearchBar() {
  const search = useMenuFilterStore((s) => s.search);
  const setSearch = useMenuFilterStore((s) => s.setSearch);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white rounded-full pl-4 pr-10 py-2 text-base outline-none border border-gray-200 focus:border-orange-400 transition-colors"
        placeholder="Search menu item..."
      />

      {search ? (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      ) : (
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      )}
    </div>
  );
}