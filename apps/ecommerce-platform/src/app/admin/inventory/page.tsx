'use client';

import { useState, useEffect } from 'react';
import {
    Edit3,
    Plus,
    Archive,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Package
} from 'lucide-react';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');

    const fetchInventory = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('products')
                .select('*')
                .order('stock_quantity', { ascending: true });

            if (categoryFilter) {
                query = query.eq('category', categoryFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [categoryFilter]);

    const lowStockCount = products.filter(p => p.stock_quantity < 10 && p.stock_quantity > 0).length;
    const depletedCount = products.filter(p => p.stock_quantity === 0).length;

    const columns = [
        {
            header: 'Cargo Identity',
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
                <span className="font-mono text-xs font-bold bg-stone/30 px-2 py-1 rounded border border-ink/10">{product.sku}</span>
            )
        },
        {
            header: 'Cargo Qty',
            accessor: (product: Product) => (
                <div className="flex flex-col items-center">
                    <span className={`font-display text-2xl ${product.stock_quantity < 10 ? 'text-red-500' : 'text-ink'}`}>
                        {product.stock_quantity}
                    </span>
                    <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{product.weight}</span>
                </div>
            )
        },
        {
            header: 'Audit Status',
            accessor: (product: Product) => (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-ink text-[10px] font-bold uppercase shadow-hard-sm ${product.stock_quantity > 10 ? 'bg-acid text-ink' :
                    product.stock_quantity > 0 ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                    }`}>
                    {product.stock_quantity > 10 ? <CheckCircle2 className="w-3 h-3" /> :
                        product.stock_quantity > 0 ? <AlertTriangle className="w-3 h-3" /> :
                            <XCircle className="w-3 h-3" />}
                    {product.stock_quantity > 10 ? 'Secure' :
                        product.stock_quantity > 0 ? 'Depleting' :
                            'Empty'}
                </div>
            )
        },
        {
            header: 'Logistics',
            className: 'text-right',
            accessor: (product: Product) => (
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="p-2 min-w-0">
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button variant="default" size="sm" className="p-2 min-w-0">
                        <Archive className="w-4 h-4" />
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
                        STOCK <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>REGISTRY.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Precision inventory tracking & audit logs</p>
                </div>
                <Button size="md" className="uppercase italic">
                    <Plus className="w-5 h-5 mr-2" /> Bulk Restock
                </Button>
            </div>

            {/* Critical Depletion Alert */}
            {!loading && (lowStockCount > 0 || depletedCount > 0) && (
                <div className="bg-ink text-acid border-2 border-ink rounded-2xl p-6 flex items-center justify-between shadow-hard-acid">
                    <div className="flex items-center gap-4">
                        <div className="bg-acid text-ink p-2 rounded border border-ink shadow-hard-sm">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-display text-lg italic uppercase">CARGO DEPLETION DETECTED</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                {lowStockCount} items depleting, {depletedCount} items empty
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <DataTable
                data={products}
                columns={columns as any}
                searchKey="name"
                searchPlaceholder="SCAN CARGO MANIFESTS..."
                loading={loading}
                filters={[
                    {
                        label: 'Sector',
                        options: Array.from(new Set(products.map(p => p.category))),
                        onFilter: setCategoryFilter
                    }
                ]}
            />
        </div>
    );
}
