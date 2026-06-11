"use client";

import { useState, useEffect } from "react";

interface NetworkRatingProps {
  networkSlug: string;
}

interface Review {
  id: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
}

export default function NetworkRating({ networkSlug }: NetworkRatingProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRating() {
      try {
        // Check if Supabase is available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          // Try to fetch from Supabase
          const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
          const supabase = createClientComponentClient();
          
          const { data, error } = await supabase
            .from('reviews')
            .select('overall_rating')
            .eq('network_slug', networkSlug);

          if (!error && data && data.length > 0) {
            const avg = data.reduce((sum, review) => sum + review.overall_rating, 0) / data.length;
            setAverageRating(+(avg).toFixed(1));
            setTotalReviews(data.length);
          } else {
            // Fallback to no reviews
            setAverageRating(0);
            setTotalReviews(0);
          }
        } else {
          // No Supabase available, use fallback
          setAverageRating(0);
          setTotalReviews(0);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
        // Fallback to no reviews
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    }

    fetchRating();
  }, [networkSlug]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-sm">No reviews</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-900">{averageRating}</span>
      <span className="text-xs text-gray-500">({totalReviews})</span>
    </div>
  );
} 