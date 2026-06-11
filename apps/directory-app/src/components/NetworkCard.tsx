import Link from "next/link";
import { FiStar, FiGlobe, FiExternalLink } from "react-icons/fi";
import { Network } from "@/types";
import { getNetworkLogo } from "@/lib/supabase-logos";
import { getNetworkSlug } from "@/lib/networks-loader";
import { useState, useEffect } from "react";

interface NetworkCardProps {
  network: Network;
}

export default function NetworkCard({ network }: NetworkCardProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/logos/placeholder.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setIsLoading(true);
        const logo = await getNetworkLogo(network.name, network.logo);
        setLogoUrl(logo);
      } catch (error) {
        console.error('Error fetching logo for', network.name, error);
        setLogoUrl('/logos/placeholder.png');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [network.name, network.logo]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg overflow-hidden">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 w-full h-full rounded-lg"></div>
            ) : logoUrl !== '/logos/placeholder.png' ? (
              <img 
                src={logoUrl} 
                alt={`${network.name} logo`}
                className="w-full h-full object-cover rounded-lg"
                onError={() => setLogoUrl('/logos/placeholder.png')}
              />
            ) : (
              network.name.charAt(0)
            )}
          </div>
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
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Category:</span> {network.category}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiGlobe className="text-blue-500" />
          <span>{network.countries.join(", ")}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <a
          href={network.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <FiExternalLink />
          Visit Site
        </a>
        <Link
          href={`/network/${getNetworkSlug(network.name)}`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 