"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiExternalLink, FiDollarSign, FiMapPin, FiTag, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { getNetworkSlug } from "@/lib/networks-loader";

interface Offer {
  id: string;
  offerName: string;
  payout: string;
  vertical: string;
  country: string;
  network: string;
}

interface Network {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
}

interface OffersSectionProps {
  offers: Offer[];
  networks: Network[];
  showPagination?: boolean;
  maxItems?: number;
}

export default function OffersSection({ offers, networks, showPagination = true, maxItems }: OffersSectionProps) {
  const [selectedVertical, setSelectedVertical] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortField, setSortField] = useState<'default' | 'payout'>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Predefined verticals list
  const verticals = [
    "All",
    "Nutra", 
    "Crypto",
    "Dating",
    "Gambling",
    "Game",
    "COD",
    "Sweepstakes",
    "Smartlink",
    "Pay per Call",
    "Mobile Offers",
    "Weight Loss",
    "SOI",
    "Gift Card",
    "Skin",
    "Health",
    "Free Trial"
  ];

  // Filter offers based on selected vertical from complete list
  let filteredOffers = selectedVertical === "All" 
    ? offers 
    : offers.filter(offer => offer.vertical === selectedVertical);

  // Apply maxItems limit if specified (for homepage)
  if (maxItems && filteredOffers.length > maxItems) {
    filteredOffers = filteredOffers.slice(0, maxItems);
  }

  // Sorting logic for payout
  if (sortField === 'payout') {
    filteredOffers = [...filteredOffers].sort((a, b) => {
      // Extract numeric value from payout string (e.g., "$45 CPA" -> 45)
      const getPayoutValue = (payout: string) => {
        const match = payout.match(/\d+(?:\.\d+)?/);
        return match ? parseFloat(match[0]) : 0;
      };
      const aValue = getPayoutValue(a.payout);
      const bValue = getPayoutValue(b.payout);
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

  // Calculate pagination - only if showPagination is true and maxItems not set
  const totalPages = showPagination && !maxItems ? Math.ceil(filteredOffers.length / itemsPerPage) : 1;
  const startIndex = showPagination && !maxItems ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = showPagination && !maxItems ? startIndex + itemsPerPage : filteredOffers.length;
  const currentOffers = showPagination && !maxItems ? filteredOffers.slice(startIndex, endIndex) : filteredOffers;

  // Reset to first page when vertical changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVertical]);

  // Get network logo and website by name
  const getNetwork = (networkName: string) => {
    return networks.find(n => n.name === networkName);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSortPayout = () => {
    if (sortField === 'payout') {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField('payout');
      setSortDirection('asc');
    }
  };

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          All Networks Offers
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover high-paying offers from top affiliate networks. 
          Filter by category and find the perfect opportunities to maximize your earnings.
        </p>
      </div>

      {/* Tab Selector - only show on dedicated page */}
      {showPagination && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {verticals.map((vertical) => (
            <button
              key={vertical}
              onClick={() => {
                setSelectedVertical(vertical);
                setSortField('default');
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedVertical === vertical
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-amber-200 hover:bg-amber-50 hover:border-amber-300"
              }`}
            >
              {vertical}
            </button>
          ))}
        </div>
      )}

      {/* Results Count - only show on dedicated page */}
      {showPagination && (
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-amber-600">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-amber-600">{Math.min(endIndex, filteredOffers.length)}</span> of{" "}
            <span className="font-semibold text-amber-600">{filteredOffers.length}</span> offers
            {selectedVertical !== "All" && (
              <span className="text-gray-500"> in {selectedVertical}</span>
            )}
          </p>
        </div>
      )}

      {/* Desktop List View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-amber-200 overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-amber-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Offer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Network</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Country</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none" onClick={handleSortPayout}>
                <span className="flex items-center gap-1">
                  Payout
                  {sortField === 'payout' ? (
                    sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4 text-amber-600" /> : <FiChevronDown className="w-4 h-4 text-amber-600" />
                  ) : (
                    <FiChevronUp className="w-4 h-4 text-gray-300" />
                  )}
                </span>
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ width: 80 }}>Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-200">
            {currentOffers.map((offer) => {
              const network = getNetwork(offer.network);
              const networkLogo = network?.logo_url;
              return (
                <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{offer.offerName}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {networkLogo ? (
                        <img
                          src={networkLogo}
                          alt={`${offer.network} logo`}
                          className="w-8 h-8 object-contain rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                          <span className="text-amber-600 font-semibold text-sm">{offer.network.charAt(0)}</span>
                        </div>
                      )}
                      <Link
                        href={`/network/${getNetworkSlug(offer.network)}`}
                        className="text-gray-900 font-medium hover:text-amber-600 transition-colors cursor-pointer"
                      >
                        {offer.network}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-700">{offer.vertical}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-700">{offer.country}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-amber-600 font-semibold">{offer.payout}</span>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-center">
                    <a
                      href={network?.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-sm"
                      style={{ minWidth: 0 }}
                    >
                      View Offer
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentOffers.map((offer) => {
            const network = getNetwork(offer.network);
            const networkLogo = network?.logo_url;
            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Network Logo and Info */}
                <div className="p-6 border-b border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {networkLogo ? (
                          <img
                            src={networkLogo}
                            alt={`${offer.network} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback */}
                        <div 
                          className={`w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center ${
                            networkLogo ? 'hidden' : ''
                          }`}
                        >
                          <span className="text-amber-600 font-semibold text-sm">
                            {offer.network.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Link
                          href={`/network/${getNetworkSlug(offer.network)}`}
                          className="font-semibold text-gray-900 hover:text-amber-600 transition-colors cursor-pointer"
                        >
                          {offer.network}
                        </Link>
                        <p className="text-sm text-gray-500">Network</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-amber-600 font-semibold">
                        <FiDollarSign className="w-4 h-4 mr-1" />
                        {offer.payout}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {offer.offerName}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiTag className="w-4 h-4 mr-2 text-amber-500" />
                      <span className="font-medium">{offer.vertical}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2 text-amber-500" />
                      <span>{offer.country}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <a
                      href={network?.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200 text-center"
                    >
                      View Offer
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="w-full flex items-center justify-center mt-8">
          <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-full overflow-x-auto px-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-amber-300 rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                      : "text-gray-700 bg-white border border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-amber-300 rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* View All Offers Button */}
      <div className="text-center mt-12">
        <a 
          href="/offers" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View All Offers
        </a>
      </div>
    </div>
  );
} 