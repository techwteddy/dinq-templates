export interface Offer {
  id: string;
  title: string;
  network_id: string;
  network_name: string;
  category: string;
  commission: string;
  payout: string;
  countries: string[];
  description: string;
  requirements?: string[];
  restrictions?: string[];
  created_at?: string;
}

export const offers: Offer[] = [
  {
    id: "1",
    title: "Amazon Product Promotion",
    network_id: "1",
    network_name: "Amazon Associates",
    category: "E-commerce",
    commission: "1-10%",
    payout: "$10-50 per sale",
    countries: ["US", "UK", "CA", "DE"],
    description: "Promote Amazon products and earn commissions on qualifying purchases",
    requirements: ["Valid website or social media presence", "Compliance with Amazon's terms"],
    restrictions: ["No paid search advertising", "No coupon sites"]
  },
  {
    id: "2",
    title: "CJ Finance Offers",
    network_id: "2",
    network_name: "CJ Affiliate",
    category: "Finance",
    commission: "5-25%",
    payout: "$50-200 per lead",
    countries: ["US", "UK", "CA"],
    description: "High-paying finance and insurance offers through CJ Affiliate",
    requirements: ["Targeted traffic", "Compliance with financial regulations"],
    restrictions: ["No incentive traffic", "Must follow FTC guidelines"]
  },
  {
    id: "4",
    title: "Awin Travel Offers",
    network_id: "5",
    network_name: "Awin",
    category: "Travel",
    commission: "5-15%",
    payout: "$20-100 per booking",
    countries: ["US", "UK", "DE", "FR"],
    description: "Travel booking offers with competitive commissions",
    requirements: ["Travel-related content", "Valid traffic sources"],
    restrictions: ["No price comparison sites", "Must follow travel regulations"]
  },
  {
    id: "5",
    title: "FlexOffers Health",
    network_id: "6",
    network_name: "FlexOffers",
    category: "Health",
    commission: "5-20%",
    payout: "$30-150 per sale",
    countries: ["US", "UK", "CA"],
    description: "Health and wellness product offers",
    requirements: ["Health-focused audience", "Compliance with health regulations"],
    restrictions: ["No medical claims", "Must follow FDA guidelines"]
  }
];

export const getOffers = () => offers;
export const getOfferById = (id: string) => offers.find(o => o.id === id);
export const getOffersByCategory = (category: string) => offers.filter(o => o.category === category);
export const getOffersByNetwork = (networkId: string) => offers.filter(o => o.network_id === networkId); 