export interface Network {
  id: string;
  name: string;
  category: string;
  website: string;
  logo: string;
  rating: number;
  countries: string[];
}

export interface Offer {
  id: string;
  offerName: string;
  payout: string;
  vertical: string;
  country: string;
  network: string;
} 