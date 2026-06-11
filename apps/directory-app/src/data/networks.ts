export interface Network {
  id: string;
  name: string;
  website: string;
  category: string;
  rating: number;
  countries: string[];
  logo_url?: string;
  description?: string;
  commission_rate?: string;
  payment_methods?: string[];
  minimum_payout?: string;
  tracking_software?: string;
  payment_frequency?: string;
  offers_count?: number;
}

export const networks: Network[] = [
  {
    id: "1",
    name: "Amazon Associates",
    website: "https://affiliate-program.amazon.com",
    category: "E-commerce",
    rating: 4.5,
    countries: ["US", "UK", "CA", "DE", "FR", "IT", "ES", "JP"],
    logo_url: undefined,
    description: "Amazon's affiliate program offering commissions on millions of products",
    commission_rate: "1-10%",
    payment_methods: ["Check", "Direct Deposit"],
    minimum_payout: "$10",
    tracking_software: "HasOffers",
    payment_frequency: "Net-30",
    offers_count: 1000000
  },
  {
    id: "2",
    name: "CJ Affiliate",
    website: "https://www.cj.com",
    category: "General",
    rating: 4.2,
    countries: ["US", "UK", "CA", "AU"],
    logo_url: undefined,
    description: "One of the largest affiliate networks with diverse merchant partners",
    commission_rate: "5-25%",
    payment_methods: ["Check", "Direct Deposit", "PayPal"],
    minimum_payout: "$50",
    tracking_software: "CAKE",
    payment_frequency: "Net-15",
    offers_count: 50000
  },
  {
    id: "4",
    name: "Commission Junction",
    website: "https://www.cj.com",
    category: "General",
    rating: 4.1,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Established affiliate network with reliable tracking",
    commission_rate: "5-30%",
    payment_methods: ["Check", "Direct Deposit"],
    minimum_payout: "$50",
    tracking_software: "Offerslook",
    payment_frequency: "Net-60",
    offers_count: 45000
  },
  {
    id: "5",
    name: "Awin",
    website: "https://www.awin.com",
    category: "General",
    rating: 4.3,
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "NL"],
    logo_url: undefined,
    description: "Global affiliate network with strong European presence",
    commission_rate: "5-25%",
    payment_methods: ["Check", "Direct Deposit", "PayPal"],
    minimum_payout: "$20",
    tracking_software: "HitPath",
    payment_frequency: "Bi-Weekly",
    offers_count: 35000
  },
  {
    id: "6",
    name: "FlexOffers",
    website: "https://www.flexoffers.com",
    category: "General",
    rating: 3.9,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Affiliate network with diverse merchant categories",
    commission_rate: "5-20%",
    payment_methods: ["Check", "Direct Deposit"],
    minimum_payout: "$50",
    tracking_software: "LinkTrust",
    payment_frequency: "Daily",
    offers_count: 15000
  },
  {
    id: "7",
    name: "Affise Network",
    website: "https://www.affise.com",
    category: "General",
    rating: 4.4,
    countries: ["US", "UK", "CA", "AU", "DE"],
    logo_url: undefined,
    description: "Advanced affiliate network with comprehensive tracking solutions",
    commission_rate: "5-30%",
    payment_methods: ["Check", "Direct Deposit", "PayPal", "Wire"],
    minimum_payout: "$100",
    tracking_software: "Affise",
    payment_frequency: "Net-15",
    offers_count: 40000
  },
  {
    id: "8",
    name: "Afftrack Network",
    website: "https://www.afftrack.com",
    category: "General",
    rating: 4.1,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Performance-based affiliate network with advanced analytics",
    commission_rate: "5-25%",
    payment_methods: ["Check", "Direct Deposit", "PayPal"],
    minimum_payout: "$50",
    tracking_software: "Afftrack",
    payment_frequency: "Weekly",
    offers_count: 20000
  },
  {
    id: "9",
    name: "Other Networks",
    website: "https://example.com",
    category: "General",
    rating: 3.8,
    countries: ["US", "UK"],
    logo_url: undefined,
    description: "Various affiliate networks using different tracking platforms",
    commission_rate: "3-20%",
    payment_methods: ["Check", "Direct Deposit"],
    minimum_payout: "$25",
    tracking_software: "Others",
    payment_frequency: "Others",
    offers_count: 10000
  },
  {
    id: "10",
    name: "Payoneer Network",
    website: "https://www.payoneer.com",
    category: "General",
    rating: 4.2,
    countries: ["US", "UK", "CA", "AU", "DE", "FR"],
    logo_url: undefined,
    description: "Global payment network with multiple payment options",
    commission_rate: "5-25%",
    payment_methods: ["Check", "Direct Deposit", "Payoneer"],
    minimum_payout: "$50",
    tracking_software: "HasOffers",
    payment_frequency: "Net-30",
    offers_count: 30000
  },
  {
    id: "11",
    name: "Paxum Network",
    website: "https://www.paxum.com",
    category: "General",
    rating: 4.0,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Digital payment network with fast transfers",
    commission_rate: "5-20%",
    payment_methods: ["Check", "Direct Deposit", "Paxum"],
    minimum_payout: "$25",
    tracking_software: "CAKE",
    payment_frequency: "Weekly",
    offers_count: 18000
  },
  {
    id: "12",
    name: "WebMoney Network",
    website: "https://www.webmoney.com",
    category: "General",
    rating: 3.9,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Digital payment network with global reach",
    commission_rate: "5-25%",
    payment_methods: ["Check", "Direct Deposit", "WebMoney"],
    minimum_payout: "$50",
    tracking_software: "HasOffers",
    payment_frequency: "Net-30",
    offers_count: 25000
  }
];

export const getNetworks = () => networks;
export const getNetworkById = (id: string) => networks.find(n => n.id === id);
export const getNetworksByCategory = (category: string) => networks.filter(n => n.category === category); 