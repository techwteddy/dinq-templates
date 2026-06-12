'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import ProductCard from '@/components/product/ProductCard';
import Image from 'next/image';
import { ShoppingBag, Minus, Plus, Star, Sparkles, FlaskConical, AlignLeft, ArrowLeft, ArrowRight, Flame } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        async function fetchProductData() {
            try {
                setLoading(true);
                // Fetch current product
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (productError) throw productError;
                setProduct(productData);

                // Fetch related products (same category)
                const { data: relatedData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', productData.category)
                    .neq('id', productData.id)
                    .limit(4);

                setRelatedProducts(relatedData || []);

            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchProductData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-paper">
                <Marquee />
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 animate-pulse">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="bg-white border-2 border-ink rounded-3xl aspect-square" />
                        <div className="space-y-6">
                            <div className="h-20 bg-ink/10 rounded-xl" />
                            <div className="h-10 w-1/3 bg-ink/10 rounded-xl" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) return null;

    const handleAddToCart = () => {
        addItem({
            product_id: product.id,
            product_name: product.name,
            product_image: product.images[0] || '/placeholder.png',
            price: product.price,
            quantity: quantity,
        });
    };

    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper">

                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-40 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                        <button onClick={() => router.back()} className="hover:text-ink hover:underline flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> BACK
                        </button>
                        <span className="opacity-20 text-xs">/</span>
                        <Link href="/shop" className="hover:text-ink">CATALOG</Link>
                        <span className="opacity-20 text-xs">/</span>
                        <span className="text-ink opacity-100 border-b-2 border-acid">{product.name}</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
                    <div className="grid lg:grid-cols-12 gap-12 items-start mb-32">
                        {/* Left Column: Image */}
                        <div className="lg:col-span-7 sticky top-32">
                            <div className="relative bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl overflow-hidden aspect-square md:aspect-[4/3] group">
                                <div className="absolute top-6 left-6 z-20 -rotate-6">
                                    <div className="bg-ink text-acid px-4 py-2 rounded-lg border-2 border-acid shadow-md flex items-center gap-2">
                                        <Star className="w-4 h-4 fill-acid" />
                                        <span className="font-display text-xs tracking-wider uppercase">High Potency</span>
                                    </div>
                                </div>
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="absolute inset-0 w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="text-9xl text-center flex items-center justify-center h-full">🌿</div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div className="border-b-2 border-ink/10 pb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="acid">{product.category.toUpperCase()}</Badge>
                                    <div className="flex items-center gap-1 text-ink bg-stone/50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                                        <Star className="w-3 h-3 fill-ink stroke-none" />
                                        4.9 (42 reviews)
                                    </div>
                                </div>
                                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-ink mb-6 tracking-tighter uppercase italic">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <span className="font-display text-3xl md:text-4xl text-ink leading-none">{formatPrice(product.price)}</span>
                                    {product.mrp > product.price && (
                                        <span className="text-xl font-bold text-ink/40 line-through">{formatPrice(product.mrp)}</span>
                                    )}
                                    <span className="bg-ink text-acid text-[10px] font-bold px-3 py-1 rounded-lg border-2 border-ink tracking-[0.2em] uppercase">
                                        {product.stock_quantity > 0 ? 'STOCK SECURED' : 'UNAVAILABLE'}
                                    </span>
                                </div>
                            </div>

                            {/* Promise Card */}
                            <div className="bg-stone/30 border-2 border-ink rounded-xl p-6 flex gap-4 items-center shadow-hard-sm">
                                <div className="bg-white border-2 border-ink p-3 rounded-lg rotate-3">
                                    <Sparkles className="w-6 h-6 text-ink" />
                                </div>
                                <div>
                                    <h3 className="font-display text-sm uppercase italic">THE HEALMITRA CODE</h3>
                                    <p className="text-xs font-bold opacity-60 mt-1 leading-snug">
                                        No fillers. No lies. <span className="underline decoration-acid decoration-2">Pure biological intelligence</span> for the brave.
                                    </p>
                                </div>
                            </div>

                            {/* Brief Section */}
                            <div className="bg-white border-2 border-ink rounded-2xl p-6 relative shadow-hard-sm">
                                <div className="absolute -top-3 left-4 bg-acid border-2 border-ink px-3 py-1 rounded-full flex items-center gap-2">
                                    <Flame className="w-3 h-3 text-ink" />
                                    <span className="text-xs font-bold uppercase">THE VIBE</span>
                                </div>
                                <p className="font-sans text-lg leading-relaxed font-bold mt-2">
                                    {product.short_description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {['Natural', 'Brave', 'Potent'].map(tag => (
                                        <span key={tag} className="border-2 border-ink rounded-full px-3 py-1 text-xs font-bold hover:bg-ink hover:text-paper transition-colors">#{tag.toUpperCase()}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Purchase Area */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border-2 border-ink rounded-xl bg-white h-16 sm:h-14 w-full sm:w-32 shrink-0 shadow-hard-sm">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="flex-1 h-full hover:bg-acid/30 transition-colors flex items-center justify-center font-bold text-2xl"
                                        >-</button>
                                        <span className="font-display text-2xl w-10 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="flex-1 h-full hover:bg-acid/30 transition-colors flex items-center justify-center font-bold text-2xl"
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock_quantity === 0}
                                        className="flex-1 bg-ink text-acid border-2 border-ink h-16 sm:h-14 rounded-xl font-display text-xl tracking-wide shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase italic"
                                    >
                                        ADD TO GEAR <ShoppingBag className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs / Accordions */}
                            <div className="space-y-4">
                                <details className="group bg-paper border-2 border-ink rounded-xl overflow-hidden cursor-pointer shadow-hard-sm">
                                    <summary className="flex items-center justify-between p-4 font-display text-sm select-none hover:bg-white transition-colors uppercase italic">
                                        <span className="flex items-center gap-3"><AlignLeft className="w-5 h-5" /> Detailed Insight</span>
                                        <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
                                    </summary>
                                    <div className="p-6 pt-0 border-t-2 border-ink/10 mt-2 bg-white font-sans font-bold leading-relaxed opacity-80">
                                        {product.description}
                                    </div>
                                </details>

                                <details className="group bg-white border-2 border-ink rounded-xl overflow-hidden cursor-pointer shadow-hard-sm">
                                    <summary className="flex items-center justify-between p-4 font-display text-sm select-none hover:bg-stone/20 transition-colors uppercase italic">
                                        <span className="flex items-center gap-3"><Sparkles className="w-5 h-5" /> Biological Impact</span>
                                        <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
                                    </summary>
                                    <div className="p-6 pt-0 border-t-2 border-ink/10 mt-2">
                                        <ul className="space-y-3">
                                            {product.benefits?.map((benefit, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="min-w-[1.25rem] h-5 bg-acid rounded border border-ink mt-0.5 shadow-hard-sm flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-ink rotate-45" />
                                                    </div>
                                                    <span className="font-bold text-sm opacity-80">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* New Section: Build Your Rotation */}
                    {relatedProducts.length > 0 && (
                        <section className="pt-24 border-t-2 border-dashed border-ink/20">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                                <div>
                                    <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none mb-4">
                                        BUILD YOUR <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>ROTATION</span>
                                    </h2>
                                    <p className="font-sans text-xl font-bold opacity-40">Don't settle for one gear. Build a rotation of wisdom.</p>
                                </div>
                                <Link href="/shop" className="group flex items-center gap-3 font-display text-lg hover:text-acid transition-colors">
                                    VIEW FULL CATALOG <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
