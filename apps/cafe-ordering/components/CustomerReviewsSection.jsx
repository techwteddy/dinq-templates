"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const reviews = [
  {
    image:
      "https://ilctucufscggrvgbjwue.supabase.co/storage/v1/object/public/website-assets/reviews/user-1.jfif",
    name: "Emily Johnson",
    date: "April 2025",
    rating: 5,
    review:
      "Absolutely love this place. The coffee was rich and smooth, and the delivery was faster than I expected. Will definitely be ordering again!",
  },
  {
    image:
      "https://ilctucufscggrvgbjwue.supabase.co/storage/v1/object/public/website-assets/reviews/user-2.jfif",
    name: "Daniel Harris",
    date: "March 2025",
    rating: 5,
    review:
      "The ordering experience is so smooth and the drinks are consistently great. My go-to spot for a morning coffee fix.",
  },
  {
    image: null,
    name: "Sarah Tan",
    date: "March 2025",
    rating: 4,
    review:
      "Really enjoyed the Iced Latte — perfectly balanced. The app made ordering super easy. Would love to see more dessert options added.",
  },
  {
    image: null,
    name: "Reza Pratama",
    date: "February 2025",
    rating: 5,
    review:
      "Brew-Bite has become part of my daily routine. Great quality, friendly service, and the QR order pickup is a brilliant touch.",
  },
];

export default function CustomerReviewsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 my-10">
      <h2 className="text-3xl font-bold text-center mb-2">Customer Reviews</h2>
      <p className="text-center text-sm text-gray-400 mb-12">
        What our regulars say about us
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <ReviewCard key={r.name} {...r} />
        ))}
      </div>
    </section>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-orange-400 text-orange-400" : "text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ image, name, date, rating, review }) {
  // Initials fallback avatar when no image is available
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Top: avatar + name + date */}
      <div className="flex items-center gap-4 mb-4">
        {image ? (
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>

        <StarRating rating={rating} />
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-600 leading-relaxed">{review}</p>
    </div>
  );
}
