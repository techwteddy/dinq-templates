// Placeholder card shown while menu items are loading.
// Mirrors the exact dimensions of MenuCard so the layout doesn't shift
// when real content arrives.
export function MenuCardSkeleton() {
  return (
    <div className="rounded-2xl shadow-sm border bg-white p-4 flex flex-col animate-pulse">
      {/* Image area */}
      <div className="aspect-[4/3] rounded-xl bg-gray-200 mb-3" />

      {/* Name */}
      <div className="h-3.5 w-3/4 rounded bg-gray-200" />

      {/* Description lines */}
      <div className="mt-2 space-y-1.5">
        <div className="h-2.5 w-full rounded bg-gray-200" />
        <div className="h-2.5 w-5/6 rounded bg-gray-200" />
      </div>

      {/* Price + badge row */}
      <div className="flex items-center justify-between mt-3">
        <div className="h-3 w-12 rounded bg-gray-200" />
        <div className="h-4 w-16 rounded-full bg-gray-200" />
      </div>

      {/* Button */}
      <div className="mt-4 h-9 rounded-full bg-gray-200" />
    </div>
  );
}

// Renders a grid of N skeleton cards — drop this in wherever the real
// grid would appear during isLoading.
export function MenuGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}
