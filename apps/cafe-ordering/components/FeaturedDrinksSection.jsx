"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFeaturedItems } from "@/hooks/useFeaturedItems";

export default function FeaturedDrinksSection() {
  const { data: items, isLoading, isError } = useFeaturedItems();

  return (
    <section className="max-w-7xl mx-auto px-6 space-y-6 mb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Featured Drinks
        </h2>
        <Link
          href="/menu"
          className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isError || !items?.length ? (
          <p className="col-span-4 text-center text-sm text-gray-400 py-8">
            Featured drinks unavailable right now.
          </p>
        ) : (
          items.map((item) => <FeaturedDrinkCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}

function FeaturedDrinkCard({ item }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/menu" className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full p-3">
        {/* Image with padding + rounded corners */}
        <div className="relative h-[180px] rounded-xl overflow-hidden bg-gray-100">
          {item.image_url && !imgError ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
              ☕
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-3 px-1 pb-1 space-y-1">
          <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">
            ${Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm w-full animate-pulse p-3">
      <div className="h-[180px] rounded-xl bg-gray-200" />
      <div className="pt-3 px-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
