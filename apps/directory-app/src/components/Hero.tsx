"use client";

import React, { useState } from "react";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import { getNetworkById, getFeaturedNetworks, getNetworkSlug } from "@/lib/networks-loader";
import networksData from "@/data/networks.json";

const searchSuggestions = [
  "Weight loss offers",
  "Crypto trading",
  "Insurance leads",
  "Ecommerce stores",
  "Health supplements",
  "Financial services"
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const trendingNetworks = getFeaturedNetworks(5);

  // Load all network names and ids
  const allNetworks = Array.isArray(networksData) ? networksData : [];
  const filteredNetworkSuggestions = searchQuery
    ? allNetworks.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSuggestionClick = (network: { id: string; name: string }) => {
    setSearchQuery(network.name);
    setShowSuggestions(false);
    // Use network slug for navigation
    window.location.href = `/network/${getNetworkSlug(network.name)}`;
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const match = allNetworks.find(n => n.name.toLowerCase() === searchQuery.toLowerCase());
    if (match) {
      // Use network slug for navigation
      window.location.href = `/network/${getNetworkSlug(match.name)}`;
    }
  };

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrendingNetworkClick = (networkId: string) => {
    // Find network by ID and use its name for slug
    const network = getNetworkById(networkId);
    if (network) {
      window.location.href = `/network/${getNetworkSlug(network.name)}`;
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl shadow-lg overflow-hidden border border-amber-100">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-orange-600/5"></div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 drop-shadow-sm">
          Find The Perfect{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Affiliate Network
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Browse affiliate networks and find the perfect partner to monetize your traffic and boost your affiliate marketing success.
        </p>
        
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <form className="flex items-center bg-white rounded-full shadow-lg border border-amber-200 px-4 py-3" onSubmit={handleSearchSubmit}>
            <FiSearch className="text-amber-400 text-xl mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search affiliate networks, offers, programs..."
              className="flex-1 bg-transparent outline-none text-base md:text-lg px-2 py-1"
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="ml-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Search
            </button>
          </form>
          
          {/* Search Suggestions */}
          {showSuggestions && searchQuery && filteredNetworkSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-amber-200 z-20">
              {filteredNetworkSuggestions.slice(0, 8).map((network) => (
                <button
                  key={network.id}
                  className="w-full text-left px-4 py-3 hover:bg-amber-50 border-b border-amber-100 last:border-b-0 cursor-pointer"
                  onMouseDown={() => handleSuggestionClick(network)}
                >
                  {network.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <FiTrendingUp className="text-amber-500" />
            <span>Trending:</span>
          </div>
          {trendingNetworks.map((network) => (
            <button
              key={network.id}
              onClick={() => handleTrendingNetworkClick(network.id)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm text-amber-700 rounded-full text-sm font-medium hover:bg-amber-50 border border-amber-200 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              #{network.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
} 