"use client";
import Hero from '@/components/Hero';
import NetworkFilters from '@/components/NetworkFilters';
import NetworkList from '@/components/NetworkList';
import OffersSection from '@/components/OffersSection';
import { getFeaturedNetworks, getAllNetworks } from '@/lib/networks-loader';
import { getAllOffers } from '@/lib/offers-loader';
import { useState, useEffect, useMemo } from 'react';

export default function HomePage() {
  const allNetworks = getAllNetworks();
  const allOffers = getAllOffers();
  
  // Memoize the merged networks to prevent constant re-renders
  const mergedNetworks = useMemo(() => {
    // Merge networks from offers
    const offerNetworkNames = Array.from(new Set(allOffers.map(o => o.network)));
    const allNetworkNames = new Set(allNetworks.map(n => n.name));
    const missingNetworks = offerNetworkNames.filter(name => !allNetworkNames.has(name));
    const placeholderNetworks = missingNetworks.map((name, idx) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      category: 'Unknown',
      website: '',
      logo_url: '',
      rating: 0,
      countries: [],
      description: '',
      commission_rate: '',
      offers_count: allOffers.filter(o => o.network === name).length,
      payment_frequency: '',
      payment_methods: [],
      tracking_software: '',
      minimum_payout: ''
    }));
    return [...allNetworks, ...placeholderNetworks];
  }, [allNetworks, allOffers]);

  const [filteredNetworks, setFilteredNetworks] = useState<typeof mergedNetworks>([]);

  // Separate Ad Gain Media and shuffle other networks, limit to 20 for homepage
  useEffect(() => {
    const adGainMedia = mergedNetworks.find(network => network.name === "Ad Gain Media");
    const otherNetworks = mergedNetworks.filter(network => network.name !== "Ad Gain Media");
    const shuffledNetworks = [...otherNetworks].sort(() => Math.random() - 0.5);
    const arrangedNetworks = adGainMedia ? [adGainMedia, ...shuffledNetworks] : shuffledNetworks;
    // Limit to 20 networks for homepage
    setFilteredNetworks(arrangedNetworks.slice(0, 20));
  }, [mergedNetworks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            All Affiliate Networks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all affiliate networks trusted by marketers worldwide. 
            Browse through our comprehensive list and find the perfect platform for your affiliate marketing journey.
          </p>
        </div>
        
        <NetworkFilters 
          networks={mergedNetworks} 
          onFilterChange={setFilteredNetworks} 
        />
        
        <NetworkList networks={filteredNetworks} itemsPerPage={20} />
        
        <div className="text-center mt-12">
          <a 
            href="/networks" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View All Networks
          </a>
        </div>
      </div>

      {/* Offers Section */}
      <OffersSection offers={allOffers} networks={mergedNetworks} showPagination={false} maxItems={25} />
    </div>
  );
}
