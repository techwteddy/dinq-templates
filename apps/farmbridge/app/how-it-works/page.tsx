import Link from 'next/link';
import { UserPlus, Store, Lock } from 'lucide-react';

const steps = [
  { number: '01', icon: UserPlus, title: 'Create Account & Get Verified', desc: 'Sign up as a buyer or seller. Verify your identity to build trust. Buyers can start browsing immediately. Sellers complete a simple verification process.' },
  { number: '02', icon: Store, title: 'Browse or List Products', desc: 'Buyers browse thousands of listings across all categories. Sellers create detailed listings with photos, prices, and descriptions.' },
  { number: '03', icon: Lock, title: 'Secure Transaction with Escrow', desc: 'Buyer pays securely via Paystack. Funds are held in escrow. Seller ships the product. Buyer confirms delivery. Funds are released.' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[3px] text-amber-600 mb-4">How It Works</p>
          <h1 className="text-4xl font-serif font-bold text-gray-900">From Farm to Transaction</h1>
          <p className="text-gray-500 mt-4">Three simple steps to start trading on FarmBridge.</p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex gap-6 items-start">
              <span className="text-5xl font-serif font-bold text-green-200 shrink-0">{step.number}</span>
              <div>
                <step.icon className="w-8 h-8 text-green-700 mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 bg-amber-50 rounded-2xl p-8">
          <h3 className="text-xl font-serif font-bold text-gray-900">Ready to Start?</h3>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/signup" className="bg-green-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition">Create Account</Link>
            <Link href="/marketplace" className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition">Browse Marketplace</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
