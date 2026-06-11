import affiliateOffersData from '@/data/offers.json';

export interface Offer {
  id: string;
  offerName: string;
  payout: string;
  vertical: string;
  country: string;
  network: string;
}

export const loadOffersFromJSON = (): Offer[] => {
  try {
    return affiliateOffersData as Offer[];
  } catch (error) {
    console.error('Error loading offers from JSON:', error);
    return [];
  }
};

export const getAllOffers = (): Offer[] => {
  return loadOffersFromJSON();
};

export const getOffersByVertical = (vertical: string): Offer[] => {
  const offers = loadOffersFromJSON();
  return offers.filter(offer => offer.vertical === vertical);
};

export const getOffersByNetwork = (networkName: string): Offer[] => {
  const offers = loadOffersFromJSON();
  return offers.filter(offer => offer.network === networkName);
}; 