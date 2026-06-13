'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [showSellerForm, setShowSellerForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Welcome, Ibrahim 👋</h1>
          <p className="text-gray-500 mt-1">You are signed in as a <span className="font-semibold text-green-700">Buyer</span></p>
        </div>

        {/* Become a Seller */}
        {!showSellerForm ? (
          <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-2xl border border-green-200 p-8 text-center">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Want to Sell on FarmBridge?</h2>
            <p className="text-gray-500 mb-6">List your products and reach thousands of buyers across Nigeria.</p>
            <button
              onClick={() => setShowSellerForm(true)}
              className="bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-700 transition shadow-md"
            >
              Become a Seller
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Set Up Your Seller Profile</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Farm / Business Name</label>
                <input type="text" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="AgroTech Farms Ltd" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <select className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" required>
                  <option value="">Select State</option>
                  <option>Abia</option><option>Adamawa</option><option>Akwa Ibom</option><option>Anambra</option>
                  <option>Bauchi</option><option>Bayelsa</option><option>Benue</option><option>Borno</option>
                  <option>Cross River</option><option>Delta</option><option>Ebonyi</option><option>Edo</option>
                  <option>Ekiti</option><option>Enugu</option><option>Gombe</option><option>Imo</option>
                  <option>Jigawa</option><option>Kaduna</option><option>Kano</option><option>Katsina</option>
                  <option>Kebbi</option><option>Kogi</option><option>Kwara</option><option>Lagos</option>
                  <option>Nasarawa</option><option>Niger</option><option>Ogun</option><option>Ondo</option>
                  <option>Osun</option><option>Oyo</option><option>Plateau</option><option>Rivers</option>
                  <option>Sokoto</option><option>Taraba</option><option>Yobe</option><option>Zamfara</option>
                  <option>FCT Abuja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Tractors & Machinery', 'Seeds & Seedlings', 'Fertilizers', 'Crops & Harvest', 'Livestock & Feed', 'Irrigation', 'Tools', 'Processing Equipment'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded text-green-700 focus:ring-green-600" /> {cat}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" rows={3} placeholder="Tell buyers about your farm or business..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSellerForm(false)} className="flex-1 border-2 border-gray-300 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-amber-600 text-white rounded-xl py-3 font-semibold hover:bg-amber-700 transition shadow-md">Complete Setup</button>
              </div>
            </form>
          </div>
        )}

        {/* Buyer Features */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Browse Products', href: '/marketplace', icon: '🛒' },
            { label: 'My Orders', href: '/dashboard/orders', icon: '📦' },
            { label: 'Saved Items', href: '/dashboard/wishlist', icon: '❤️' },
            { label: 'Messages', href: '/dashboard/messages', icon: '💬' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
              <span className="text-3xl">{item.icon}</span>
              <p className="font-medium text-gray-900 mt-2 text-sm">{item.label}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
