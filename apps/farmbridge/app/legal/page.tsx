'use client';

import { useState } from 'react';

export default function LegalPage() {
  const [tab, setTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 text-center mb-8">Legal</h1>
        
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8 max-w-xs mx-auto">
          <button onClick={() => setTab('privacy')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${tab === 'privacy' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Privacy Policy</button>
          <button onClick={() => setTab('terms')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${tab === 'terms' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Terms & Conditions</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {tab === 'privacy' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Privacy Policy</h2>
              <p className="text-gray-500 text-sm mb-6">Last updated: June 2025</p>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <div><h3 className="font-semibold text-gray-900">1. Information We Collect</h3><p>We collect your name, email, phone number, location, and transaction data when you use FarmBridge.</p></div>
                <div><h3 className="font-semibold text-gray-900">2. How We Use Your Information</h3><p>To provide and improve our marketplace, process payments via Paystack, verify identities, and send account notifications.</p></div>
                <div><h3 className="font-semibold text-gray-900">3. Data Sharing</h3><p>We share data only with Paystack (payments) and Supabase (storage). We never sell your data.</p></div>
                <div><h3 className="font-semibold text-gray-900">4. Security</h3><p>Your data is encrypted and stored securely with industry-standard protection.</p></div>
                <div><h3 className="font-semibold text-gray-900">5. Contact</h3><p>Questions? WhatsApp: 09057773551 | Email: farmpricenigeria@gmail.com</p></div>
              </div>
            </div>
          )}
          {tab === 'terms' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Terms & Conditions</h2>
              <p className="text-gray-500 text-sm mb-6">Last updated: June 2025</p>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <div><h3 className="font-semibold text-gray-900">1. Acceptance</h3><p>By using FarmBridge, you agree to these terms.</p></div>
                <div><h3 className="font-semibold text-gray-900">2. Accounts</h3><p>Provide accurate information. You are responsible for your account security.</p></div>
                <div><h3 className="font-semibold text-gray-900">3. Sellers</h3><p>List products accurately with real photos. Fulfill orders promptly.</p></div>
                <div><h3 className="font-semibold text-gray-900">4. Buyers</h3><p>Complete payment before delivery. Inspect products and report issues within 72 hours.</p></div>
                <div><h3 className="font-semibold text-gray-900">5. Payments</h3><p>All payments processed via Paystack escrow. Funds released after delivery confirmation.</p></div>
                <div><h3 className="font-semibold text-gray-900">6. Disputes</h3><p>Raise disputes within 72 hours. FarmBridge reviews evidence and makes fair resolutions.</p></div>
                <div><h3 className="font-semibold text-gray-900">7. Contact</h3><p>WhatsApp: 09057773551 | Email: farmpricenigeria@gmail.com</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
