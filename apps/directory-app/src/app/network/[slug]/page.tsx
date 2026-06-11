import offers from '@/data/offers.json'
import affiliateNetworksData from '@/data/affiliate-networks.json'
import ReviewButton from '@/components/ReviewButton'
import NetworkHeaderRating from '@/components/NetworkHeaderRating'
import NetworkStats from '@/components/NetworkStats'
import UserReviews from '@/components/UserReviews'
import NetworkDescription from '@/components/NetworkDescription'
import NetworkDetailsTable from '@/components/NetworkDetailsTable'

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function NetworkPage({ params }: PageProps) {
  const { slug } = await params
  
  // Convert slug to network name for matching
  const networkName = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  // Improved network matching logic
  const network = affiliateNetworksData.networks.find(n => {
    const networkNameLower = n.name.toLowerCase();
    const slugLower = slug.toLowerCase();
    const networkNameSlug = networkNameLower.replace(/\s+/g, '-');
    const networkNameSlugAlt = networkNameLower.replace(/[^a-z0-9]/g, '');
    
    return (
      networkNameLower === networkName.toLowerCase() ||
      networkNameSlug === slugLower ||
      networkNameSlugAlt === slugLower ||
      networkNameLower.includes(slugLower) ||
      slugLower.includes(networkNameLower.replace(/\s+/g, ''))
    );
  })
  
  if (!network) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Network Not Found</h1>
            <p className="text-gray-600">The network you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">Searched for: {slug}</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter offers by network name
  const networkOffers = offers.filter(offer => 
    offer.network.toLowerCase().includes(network.name.toLowerCase()) ||
    network.name.toLowerCase().includes(offer.network.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8" style={{fontFamily: 'Inter, ui-sans-serif, system-ui'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="p-3 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] sm:p-8 mb-2 sm:mb-8">
          {/* Mobile: new compact layout */}
          <div className="flex flex-row items-start gap-3 w-full sm:hidden">
            {/* Logo */}
            {network.logo_url && (
              <div className="flex-shrink-0 relative flex flex-col items-center justify-center w-14 h-14">
                <img 
                  src={network.logo_url} 
                  alt={`${network.name} logo`}
                  className="w-14 h-14 object-contain rounded-xl border border-[#e6c77c] bg-white p-1.5 shadow-sm"
                />
                {/* Small Rating Label on top of logo */}
                <div className="absolute -top-2 -right-2">
                  <NetworkHeaderRating networkSlug={slug} compact={true} />
                </div>
              </div>
            )}
            {/* Right side: name, review count, contact icons, stats (compact/text style only) */}
            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <div className="flex flex-row items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-gray-900 tracking-wide truncate min-w-0" style={{letterSpacing: '0.02em'}}>
                  {network.name}
                </h1>
                {/* Review count and stars (compact) */}
                <NetworkHeaderRating networkSlug={slug} compact={false} />
                {/* Small contact icons */}
                <div className="flex items-center gap-1 ml-2">
                  {"email" in network && typeof network.email === 'string' && network.email ? (
                    <a href={`mailto:${network.email as string}`} className="text-gray-400 hover:text-[#bfa14a] text-xs"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg></a>
                  ) : null}
                  {network.website && <a href={network.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#bfa14a] text-xs"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg></a>}
                  {"facebook" in network && typeof network.facebook === 'string' && network.facebook ? (
                    <a href={network.facebook as string} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#bfa14a] text-xs"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H6v4h4v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
                  ) : null}
                  {"twitter" in network && typeof network.twitter === 'string' && network.twitter ? (
                    <a href={network.twitter as string} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#bfa14a] text-xs"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .36.04.71.11 1.05C7.69 5.4 4.07 3.6 1.64.96c-.4.68-.63 1.47-.63 2.32 0 1.6.81 3.01 2.05 3.84A4.48 4.48 0 01.96 6v.06c0 2.24 1.6 4.1 3.72 4.52-.39.11-.8.17-1.22.17-.3 0-.59-.03-.87-.08.59 1.84 2.3 3.18 4.33 3.22A9.05 9.05 0 010 19.54a12.8 12.8 0 006.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.41-.02-.61A9.22 9.22 0 0024 4.59a9.1 9.1 0 01-2.6.71A4.52 4.52 0 0023 3z"/></svg></a>
                  ) : null}
                </div>
              </div>
              {/* Stats badges (compact/text style only) */}
              <div className="flex flex-row gap-1 mt-1">
                <NetworkStats networkSlug={slug} />
              </div>
            </div>
          </div>
          {/* Desktop: original layout */}
          <div className="hidden sm:flex flex-row gap-6 items-center w-full">
            {/* Logo */}
            {network.logo_url && (
              <div className="flex-shrink-0 relative mb-0 flex flex-col items-center">
                <img 
                  src={network.logo_url} 
                  alt={`${network.name} logo`}
                  className="w-24 h-24 object-contain rounded-xl border border-[#e6c77c] bg-white p-3 shadow-sm"
                />
                <div className="absolute -top-2 -right-2">
                  <NetworkHeaderRating networkSlug={slug} compact={true} />
                </div>
              </div>
            )}
            <div className="flex flex-col flex-1 min-w-0 gap-3 items-start">
              <div className="flex flex-row items-center gap-4 min-w-0">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-wide text-left truncate min-w-0" style={{letterSpacing: '0.02em'}}>
                  {network.name}
                </h1>
                {network.category && (
                  <span className="inline-block max-w-full truncate text-ellipsis block text-left px-4 py-2 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white text-sm font-medium rounded-full shadow-sm">
                    {network.category}
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-1 justify-start overflow-x-auto w-full">
                <NetworkStats networkSlug={slug} />
              </div>
            </div>
            <div className="flex flex-col gap-3 w-auto ml-auto flex-shrink-0">
              {network.website && (
                <a
                  href={network.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-auto text-center bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] hover:from-[#e6c77c] hover:to-[#bfa14a] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                >
                  Join Now
                </a>
              )}
              <ReviewButton networkName={network.name} networkSlug={slug} />
            </div>
          </div>
        </div>

        {/* About Network + Affiliate Network Details in one layer */}
        <div className="p-3 mb-2 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] sm:p-8 sm:mb-8">
          <h2 className="text-sm sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.01em'}}>
            <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
            About {network.name}
          </h2>
          <div className="text-xs sm:text-base mb-4">
            <NetworkDescription networkName={network.name} network={network} showReadMore={true} />
          </div>
          {/* Affiliate Network Details (no extra layer) */}
          <NetworkDetailsTable network={network} />
        </div>

        {/* Offers Section */}
        <div className="p-3 mb-2 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] sm:p-8 sm:mb-8">
          <h2 className="text-sm sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-8 flex items-center tracking-wide" style={{letterSpacing: '0.01em'}}>
            <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
            Available Offers ({networkOffers.length})
          </h2>
          {networkOffers.length > 0 ? (
            <div className="flex flex-col gap-1 sm:gap-3">
              {networkOffers.map((offer, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 border border-gray-200 rounded p-2 sm:p-3 text-xs sm:text-base w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 w-full">
                    <span className="font-semibold text-gray-900">{offer.offerName || 'Unnamed Offer'}</span>
                    <span className="text-gray-500">{offer.vertical || 'General'}</span>
                    <span className="text-gray-500">Payout: <span className="font-medium text-[#bfa14a]">{offer.payout || 'N/A'}</span></span>
                    <span className="text-gray-400">{offer.country || 'Global'}</span>
                  </div>
                  <button className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] hover:from-[#e6c77c] hover:to-[#bfa14a] text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 transition-all duration-300 transform hover:scale-105 mt-2 sm:mt-0 whitespace-nowrap">
                    View Offer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-16">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide" style={{letterSpacing: '0.01em'}}>No Offers Available</h3>
              <p className="text-gray-600 font-light text-xs sm:text-base">Currently no offers are available for this network.</p>
            </div>
          )}
        </div>

        {/* User Reviews Section */}
        <div className="p-3 mb-2 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] sm:p-8 sm:mb-8 text-xs sm:text-base">
          <h2 className="text-sm sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.01em'}}>
            <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
            User Reviews
          </h2>
          {/* Display Reviews */}
          <UserReviews networkSlug={slug} networkName={network.name} />
          {/* Add Review Button */}
          <div className="text-center pt-4 sm:pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2 sm:mb-4 text-xs sm:text-base">Share your experience with {network.name}</p>
            <ReviewButton networkName={network.name} networkSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
} 