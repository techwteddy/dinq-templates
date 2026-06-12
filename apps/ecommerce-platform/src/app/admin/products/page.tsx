'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Edit3,
    Trash2,
    Package,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching admin products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('ARE YOU SURE YOU WANT TO TERMINATE THIS FORMULA?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const columns = [
        {
            header: 'Item Data',
            accessor: (product: Product) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-paper border-2 border-ink rounded-lg overflow-hidden shrink-0 relative group-hover:rotate-3 transition-transform">
                        {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" unoptimized />
                        ) : (
                            <span className="flex items-center justify-center h-full text-2xl">🌿</span>
                        )}
                    </div>
                    <div>
                        <p className="font-display text-sm italic">{product.name}</p>
                        <p className="text-[10px] font-bold opacity-30 uppercase">{product.category}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'SKU',
            accessor: (product: Product) => (
                <span className="font-mono text-xs font-bold bg-stone/20 px-2 py-1 rounded border border-ink/10">{product.sku}</span>
            )
        },
        {
            header: 'Price',
            accessor: (product: Product) => (
                <div>
                    <p className="font-display text-sm">{formatPrice(product.price)}</p>
                    <p className="text-[10px] font-bold opacity-30 line-through italic">{formatPrice(product.mrp)}</p>
                </div>
            )
        },
        {
            header: 'Stock',
            accessor: (product: Product) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? 'bg-acid' : 'bg-red-500'}`} />
                    <span className={`font-display text-lg ${product.stock_quantity < 10 ? 'text-red-500' : 'text-ink'}`}>
                        {product.stock_quantity}
                    </span>
                    <span className="text-[8px] font-bold opacity-30 uppercase">Units</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (product: Product) => (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-ink text-[10px] font-bold uppercase shadow-hard-sm ${product.is_active ? 'bg-acid text-ink' : 'bg-stone text-ink/40'}`}>
                    {product.is_active ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {product.is_active ? 'Active' : 'Archived'}
                </div>
            )
        },
        {
            header: 'Operations',
            className: 'text-right',
            accessor: (product: Product) => (
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="p-2 min-w-0">
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button variant="default" size="sm" className="p-2 min-w-0" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                        CATALOG <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>LIBRARY.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Manage your library of Ayurvedic formulations</p>
                </div>
                <Link href="/admin/products/new">
                    <Button size="md" className="uppercase italic">
                        <Plus className="w-5 h-5 mr-2" /> NEW FORMULA
                    </Button>
                </Link>
            </div>

            <DataTable
                data={products}
                columns={columns as any}
                searchKey="name"
                searchPlaceholder="SEARCH CATALOG..."
                loading={loading}
            />
        </div>
    );
}
