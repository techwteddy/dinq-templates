import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck, Phone } from 'lucide-react';

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link> / <Link href="/marketplace" className="hover:text-green-700">Marketplace</Link> / <span className="text-gray-600">Massey Ferguson Tractor 375</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1530267981375-5f0b1f2e9b1d?w=800&q=80" alt="Product" width={800} height={600} className="w-full h-96 object-cover" />
            </div>
            <div className="flex gap-3 mt-3">
              {['https://images.unsplash.com/photo-1530267981375-5f0b1f2e9b1d?w=200&q=80', 'https://images.unsplash.com/photo-1586192721423-e180b4860822?w=200&q=80', 'https://images.unsplash.com/photo-1599940824399-bdb3a2c6e2c4?w=200&q=80'].map((img, i) => (
                <Image key={i} src={img} alt={`View ${i+1}`} width={100} height={75} className="rounded-xl w-24 h-18 object-cover border-2 border-gray-200 cursor-pointer hover:border-green-600 transition" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">Tractors & Machinery</span>
              <h1 className="text-2xl font-serif font-bold text-gray-900 mt-3">Massey Ferguson Tractor 375</h1>
              <p className="text-3xl font-bold text-green-900 mt-3">₦15,000,000</p>
              
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4" /> Kaduna, Nigeria
                <span className="mx-2">·</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Used</span>
              </div>

              <div className="mt-6 space-y-4">
                <button className="w-full bg-amber-600 text-white rounded-xl py-3.5 font-semibold hover:bg-amber-700 transition shadow-md">Buy Now</button>
                <button className="w-full border-2 border-green-900 text-green-900 rounded-xl py-3.5 font-semibold hover:bg-green-50 transition">Message Seller</button>
                <a href="https://wa.me/2349077753551" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-3.5 font-semibold hover:bg-green-700 transition">
                  <Phone className="w-4 h-4" /> Continue on WhatsApp
                </a>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">🔒 Secured by Paystack Escrow</p>
            </div>

            {/* Seller Card */}
            <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mt-4">
              <div className="flex items-center gap-3">
                <Image src="https://i.pravatar.cc/150?img=11" alt="Seller" width={48} height={48} className="rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    AgroTech Ltd <ShieldCheck className="w-4 h-4 text-green-700" />
                  </p>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-500" /> 4.8 (120 reviews)
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">📍 Kaduna · Verified Seller · 98% response rate</p>
            </div>
          </div>

        </div>

        {/* Description */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-600 leading-relaxed">
            Massey Ferguson 375 tractor in excellent working condition. 75HP engine, 4-wheel drive, 
            recently serviced. Perfect for ploughing, harrowing, and haulage. Comes with original 
            documents. Located in Kaduna. Inspection welcome before purchase.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div><span className="text-sm text-gray-400">Brand:</span> <span className="font-medium">Massey Ferguson</span></div>
            <div><span className="text-sm text-gray-400">Model:</span> <span className="font-medium">375 (75HP)</span></div>
            <div><span className="text-sm text-gray-400">Year:</span> <span className="font-medium">2020</span></div>
            <div><span className="text-sm text-gray-400">Condition:</span> <span className="font-medium">Used</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}
