'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types/database';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const discount = getDiscountPercentage(product.mrp, product.price);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            product_id: product.id,
            product_name: product.name,
            product_image: product.images[0] || '/placeholder.png',
            price: product.price,
            quantity: 1,
        });
    };

    return (
        <div className="group relative bg-paper border-2 border-ink rounded-2xl overflow-hidden hover:shadow-hard-xl transition-all duration-300 flex flex-col h-full">
            {/* Label */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white border-2 border-ink px-2 py-0.5 text-[10px] font-bold rounded uppercase shadow-hard-sm">
                    {product.category}
                </span>
                {discount > 0 && (
                    <span className="bg-acid text-ink border-2 border-ink px-2 py-0.5 text-[10px] font-bold rounded uppercase shadow-hard-sm">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Image Area */}
            <Link href={`/products/${product.slug}`} className="block aspect-[4/5] bg-white border-b-2 border-ink relative overflow-hidden p-6 flex items-center justify-center shrink-0">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                    />
                ) : (
                    <div className="text-8xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center h-full w-full">🌿</div>
                )}

                {/* Hover Quick Action */}
                <div className="absolute inset-x-4 bottom-4 translate-y-24 group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0}
                        className="w-full bg-ink text-acid font-display text-sm py-3 rounded-xl shadow-hard-sm flex items-center justify-center gap-2 border-2 border-ink hover:bg-acid hover:text-ink transition-colors disabled:opacity-50"
                    >
                        ADD TO CART <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>

                {/* Out of Stock */}
                {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-ink/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
                        <span className="bg-ink text-paper px-4 py-2 border-2 border-paper rounded-lg font-display text-xs uppercase tracking-wider">Sold Out</span>
                    </div>
                )}
            </Link>

            {/* Info Area */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-display text-lg leading-tight group-hover:text-acid group-hover:bg-ink group-hover:px-1 rounded transition-all">
                            {product.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-ink/40 uppercase mb-3">
                        <Star className="w-3 h-3 fill-acid stroke-ink stroke-1" />
                        <span>Top Rated</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-ink/10">
                    <div className="flex flex-col">
                        <span className="font-display text-xl text-ink leading-none">{formatPrice(product.price)}</span>
                        {product.mrp > product.price && (
                            <span className="text-[10px] font-bold text-ink/40 line-through mt-1">{formatPrice(product.mrp)}</span>
                        )}
                    </div>
                    <Link href={`/products/${product.slug}`} className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center hover:bg-acid transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
