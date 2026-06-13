import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

const products = [
  // Tractors & Machinery (4)
  { title: 'Massey Ferguson Tractor 375 (75HP)', price: '₦15,000,000', location: 'Kaduna', seller: 'AgroTech Ltd', image: 'https://images.unsplash.com/photo-1530267981375-5f0b1f2e9b1d?w=600&q=80', verified: true, rating: 4.8 },
  { title: 'John Deere Harvester 5050', price: '₦22,500,000', location: 'Kano', seller: 'GreenField Machines', image: 'https://images.unsplash.com/photo-1586192721423-e180b4860822?w=600&q=80', verified: true, rating: 4.6 },
  { title: 'Heavy-Duty Plough Equipment', price: '₦850,000', location: 'Zaria', seller: 'FarmTools Nigeria', image: 'https://images.unsplash.com/photo-1599940824399-bdb3a2c6e2c4?w=600&q=80', verified: false, rating: 4.3 },
  { title: 'Rice Harvester Machine', price: '₦12,000,000', location: 'Ebonyi', seller: 'AgroTech Ltd', image: 'https://images.unsplash.com/photo-1586771107445-b3ea8880e0b4?w=600&q=80', verified: true, rating: 4.5 },

  // Seeds & Seedlings (3)
  { title: 'Organic Maize Seeds (50kg Bag)', price: '₦25,000', location: 'Ibadan', seller: 'SeedCo Nigeria', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80', verified: true, rating: 4.5 },
  { title: 'Rice Seedlings (1000 stems)', price: '₦12,000', location: 'Ebonyi', seller: 'Abakaliki Rice Hub', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', verified: false, rating: 4.3 },
  { title: 'Hybrid Tomato Seeds (100g)', price: '₦3,500', location: 'Jos', seller: 'Plateau Farms', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', verified: true, rating: 4.7 },

  // Fertilizers & Chemicals (3)
  { title: 'NPK 15-15-15 Fertilizer (50kg)', price: '₦18,500', location: 'Kano', seller: 'AgroSupply Co', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80', verified: false, rating: 4.2 },
  { title: 'Organic Compost (25kg)', price: '₦6,000', location: 'Abeokuta', seller: 'GreenSoil Organics', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', verified: true, rating: 4.4 },
  { title: 'Pesticide Spray (1 Litre)', price: '₦4,500', location: 'Lagos', seller: 'CropShield Ltd', image: 'https://images.unsplash.com/photo-1599940824399-bdb3a2c6e2c4?w=600&q=80', verified: false, rating: 4.0 },

  // Crops & Harvest (6)
  { title: 'Fresh Maize (100kg Bag)', price: '₦35,000', location: 'Kaduna', seller: 'Ibrahim Farms', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80', verified: true, rating: 4.6 },
  { title: 'Rice Harvest (50kg Bag)', price: '₦28,000', location: 'Ebonyi', seller: 'Abakaliki Rice Hub', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', verified: true, rating: 4.5 },
  { title: 'Fresh Cassava Tubers (100kg)', price: '₦30,000', location: 'Abeokuta', seller: 'Ogun Agro Traders', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80', verified: true, rating: 4.4 },
  { title: 'Yam Tubers (50kg)', price: '₦40,000', location: 'Benue', seller: 'Food Basket Farms', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80', verified: false, rating: 4.2 },
  { title: 'Fresh Tomatoes (Basket)', price: '₦8,000', location: 'Jos', seller: 'Plateau Farms', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', verified: true, rating: 4.7 },
  { title: 'Fresh Scotch Bonnet Pepper (Bag)', price: '₦15,000', location: 'Kaduna', seller: 'SpiceFarmers Ltd', image: 'https://images.unsplash.com/photo-1588252303782-cb80119e3b4d?w=600&q=80', verified: true, rating: 4.8 },

  // Irrigation Equipment (3)
  { title: 'Irrigation Sprinkler System', price: '₦45,000', location: 'Abuja', seller: 'WaterFlow Tech', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&q=80', verified: false, rating: 4.0 },
  { title: 'Drip Irrigation Kit (1 Acre)', price: '₦65,000', location: 'Kano', seller: 'IrriTech Solutions', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', verified: true, rating: 4.5 },
  { title: 'Water Pump 3HP', price: '₦120,000', location: 'Lagos', seller: 'WaterFlow Tech', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&q=80', verified: false, rating: 4.1 },

  // Livestock & Feed (3)
  { title: 'Day-Old Broiler Chicks (50 pcs)', price: '₦35,000', location: 'Benin', seller: 'PoultryPro Farms', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80', verified: true, rating: 4.6 },
  { title: 'Adult Goats (5 pcs)', price: '₦150,000', location: 'Owerri', seller: 'LivestockPro', image: 'https://images.unsplash.com/photo-1572495983015-e0b6fbd0e4b3?w=600&q=80', verified: false, rating: 4.3 },
  { title: 'Organic Poultry Feed (25kg)', price: '₦9,500', location: 'Owerri', seller: 'LivestockPro', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80', verified: true, rating: 4.5 },

  // Tools & Implements (2)
  { title: 'Knapsack Sprayer 16L', price: '₦7,500', location: 'Lagos', seller: 'FarmTools Nigeria', image: 'https://images.unsplash.com/photo-1599940824399-bdb3a2c6e2c4?w=600&q=80', verified: false, rating: 4.1 },
  { title: 'Complete Hand Tools Set', price: '₦25,000', location: 'Abuja', seller: 'FarmTools Nigeria', image: 'https://images.unsplash.com/photo-1599940824399-bdb3a2c6e2c4?w=600&q=80', verified: true, rating: 4.4 },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-500 mt-2">Browse {products.length}+ products from verified sellers across Nigeria.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <select className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600/20">
            <option>All Categories</option>
            <option>Tractors & Machinery</option>
            <option>Seeds & Seedlings</option>
            <option>Fertilizers & Chemicals</option>
            <option>Crops & Harvest</option>
            <option>Livestock & Feed</option>
            <option>Irrigation Equipment</option>
            <option>Tools & Implements</option>
          </select>
          <select className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600/20">
            <option>All Locations</option>
            <option>Abuja</option><option>Abeokuta</option><option>Benin</option><option>Benue</option>
            <option>Ebonyi</option><option>Ibadan</option><option>Jos</option><option>Kaduna</option>
            <option>Kano</option><option>Lagos</option><option>Owerri</option><option>Zaria</option>
          </select>
          <select className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600/20">
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.title} href="/product/1" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-48">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
                {product.verified && (
                  <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">✓ Verified</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-800 transition line-clamp-2">{product.title}</h3>
                <p className="text-2xl font-bold text-green-900 mt-2">{product.price}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500"><MapPin className="w-4 h-4" />{product.location}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">{product.seller}</span>
                  <div className="flex items-center gap-1 text-sm text-yellow-600"><Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />{product.rating}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
