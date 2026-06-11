"use client";

import { useEffect, useState } from "react";
import offers from '@/data/offers.json';

interface NetworkStatsProps {
  networkSlug: string;
}

export default function NetworkStats({ networkSlug }: NetworkStatsProps) {
  const [stats, setStats] = useState({
    reviewCount: 0,
    offersCount: 0,
    paymentSpeed: 0,
    supportQuality: 0,
    overallRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Count offers for this network
        const networkOffers = offers.filter(offer => 
          offer.network.toLowerCase().includes(networkSlug.toLowerCase()) ||
          networkSlug.toLowerCase().includes(offer.network.toLowerCase())
        );

        // Check if Supabase is available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          // Try to fetch from Supabase
          const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
          const supabase = createClientComponentClient();
          
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('network_slug', networkSlug);

          if (!error && data && data.length > 0) {
            const totalPaymentSpeed = data.reduce((sum, review) => sum + (review.payment_speed || 0), 0);
            const totalSupportQuality = data.reduce((sum, review) => sum + (review.support_quality || 0), 0);
            const totalOverallRating = data.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
            
            const averagePaymentSpeed = totalPaymentSpeed / data.length;
            const averageSupportQuality = totalSupportQuality / data.length;
            const averageOverallRating = totalOverallRating / data.length;
            
            setStats({
              reviewCount: data.length,
              offersCount: networkOffers.length,
              paymentSpeed: +(averagePaymentSpeed).toFixed(1),
              supportQuality: +(averageSupportQuality).toFixed(1),
              overallRating: +(averageOverallRating).toFixed(1)
            });
          } else {
            // Fallback to default stats
            setStats({
              reviewCount: 0,
              offersCount: networkOffers.length,
              paymentSpeed: 0,
              supportQuality: 0,
              overallRating: 0
            });
          }
        } else {
          // No Supabase available, use fallback
          setStats({
            reviewCount: 0,
            offersCount: networkOffers.length,
            paymentSpeed: 0,
            supportQuality: 0,
            overallRating: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default stats
        const networkOffers = offers.filter(offer => 
          offer.network.toLowerCase().includes(networkSlug.toLowerCase()) ||
          networkSlug.toLowerCase().includes(offer.network.toLowerCase())
        );
        setStats({
          reviewCount: 0,
          offersCount: networkOffers.length,
          paymentSpeed: 0,
          supportQuality: 0,
          overallRating: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [networkSlug]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Reviews</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Offers</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Payment</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Support</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-1 overflow-x-auto w-full pb-1">
      {/* Reviews */}
      <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">
        Reviews <span className="ml-1 text-[#e57373] font-bold">{stats.reviewCount}</span>
      </span>
      {/* Offers */}
      <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">
        Offers <span className="ml-1 text-[#e57373] font-bold">{stats.offersCount}</span>
      </span>
      {/* Payment */}
      <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">
        Payment <span className="ml-1 text-[#e57373] font-bold">{stats.paymentSpeed > 0 ? stats.paymentSpeed : '-'}</span>
      </span>
      {/* Support */}
      <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">
        Support <span className="ml-1 text-[#e57373] font-bold">{stats.supportQuality > 0 ? stats.supportQuality : '-'}</span>
      </span>
    </div>
  );
} 