'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '₦0',
    period: '/month',
    icon: '🌱',
    features: ['3 active listings', '3 images per listing', 'Standard support', 'Basic analytics'],
    missing: ['Verified badge', 'Featured listings', 'Bulk upload', 'API access'],
    cta: 'Get Started Free',
    style: 'secondary',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₦5,000',
    period: '/month',
    icon: '🌿',
    features: ['15 active listings', '8 images per listing', 'Verified Seller badge', '1 featured listing/month', '24hr support'],
    missing: ['Bulk upload', 'API access'],
    cta: 'Start Pro Plan',
    style: 'primary',
    popular: true,
  },
  {
    name: 'Premium',
    price: '₦15,000',
    period: '/month',
    icon: '🌳',
    features: ['50 active listings', '15 images per listing', '5 featured listings/month', 'Advanced analytics', 'Bulk CSV upload', 'Custom storefront', 'WhatsApp integration', 'Priority 12hr support'],
    missing: ['API access'],
    cta: 'Start Premium Plan',
    style: 'gold',
    popular: false,
  },
  {
    name: 'Business',
    price: '₦50,000',
    period: '/month',
    icon: '🏢',
    features: ['Unlimited listings', '25 images per listing', '15 featured listings/month', 'Advanced analytics + Export', 'API access', '10 team accounts', 'Custom storefront', 'Instant escrow release', 'Dedicated account manager'],
    missing: [],
    cta: 'Start Business Plan',
    style: 'dark',
    popular: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[3px] text-amber-600 mb-4">Simple Pricing</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">From small-scale farmers to large agricultural enterprises. All plans include secure Paystack escrow.</p>
          
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`w-14 h-7 rounded-full transition ${annual ? 'bg-green-700' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition ${annual ? 'left-7' : 'left-0.5'}`} />
            </button>
            <span className={`text-sm ${annual ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>Annual <span className="text-green-700 text-xs">(Save 17%)</span></span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-2xl shadow-sm border p-8 relative ${plan.popular ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-200'}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
              )}
              <div className="text-center">
                <span className="text-4xl">{plan.icon}</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-3">{plan.name}</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{annual ? '₦' + Math.round(parseInt(plan.price.replace('₦','').replace(',','')) * 10).toLocaleString() : plan.price}<span className="text-lg font-normal text-gray-400">{plan.period}</span></p>
                {annual && plan.price !== '₦0' && <p className="text-xs text-green-700 mt-1">per month, billed annually</p>}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> {f}</li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300"><X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link href="/signup" className={`block text-center mt-8 rounded-xl py-3 font-semibold transition ${
                plan.style === 'primary' ? 'bg-green-900 text-white hover:bg-green-800' :
                plan.style === 'gold' ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md' :
                plan.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' :
                'border-2 border-green-900 text-green-900 hover:bg-green-50'
              }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          {[
            { q: 'Can I switch plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
            { q: 'What happens when I cancel?', a: 'Your listings remain active until the end of your billing period. After that, your account reverts to Basic.' },
            { q: 'Is there a free trial?', a: 'You can start with the Basic plan which is completely free. Upgrade when you need more features.' },
          ].map((faq) => (
            <details key={faq.q} className="group border border-gray-200 rounded-2xl p-5 mb-3 hover:border-green-200 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 list-none">{faq.q}</summary>
              <p className="text-gray-500 mt-3 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>

      </div>
    </div>
  );
               }
