import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
                </Link>
                <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                    NEW <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>FORMULA.</span>
                </h1>
                <p className="font-bold opacity-40 uppercase tracking-widest text-xs italic">Initialize a new Ayurvedic asset in the library</p>
            </div>

            <ProductForm mode="create" />
        </div>
    );
}
