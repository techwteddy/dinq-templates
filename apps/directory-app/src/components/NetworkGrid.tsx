"use client";

import Link from "next/link";
import { FiStar, FiUsers, FiGlobe, FiDollarSign } from "react-icons/fi";
import { type Network } from "@/data/networks";
import { getNetworkSlug } from "@/lib/networks-loader";

interface NetworkGridProps {
  networks: Network[];
}

export default function NetworkGrid({ networks }: NetworkGridProps) {
  if (networks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No networks found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {networks.map((network) => (
        <div
          key={network.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {network.logo_url ? (
                <img 
                  src={network.logo_url} 
                  alt={network.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {network.name.charAt(0)}
                </div>
              )}
              <div>
                <Link
                  href={`/network/${getNetworkSlug(network.name)}`}
                  className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {network.name}
                </Link>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 text-sm" />
                  <span className="text-sm text-gray-600">{network.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          {network.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{network.description}</p>
          )}
          
          <div className="space-y-2 mb-4">
            {network.commission_rate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiDollarSign className="text-green-500" />
                <span className="font-medium">Commission: {network.commission_rate}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiGlobe className="text-blue-500" />
              <span>{network.countries.join(", ")}</span>
            </div>
            {network.minimum_payout && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiUsers className="text-purple-500" />
                <span>Min payout: {network.minimum_payout}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {network.category}
            </span>
          </div>
          
          <div className="flex gap-2">
            <a 
              href={`/network/${getNetworkSlug(network.name)}`}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition text-center"
            >
              View Details
            </a>
            <a 
              href={network.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Visit Site
            </a>
          </div>
        </div>
      ))}
    </div>
  );
} 