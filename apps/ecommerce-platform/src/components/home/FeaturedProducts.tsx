'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                // Fetch featured products from Supabase
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .eq('featured', true)
                    .limit(4)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error('MISSION DATA ERROR:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-acid text-ink p-3 rounded-full border-2 border-ink shadow-hard-sm animate-bounce">
                            <Flame className="w-6 h-6 fill-ink" />
                        </div>
                        <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase">
                            NEW <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>DROPS</span>
                        </h2>
                    </div>
                    <Link href="/shop" className="group flex items-center gap-3 font-display text-lg hover:text-acid transition-colors">
                        SEE ALL <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-paper border-2 border-ink rounded-2xl h-96 animate-pulse shadow-hard" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-ink/20 rounded-3xl bg-paper">
                        <div className="text-6xl mb-4">🌿</div>
                        <p className="font-display text-2xl text-ink/40">DROPPING SOON</p>
                    </div>
                )}
            </div>
        </section>
    );
}
