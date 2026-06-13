import Image from 'next/image';
import Link from 'next/link';

const posts = [
  { title: 'How Biogas is Revolutionizing Nigerian Farms', excerpt: 'Discover how farmers are turning waste into energy and saving millions.', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80', category: 'Biogas & Energy', date: 'May 15, 2025' },
  { title: '5 Tips for Higher Maize Yield This Season', excerpt: 'Expert advice on soil preparation, seed selection, and pest control.', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80', category: 'Crop Guides', date: 'May 10, 2025' },
  { title: 'Understanding Fertilizer Prices in 2025', excerpt: 'A comprehensive guide to current market trends.', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', category: 'Market Insights', date: 'May 8, 2025' },
  { title: 'Choosing the Right Tractor for Your Farm', excerpt: 'What to consider before investing in farm machinery.', image: 'https://images.unsplash.com/photo-1530267981375-5f0b1f2e9b1d?w=800&q=80', category: 'Machinery Tips', date: 'May 5, 2025' },
  { title: 'Success Story: From 2 to 50 Hectares', excerpt: 'How a small-scale farmer scaled up using FarmBridge.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80', category: 'Success Stories', date: 'May 1, 2025' },
  { title: 'The Future of Agriculture in Nigeria', excerpt: 'Trends and opportunities for Nigerian farmers in 2025.', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80', category: 'Industry News', date: 'Apr 28, 2025' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[3px] text-amber-600 mb-4">Knowledge Hub</p>
          <h1 className="text-4xl font-serif font-bold text-gray-900">The FarmBridge Blog</h1>
          <p className="text-gray-500 mt-2">Expert insights, farmer stories, and sustainable agriculture guides for Nigeria.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.title} href="/blog" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group">
              <Image src={post.image} alt={post.title} width={400} height={250} className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">{post.category}</span>
                <h3 className="font-semibold text-gray-900 mt-3 group-hover:text-green-800 transition">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{post.excerpt}</p>
                <p className="text-xs text-gray-400 mt-4">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
