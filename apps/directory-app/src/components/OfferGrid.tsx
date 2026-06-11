"use client";

import { FiDollarSign, FiTrendingUp, FiGlobe, FiClock } from "react-icons/fi";
import { type Offer } from "@/data/offers";

interface OfferGridProps {
  offers: Offer[];
}

export default function OfferGrid({ offers }: OfferGridProps) {
  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No offers found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200"
        >
          <div className="font-semibold text-lg text-gray-900 line-clamp-2">{offer.title}</div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiDollarSign className="text-green-500" />
              <span className="font-medium">{offer.network_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiGlobe className="text-blue-500" />
              <span>{offer.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiTrendingUp className="text-purple-500" />
              <span>{offer.commission}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiClock className="text-orange-500" />
              <span>{offer.payout}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 line-clamp-2 mt-2">
            {offer.description}
          </div>
          
          <div className="mt-auto space-y-2">
            <div className="text-blue-700 font-bold text-lg">{offer.payout}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Countries: {offer.countries.join(", ")}</span>
            </div>
            {offer.requirements && offer.requirements.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {offer.requirements.slice(0, 2).map((req, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {req}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 