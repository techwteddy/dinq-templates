export interface AffiliateNetwork {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  rating: number;
  reviewCount: number;
  payout: string;
  categories: string[];
  countries: string[];
  minPayout: string;
  paymentMethods: string[];
  features: string[];
  website: string;
  founded: string;
  employees: string;
}

export interface Offer {
  id: string;
  title: string;
  network: string;
  payout: string;
  category: string;
  country: string;
  description: string;
  conversionRate: string;
  epc: string;
  creatives: string[];
  restrictions: string[];
  tracking: string;
  paymentSchedule: string;
}

export interface NetworksResponse {
  networks: AffiliateNetwork[];
}

export interface OffersResponse {
  offers: Offer[];
}

export async function fetchNetworks(): Promise<AffiliateNetwork[]> {
  try {
    const response = await fetch('/data/networks.json');
    if (!response.ok) {
      throw new Error('Failed to fetch networks');
    }
    const data: NetworksResponse = await response.json();
    return data.networks;
  } catch (error) {
    console.error('Error fetching networks:', error);
    return [];
  }
}

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const response = await fetch('/data/offers.json');
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    const data: OffersResponse = await response.json();
    return data.offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

export async function fetchNetworkBySlug(slug: string): Promise<AffiliateNetwork | null> {
  try {
    const networks = await fetchNetworks();
    return networks.find(network => network.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching network by slug:', error);
    return null;
  }
} 