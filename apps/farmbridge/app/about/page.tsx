import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <section className="relative h-96">
        <Image src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80" alt="Farmland" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <p className="text-xs font-bold uppercase tracking-[3px] text-amber-400 mb-4">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Building the Future of Nigerian Agriculture</h1>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-2xl p-8 text-center">
              <span className="text-4xl">🎯</span>
              <h3 className="text-xl font-serif font-bold text-gray-900 mt-4">Our Mission</h3>
              <p className="text-gray-500 mt-2">To empower Nigerian farmers with technology that connects them directly to buyers, ensuring fair prices, secure transactions, and sustainable growth.</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-8 text-center">
              <span className="text-4xl">👁️</span>
              <h3 className="text-xl font-serif font-bold text-gray-900 mt-4">Our Vision</h3>
              <p className="text-gray-500 mt-2">A Nigeria where every farmer, regardless of size or location, has equal access to the national agricultural marketplace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">The Problem We Solve</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌍', title: 'Fragmented Markets', desc: 'Farmers struggle to find buyers beyond their local area, limiting their income potential.' },
              { icon: '💰', title: 'Unfair Pricing', desc: 'Middlemen capture the value that should go to hardworking farmers and producers.' },
              { icon: '🤝', title: 'Trust Deficit', desc: 'Buyers cannot verify seller reliability or product quality before making payments.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                <span className="text-5xl">{item.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '🔍', label: 'Transparency' },
              { icon: '⚖️', label: 'Fairness' },
              { icon: '💡', label: 'Innovation' },
              { icon: '🤝', label: 'Community' },
              { icon: '🌱', label: 'Sustainability' },
            ].map((v) => (
              <div key={v.label} className="bg-green-50 rounded-2xl p-6 text-center hover:bg-green-100 transition">
                <span className="text-4xl">{v.icon}</span>
                <p className="font-semibold text-gray-900 mt-2 text-sm">{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-amber-50 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Join the FarmBridge Community</h2>
        <p className="text-gray-500 mt-4">Thousands of farmers and buyers are already trading smarter.</p>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/signup" className="bg-green-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-800 transition">Create Account</Link>
          <Link href="/marketplace" className="bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-700 transition">Browse Marketplace</Link>
        </div>
      </section>
    </div>
  );
}
