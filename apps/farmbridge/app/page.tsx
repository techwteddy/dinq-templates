import Image from 'next/image';
import Link from 'next/link';
import {
  Tractor,
  Sprout,
  FlaskConical,
  ShoppingBasket,
  Droplets,
  Wrench,
  Beef,
  Cog,
  ShieldCheck,
  Lock,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  Phone,
  MessageCircle,
  LogIn,
  UserPlus,
  Store,
  Tag,
  HelpCircle,
} from 'lucide-react';

const categories = [
  { icon: Tractor, label: 'Tractors & Machinery', count: '1,200+' },
  { icon: Sprout, label: 'Seeds & Seedlings', count: '3,500+' },
  { icon: FlaskConical, label: 'Fertilizers & Chemicals', count: '2,100+' },
  { icon: ShoppingBasket, label: 'Crops & Harvest', count: '4,800+' },
  { icon: Droplets, label: 'Irrigation Equipment', count: '900+' },
  { icon: Wrench, label: 'Tools & Implements', count: '1,600+' },
  { icon: Beef, label: 'Livestock & Feed', count: '2,300+' },
  { icon: Cog, label: 'Processing Equipment', count: '700+' },
];

const testimonials = [
  { quote: 'FarmBridge helped me sell 50 tonnes of maize in just 3 days. The escrow system gave me confidence.', name: 'Ibrahim Musa', role: 'Maize Farmer, Kaduna', avatar: 'https://i.pravatar.cc/150?img=11', rating: 5 },
  { quote: 'I found a reliable tractor dealer within 24 hours. Verified sellers make all the difference.', name: 'Grace Okonkwo', role: 'Rice Farmer, Ebonyi', avatar: 'https://i.pravatar.cc/150?img=23', rating: 5 },
  { quote: 'As a fertilizer supplier, FarmBridge connects me to genuine buyers. My sales have doubled.', name: 'Ahmed Bello', role: 'Agro Dealer, Kano', avatar: 'https://i.pravatar.cc/150?img=45', rating: 5 },
];

const faqs = [
  { q: 'Is FarmBridge free to use?', a: 'Yes! Buyers can browse and purchase for free. Sellers can start with a free Basic plan.' },
  { q: 'How does escrow payment work?', a: 'Payment is held securely by Paystack until you confirm delivery. Your money is always protected.' },
  { q: 'How do I become a verified seller?', a: 'Upload your government ID and bank details. Our team reviews within 24-48 hours.' },
  { q: 'What can I buy and sell on FarmBridge?', a: 'Tractors, seeds, fertilizers, crops, livestock, irrigation equipment, tools, and much more.' },
];

const blogPosts = [
  { title: 'How Biogas is Revolutionizing Nigerian Farms', excerpt: 'Discover how farmers are turning waste into energy and saving millions.', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80', category: 'Biogas & Energy', date: 'May 15, 2025', readTime: '5 min read' },
  { title: '5 Tips for Higher Maize Yield This Season', excerpt: 'Expert advice on soil preparation, seed selection, and pest control.', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80', category: 'Crop Guides', date: 'May 10, 2025', readTime: '4 min read' },
  { title: 'Understanding Fertilizer Prices in 2025', excerpt: 'A comprehensive guide to current market trends and what to expect.', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', category: 'Market Insights', date: 'May 8, 2025', readTime: '6 min read' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function SectionHeading({ overline, title, description }: { overline: string; title: string; description?: string }) {
  return (
    <div className="text-center mb-16">
      <p className="text-xs font-bold uppercase tracking-[3px] text-amber-600 mb-4">{overline}</p>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{title}</h2>
      {description && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{description}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-green-900">FarmBridge</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-green-800">Marketplace</Link>
              <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-green-800">How It Works</Link>
              <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-green-800">Blog</Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-green-800">About</Link>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <a href="https://wa.me/2349077753551" className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                <MessageCircle className="w-4 h-4" /> Chat Us
              </a>
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-xl transition">
                  <span className="w-1.5 h-1.5 bg-green-900 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-green-900 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-green-900 rounded-full"></span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"><LogIn className="w-4 h-4" /> Sign In</Link>
                  <Link href="/signup" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"><UserPlus className="w-4 h-4" /> Create Account</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link href="/dashboard/verify" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"><ShieldCheck className="w-4 h-4" /> KYC Verification</Link>
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"><Store className="w-4 h-4" /> Start Selling</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link href="/pricing" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"><Tag className="w-4 h-4" /> Pricing Plans</Link>
                  <Link href="/contact" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"><HelpCircle className="w-4 h-4" /> Help & Support</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="pt-20 md:pt-28 pb-16 md:pb-24 bg-gradient-to-br from-green-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[3px] text-amber-600 mb-4">Nigeria&apos;s Agricultural Nexus</p>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">Connect Directly With Verified Farmers & Buyers</h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">Skip the middlemen. Access fair prices, secure payments, and a nationwide network of trusted agricultural partners.</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/marketplace" className="border-2 border-green-900 text-green-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-green-50 transition">Browse Marketplace</Link>
                <Link href="/signup" className="bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-700 transition shadow-md">Start Selling</Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-700" /> Paystack Secure</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-700" /> Verified Sellers</span>
                <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-green-700" /> Escrow Protected</span>
              </div>
            </div>
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80" alt="Nigerian farmer in field" width={600} height={450} className="rounded-3xl shadow-2xl w-full h-auto" priority />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl"><ShieldCheck className="w-6 h-6 text-green-700" /></div>
                <div><p className="font-bold text-gray-900">₦500M+</p><p className="text-xs text-gray-500">Secured Transactions</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="What We Trade" title="Explore Agricultural Categories" description="Everything you need for your farm, all in one place." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} href="/marketplace" className="bg-green-50 border-0 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <cat.icon className="w-10 h-10 text-green-800 mx-auto mb-3 group-hover:scale-110 transition" />
                <h4 className="font-semibold text-gray-900 text-sm">{cat.label}</h4>
                <p className="text-xs text-gray-400 mt-1">{cat.count} listings</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="How FarmBridge Works" title="From Farm to Transaction in 3 Simple Steps" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: CheckCircle, title: 'Create Account & Get Verified', desc: 'Sign up as a buyer or seller. Verify your identity to build trust and unlock full features.' },
              { step: '02', icon: ShoppingBasket, title: 'List Products or Browse Listings', desc: 'Sellers list their products with photos and prices. Buyers browse and find what they need.' },
              { step: '03', icon: Lock, title: 'Transact Securely with Escrow', desc: 'Payment is held safely by Paystack. Funds are released only when the buyer confirms delivery.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <span className="absolute top-4 right-6 text-7xl font-serif font-bold text-green-100">{item.step}</span>
                <item.icon className="w-8 h-8 text-green-800 mb-4 relative z-10" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 relative z-10">{item.title}</h3>
                <p className="text-gray-500 text-sm relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="py-16 bg-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Farmers Connected' },
              { number: '₦500M+', label: 'Transactions Secured' },
              { number: '5,000+', label: 'Verified Sellers' },
              { number: '48', label: 'States Covered' },
            ].map((stat) => (
              <div key={stat.label}><p className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{stat.number}</p><p className="text-green-300 text-sm">{stat.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY FARMBRIDGE ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="Why FarmBridge" title="Built for Trust, Designed for Growth" />
          <div className="space-y-16">
            {[
              { icon: ShieldCheck, title: 'Verified Sellers You Can Trust', desc: 'Every seller undergoes identity verification. Trade with confidence knowing you are dealing with real, verified partners.', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80' },
              { icon: Lock, title: 'Secure Escrow Payments', desc: 'Your money is protected. Payment is held securely by Paystack and only released when you confirm successful delivery.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' },
              { icon: Globe, title: 'Nationwide Reach', desc: 'Connect with farmers and buyers across all 48 states. No matter where you are, FarmBridge brings the market to you.', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80' },
            ].map((item, i) => (
              <div key={item.title} className={`grid md:grid-cols-2 gap-12 items-center`}>
                <div className={i % 2 === 1 ? 'md:order-2' : ''}><Image src={item.img} alt={item.title} width={500} height={350} className="rounded-2xl shadow-lg w-full h-auto" /></div>
                <div>
                  <item.icon className="w-10 h-10 text-green-800 mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /> Trusted by thousands</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /> 24/7 support available</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="From Our Community" title="Trusted by Farmers & Buyers Nationwide" />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <StarRating rating={t.rating} />
                <p className="text-gray-600 italic my-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full" />
                  <div><p className="font-semibold text-gray-900 text-sm">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[3px] text-amber-600 mb-4">Insights & Guides</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Latest from the FarmBridge Blog</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-1 text-green-800 font-medium hover:underline">View All Posts <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.title} href="/blog" className="group rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <Image src={post.image} alt={post.title} width={400} height={250} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">{post.category}</span>
                  <h4 className="font-semibold text-gray-900 mt-3 group-hover:text-green-800 transition">{post.title}</h4>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-400"><span>{post.date}</span><span>·</span><span>{post.readTime}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Ready to Transform Your Agricultural Trade?</h2>
          <p className="text-lg text-gray-500 mb-8">Join thousands of farmers and buyers already trading smarter on FarmBridge.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-green-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-800 transition">Create Account</Link>
            <Link href="/login" className="bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-700 transition shadow-md">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="Got Questions?" title="Frequently Asked Questions" />
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border border-gray-200 rounded-2xl p-5 hover:border-green-200 transition">
                <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:hidden" />
                  <ChevronUp className="w-5 h-5 text-green-700 hidden group-open:block" />
                </summary>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/faq" className="text-green-800 font-medium hover:underline">See Full FAQ <ArrowRight className="w-4 h-4 inline" /></Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-green-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center"><Sprout className="w-5 h-5 text-green-300" /></div>
                <span className="font-extrabold text-xl text-white">FarmBridge</span>
              </Link>
              <p className="text-green-300 text-sm max-w-sm">Nigeria&apos;s premium agricultural marketplace. Connecting verified farmers and buyers with secure escrow protection.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/legal" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/legal" className="hover:text-white">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><a href="https://wa.me/2349077753551" className="hover:text-white flex items-center gap-1"><MessageCircle className="w-4 h-4" /> 09057773551</a></li>
                <li><a href="mailto:farmpricenigeria@gmail.com" className="hover:text-white">farmpricenigeria@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-green-400">
            © 2025 FarmBridge. All rights reserved. Built in Nigeria 🇳🇬
          </div>
        </div>
      </footer>

    </div>
  );
}
