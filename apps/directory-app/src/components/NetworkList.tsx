"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Network } from "@/data/networks";
import { FiChevronUp, FiChevronDown, FiExternalLink, FiStar } from "react-icons/fi";
import { getNetworkSlug } from "@/lib/networks-loader";

interface NetworkListProps {
  networks: Network[];
  itemsPerPage?: number;
}

type SortField = "name" | "description" | "offers_count" | "rating";
type SortDirection = "asc" | "desc";

export default function NetworkList({ networks, itemsPerPage = 20 }: NetworkListProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const sortedNetworks = [...networks].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "description":
        aValue = a.description?.toLowerCase() || "";
        bValue = b.description?.toLowerCase() || "";
        break;
      case "offers_count":
        aValue = a.offers_count || 0;
        bValue = b.offers_count || 0;
        break;
      case "rating":
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination - only show if itemsPerPage is less than total networks
  const totalPages = Math.ceil(sortedNetworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNetworks = itemsPerPage >= sortedNetworks.length ? sortedNetworks : sortedNetworks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FiChevronUp className="w-4 h-4 text-amber-600" />
    ) : (
      <FiChevronDown className="w-4 h-4 text-amber-600" />
    );
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FiStar key={i} className="w-3 h-3 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <FiStar className="w-3 h-3 text-gray-300" />
            <FiStar className="w-3 h-3 text-yellow-400 fill-current absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(
          <FiStar key={i} className="w-3 h-3 text-gray-300" />
        );
      }
    }

    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="space-y-4">
      {/* Desktop List View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-amber-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 hover:text-amber-600 transition-colors"
                  >
                    <span>Network</span>
                    <SortIcon field="name" />
                  </button>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("description")}
                    className="flex items-center space-x-1 hover:text-amber-600 transition-colors"
                  >
                    <span>Description</span>
                    <SortIcon field="description" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("offers_count")}
                    className="flex items-center space-x-1 hover:text-amber-600 transition-colors"
                  >
                    <span>Offers</span>
                    <SortIcon field="offers_count" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-200">
              {currentNetworks.map((network) => (
                <tr key={network.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center">
                        {network.logo_url ? (
                          <img
                            src={network.logo_url}
                            alt={`${network.name} logo`}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={(e) => {
                              // Fallback to network name if logo fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback - Network name initial */}
                        <div 
                          className={`h-16 w-16 bg-amber-100 rounded-lg flex items-center justify-center ${
                            network.logo_url ? 'hidden' : ''
                          }`}
                        >
                          <span className="text-amber-600 font-semibold text-base">
                            {network.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/network/${getNetworkSlug(network.name)}`}
                            className="text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            {network.name}
                          </Link>
                          {network.name === "Ad Gain Media" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-sm">
                              Sponsored
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {network.category}
                        </div>
                        <div className="mt-1">
                          <StarRating rating={network.rating} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {network.description}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Commission: {network.commission_rate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {network.offers_count?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {network.payment_frequency} payments
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={`/network/${getNetworkSlug(network.name)}`}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        View Details
                      </a>
                      <a
                        href={network.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentNetworks.map((network) => (
            <div
              key={network.id}
              className="bg-white rounded-lg shadow-sm border border-amber-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
                  {network.logo_url ? (
                    <img
                      src={network.logo_url}
                      alt={`${network.name} logo`}
                      className="max-w-full max-h-full object-contain rounded-lg"
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
                    className={`h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center ${
                      network.logo_url ? 'hidden' : ''
                    }`}
                  >
                    <span className="text-amber-600 font-semibold text-sm">
                      {network.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/network/${getNetworkSlug(network.name)}`}
                      className="text-sm font-semibold text-gray-900 truncate hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      {network.name}
                    </Link>
                    {network.name === "Ad Gain Media" && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        Sponsored
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{network.category}</p>
                  <div className="mb-2">
                    <StarRating rating={network.rating} />
                  </div>
                  <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {network.description}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {network.offers_count?.toLocaleString() || "N/A"} offers
                    </div>
                    <div className="flex space-x-1">
                      <a
                        href={`/network/${getNetworkSlug(network.name)}`}
                        className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                      >
                        Details
                      </a>
                      <a
                        href={network.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination - only show if there are more items than itemsPerPage */}
      {totalPages > 1 && itemsPerPage < sortedNetworks.length && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-amber-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(endIndex, sortedNetworks.length)}</span> of{" "}
                <span className="font-medium">{sortedNetworks.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-amber-300 bg-white text-sm font-medium text-gray-500 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-amber-50 border-amber-500 text-amber-600"
                        : "bg-white border-amber-300 text-gray-500 hover:bg-amber-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-amber-300 bg-white text-sm font-medium text-gray-500 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 