"use client";

import CategoryFilters from "@/components/CategoryFilters";
import MenuCard from "@/components/MenuCard";
import MenuFooter from "@/components/MenuFooter";
import { MenuGridSkeleton } from "@/components/MenuCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useMenuFilterStore } from "@/hooks/useMenuFilterStore";
import { SearchX } from "lucide-react";

export default function MenuPage() {
  const { data, isLoading, isError } = useMenuItems();
  // `search` drives the empty-state copy; `setSearch` is called inside
  // <SearchBar> via the store — no need to destructure it here.
  const search = useMenuFilterStore((s) => s.search);
  const setSearch = useMenuFilterStore((s) => s.setSearch);

  if (isError) {
    return <p className="text-center mt-20">Failed to load menu.</p>;
  }

  return (
    <>
      <main className="space-y-5 max-w-7xl mx-auto px-6 py-8">
        <SearchBar />
        <CategoryFilters />

        {isLoading ? (
          /* ── Loading skeleton — replaces the old full-page <Loader /> ── */
          <MenuGridSkeleton count={8} />
        ) : data.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center">
              <SearchX className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No items found
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {search
                ? `No results for "${search}". Try a different search term or clear the filter.`
                : "No items available in this category right now."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* ── Cards Grid ── */
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <MenuFooter />
    </>
  );
}
