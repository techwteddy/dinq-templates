'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';

export default function EditProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product for edit:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-pulse">
                <h2 className="font-display text-4xl uppercase italic opacity-20">DECRYPTING FORMULA...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                <h2 className="font-display text-4xl uppercase italic mb-4">Formula Lost</h2>
                <p className="font-bold opacity-40 uppercase tracking-widest text-xs mb-8">This asset identifier does not exist in our library.</p>
                <Link href="/admin/products">
                    <button className="bg-ink text-acid px-8 py-4 rounded-xl font-display uppercase italic">Return to Library</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
                </Link>
                <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                    EDIT <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>{product.name}.</span>
                </h1>
                <p className="font-bold opacity-40 uppercase tracking-widest text-xs italic">Modify existing Ayurvedic asset parameters</p>
            </div>

            <ProductForm mode="edit" initialData={product} />
        </div>
    );
}
