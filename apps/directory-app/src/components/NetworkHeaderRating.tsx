"use client";

import { useState, useEffect } from "react";

interface NetworkHeaderRatingProps {
  networkSlug: string;
  compact?: boolean;
}

export default function NetworkHeaderRating({ networkSlug, compact = false }: NetworkHeaderRatingProps) {
  const [ratings, setRatings] = useState({
    overallAvg: 0,
    offersAvg: 0,
    payoutAvg: 0,
    trackingAvg: 0,
    supportAvg: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
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
            .select('overall_rating, ease_of_use, payment_speed, support_quality')
            .eq('network_slug', networkSlug)
            .eq('status', 'approved');

          if (!error && data && data.length > 0) {
            console.log('Reviews found for network:', networkSlug, 'Count:', data.length);
            console.log('Sample review data:', data[0]);
            
            // Filter out reviews with null/undefined ratings
            const validReviews = data.filter(review => 
              review.overall_rating != null && 
              review.overall_rating > 0
            );
            
            console.log('Valid reviews with ratings:', validReviews.length);
            
            if (validReviews.length > 0) {
              const totalOverall = validReviews.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
              const totalEaseOfUse = validReviews.reduce((sum, review) => sum + (review.ease_of_use || 0), 0);
              const totalPaymentSpeed = validReviews.reduce((sum, review) => sum + (review.payment_speed || 0), 0);
              const totalSupportQuality = validReviews.reduce((sum, review) => sum + (review.support_quality || 0), 0);
              
              const averageOverall = totalOverall / validReviews.length;
              const averageEaseOfUse = totalEaseOfUse / validReviews.length;
              const averagePaymentSpeed = totalPaymentSpeed / validReviews.length;
              const averageSupportQuality = totalSupportQuality / validReviews.length;
              
              console.log('Calculated averages:', {
                overall: averageOverall,
                easeOfUse: averageEaseOfUse,
                paymentSpeed: averagePaymentSpeed,
                supportQuality: averageSupportQuality
              });
              
              setRatings({
                overallAvg: +(averageOverall).toFixed(1),
                offersAvg: +(averageEaseOfUse).toFixed(1),
                payoutAvg: +(averagePaymentSpeed).toFixed(1),
                trackingAvg: +(averageSupportQuality).toFixed(1),
                supportAvg: +(averageSupportQuality).toFixed(1)
              });
            } else {
              console.log('No valid reviews with ratings found');
              setRatings({
                overallAvg: 0,
                offersAvg: 0,
                payoutAvg: 0,
                trackingAvg: 0,
                supportAvg: 0
              });
            }
          } else {
            console.log('No reviews found or error:', error);
            // Fallback to default ratings
            setRatings({
              overallAvg: 0,
              offersAvg: 0,
              payoutAvg: 0,
              trackingAvg: 0,
              supportAvg: 0
            });
          }
        } else {
          // No Supabase available, use fallback
          setRatings({
            overallAvg: 0,
            offersAvg: 0,
            payoutAvg: 0,
            trackingAvg: 0,
            supportAvg: 0
          });
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
        // Fallback to default ratings
        setRatings({
          overallAvg: 0,
          offersAvg: 0,
          payoutAvg: 0,
          trackingAvg: 0,
          supportAvg: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [networkSlug]);

  if (loading) {
    return compact ? <span className="text-xs">-</span> : null;
  }

  // Only show compact, text-style rating or nothing
  return compact ? (
    <span className="inline-flex items-center gap-1 text-base font-bold text-[#bfa14a] bg-transparent p-0 m-0">
      {ratings.overallAvg > 0 ? ratings.overallAvg : (loading ? '-' : '0')}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#bfa14a" className="w-5 h-5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    </span>
  ) : null;
} 