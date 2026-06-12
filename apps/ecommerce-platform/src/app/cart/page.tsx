'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import Badge from '@/components/ui/Badge';
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
    ChevronRight,
    ShieldCheck,
    Truck,
    Undo2,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Lock,
    Zap,
    Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        getTotal,
        getShipping,
        getTax,
        getGrandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon
    } = useCartStore();

    const [couponCode, setCouponCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [removeModalItem, setRemoveModalItem] = useState<{ id: string, name: string, image?: string } | null>(null);
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

    const subtotal = getTotal();
    const shipping = getShipping();
    const tax = getTax();
    const discount = appliedCoupon?.discountAmount || 0;
    const total = getGrandTotal();
    const freeShippingThreshold = 499;
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    const remainingForFree = freeShippingThreshold - subtotal;

    // Handle quantity update with local loading state
    const handleUpdateQty = async (id: string, newQty: number) => {
        if (newQty < 1) return;
        setUpdatingIds(prev => new Set(prev).add(id));

        // Debounce simulation / ensure store update
        setTimeout(() => {
            updateQuantity(id, newQty);
            setUpdatingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 300);
    };

    // Handle coupon application
    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setIsValidating(true);
        try {
            const res = await fetch('/api/checkout/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
            });

            const data = await res.json();
            if (data.success) {
                applyCoupon(data.coupon);
                toast.success('COUPON ACTIVATED ✦');
                setCouponCode('');
            } else {
                toast.error(data.message.toUpperCase());
            }
        } catch (error) {
            toast.error('COMMUNICATION ERROR');
        } finally {
            setIsValidating(false);
        }
    };

    if (items.length === 0) {
        return (
            <>
                <Marquee />
                <Navbar />
                <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 pb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 max-w-md w-full"
                    >
                        <div className="bg-stone/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-ink shadow-hard relative group">
                            <ShoppingBag className="h-16 w-16 text-ink/30 group-hover:text-ink transition-colors" />
                            <div className="absolute inset-0 bg-acid/20 rounded-full blur-[40px] -z-10 group-hover:blur-[60px] transition-all"></div>
                        </div>
                        <div>
                            <h1 className="font-display text-4xl md:text-5xl text-ink uppercase italic leading-none">
                                Your cart is <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>empty</span>
                            </h1>
                            <p className="font-bold opacity-40 mt-4 uppercase tracking-widest text-xs">Start shopping to add items to your cart</p>
                        </div>
                        <Link href="/shop" className="block pt-4">
                            <button className="w-full bg-ink text-acid border-2 border-ink px-8 py-5 rounded-2xl font-display text-xl tracking-widest uppercase italic shadow-hard hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                                SHOP NOW
                            </button>
                        </Link>
                    </motion.div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                        <Link href="/" className="hover:text-acid transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-ink">Cart</span>
                    </nav>

                    <div className="mb-12">
                        <h1 className="font-display text-5xl md:text-7xl tracking-tighter text-neutral-900 uppercase leading-none font-bold">
                            SHOPPING <span className="text-outline" style={{ WebkitTextStroke: '2.5px #0A2A1F' }}>CART.</span>
                        </h1>
                        <p className="font-bold text-neutral-500 mt-2 uppercase tracking-widest text-xs">
                            {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'} IN YOUR REGISTRY
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 items-start">

                        {/* LEFT COLUMN: ITEM LIST */}
                        <div className="lg:col-span-8 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.product_id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative group overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start lg:items-center">

                                            {/* 1. Product Image */}
                                            <Link
                                                href={`/products/${item.product_id}`}
                                                className="relative w-[140px] h-[140px] md:w-[140px] md:h-[140px] flex-shrink-0 bg-neutral-50 border-2 border-neutral-200 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                                            >
                                                {item.product_image ? (
                                                    <Image
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                                                )}
                                            </Link>

                                            {/* 2. Product Details */}
                                            <div className="flex-1 min-w-0 w-full text-center md:text-left">
                                                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                                    <span className="text-green-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                        <Sparkles className="w-3 h-3 animate-pulse" /> ✦ IN STOCK
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/products/${item.product_id}`}
                                                    className="font-bold text-xl md:text-2xl text-neutral-900 hover:text-acid transition-colors uppercase block leading-none mb-2"
                                                >
                                                    {item.product_name}
                                                </Link>
                                                <p className="text-sm text-neutral-600 truncate mb-2">AUTHENTIC FORMULATION FOR MODERN BODY AND MIND</p>
                                                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">{formatPrice(item.price)} / UNIT</p>

                                                {/* Mobile Specific Price/Qty Info */}
                                                <div className="flex items-center justify-between mt-6 md:hidden">
                                                    <div className="text-left">
                                                        <p className="text-[10px] font-bold text-neutral-700 uppercase mb-1">SUBTOTAL</p>
                                                        <p className="font-bold text-2xl text-neutral-900">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleUpdateQty(item.product_id, item.quantity - 1)}
                                                            className="w-10 h-10 rounded-lg border-2 border-neutral-900 bg-white hover:bg-neutral-900 hover:text-acid flex items-center justify-center transition-all"
                                                        >
                                                            <Minus className="w-5 h-5 font-bold" />
                                                        </button>
                                                        <span className="font-bold text-xl w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQty(item.product_id, item.quantity + 1)}
                                                            className="w-10 h-10 rounded-lg border-2 border-neutral-900 bg-white hover:bg-neutral-900 hover:text-acid flex items-center justify-center transition-all"
                                                        >
                                                            <Plus className="w-5 h-5 font-bold" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Desktop Quantity Section */}
                                            <div className="hidden md:flex flex-col items-center gap-1 min-w-[120px]">
                                                <div className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest mb-2">QUANTITY</div>
                                                <div className="flex items-center gap-3 relative">
                                                    {updatingIds.has(item.product_id) && (
                                                        <div className="absolute inset-x-0 -top-full flex justify-center pb-2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                                                        </div>
                                                    )}
                                                    <button
                                                        disabled={updatingIds.has(item.product_id)}
                                                        onClick={() => handleUpdateQty(item.product_id, item.quantity - 1)}
                                                        className="w-10 h-10 rounded-lg border-2 border-neutral-900 bg-white hover:bg-neutral-900 hover:text-acid flex items-center justify-center transition-all disabled:opacity-50"
                                                    >
                                                        <Minus className="w-5 h-5 font-bold" />
                                                    </button>
                                                    <span className="font-bold text-2xl w-10 text-center text-neutral-900">{item.quantity}</span>
                                                    <button
                                                        disabled={updatingIds.has(item.product_id)}
                                                        onClick={() => handleUpdateQty(item.product_id, item.quantity + 1)}
                                                        className="w-10 h-10 rounded-lg border-2 border-neutral-900 bg-white hover:bg-neutral-900 hover:text-acid flex items-center justify-center transition-all disabled:opacity-50"
                                                    >
                                                        <Plus className="w-5 h-5 font-bold" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 4. Desktop Price Section */}
                                            <div className="hidden md:flex flex-col items-end min-w-[140px]">
                                                <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest mb-1">SUBTOTAL</p>
                                                <p className="font-bold text-3xl text-neutral-900 leading-none">{formatPrice(item.price * item.quantity)}</p>
                                                <p className="text-xs text-neutral-500 mt-2 font-bold uppercase">{formatPrice(item.price)} / UNIT</p>
                                            </div>

                                            {/* 5. Remove Button */}
                                            <button
                                                onClick={() => setRemoveModalItem({ id: item.product_id, name: item.product_name, image: item.product_image })}
                                                className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg bg-transparent hover:bg-red-50 border-2 border-transparent hover:border-red-500 text-neutral-400 hover:text-red-600 transition-all ml-4"
                                            >
                                                <Trash2 className="w-10 h-10 p-2" />
                                            </button>
                                        </div>

                                        {/* Mobile Trash Overlay */}
                                        <button
                                            onClick={() => setRemoveModalItem({ id: item.product_id, name: item.product_name, image: item.product_image })}
                                            className="md:hidden absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT COLUMN: STICKY SUMMARY */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                            <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden h-fit">
                                <h2 className="font-bold text-2xl text-neutral-900 mb-4 border-b-2 border-neutral-900 pb-3 uppercase">
                                    ORDER SUMMARY
                                </h2>

                                <div className="space-y-6">
                                    {/* Coupon Section */}
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-neutral-700 uppercase tracking-wider">HAVE A COUPON?</p>
                                        {appliedCoupon ? (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    <div>
                                                        <p className="text-sm font-bold text-green-700 uppercase tracking-widest leading-none">APPLIED: {appliedCoupon.code}</p>
                                                        <p className="text-xs text-green-600 font-semibold mt-1">You saved {formatPrice(discount)}!</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removeCoupon}
                                                    className="text-red-600 text-xs font-bold uppercase hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="ENTER CODE"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    disabled={isValidating}
                                                    className="flex-1 bg-white border-2 border-neutral-300 rounded-lg px-4 py-3 font-bold uppercase tracking-wider text-sm outline-none focus:border-ink hover:border-neutral-400 transition-all shadow-none"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isValidating || !couponCode.trim()}
                                                    className="bg-ink text-white hover:bg-ink/90 px-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                                                >
                                                    {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Breakdown */}
                                    <div className="space-y-4 pt-6 border-t border-neutral-200">
                                        <div className="flex justify-between items-center text-sm font-bold py-3 border-b border-neutral-100">
                                            <span className="text-neutral-700">Subtotal</span>
                                            <span className="text-neutral-900 font-bold">{formatPrice(subtotal)}</span>
                                        </div>

                                        {appliedCoupon && (
                                            <div className="flex justify-between items-center text-sm font-bold py-3 border-b border-neutral-100">
                                                <span className="text-green-600 uppercase">Discount ({appliedCoupon.code})</span>
                                                <span className="text-green-600 font-bold">- {formatPrice(discount)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-sm font-bold py-3 border-b border-neutral-100">
                                            <span className="text-neutral-700">Shipping</span>
                                            <span className={shipping === 0 ? 'text-green-600 bg-green-100 px-3 py-1 rounded font-bold' : 'text-neutral-900'}>
                                                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                            </span>
                                        </div>

                                        {/* Free Shipping Tracker */}
                                        {remainingForFree > 0 && (
                                            <div className="py-2">
                                                <p className="text-primary-600 font-bold text-sm mb-2">Add {formatPrice(remainingForFree)} for FREE shipping</p>
                                                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-ink rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 1 }}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-sm font-bold py-3 flex-wrap">
                                            <div className="flex flex-col">
                                                <span className="text-neutral-700 uppercase tracking-widest">GST (18% INCLUSIVE)</span>
                                                <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Calculated on subtotal</span>
                                            </div>
                                            <span className="text-neutral-900">{formatPrice(tax)}</span>
                                        </div>

                                        {/* Total */}
                                        <div className="border-t-2 border-neutral-900 pt-6 mt-4">
                                            <div className="flex justify-between items-end">
                                                <div className="text-xl font-bold uppercase text-neutral-900">TOTAL</div>
                                                <div className="text-right">
                                                    <motion.p
                                                        key={total}
                                                        initial={{ scale: 1.1, color: '#D2E823' }}
                                                        animate={{ scale: 1, color: '#0A2A1F' }}
                                                        className="font-black text-4xl text-neutral-900 leading-none"
                                                    >
                                                        {formatPrice(total)}
                                                    </motion.p>
                                                </div>
                                            </div>
                                            {discount > 0 && (
                                                <p className="text-green-600 text-sm font-semibold mt-3 text-right">
                                                    You saved {formatPrice(discount)} with this order! 🎉
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-8 space-y-4">
                                        <Link href="/checkout" className="block relative group">
                                            <button className="w-full bg-acid text-neutral-900 border-2 border-neutral-900 px-8 py-5 rounded-xl font-bold text-lg tracking-wide hover:bg-acid/90 hover:scale-[1.02] shadow-hard hover:shadow-xl transition-all flex items-center justify-center gap-4 uppercase">
                                                CHECKOUT <ArrowRight className="w-6 h-6" />
                                            </button>
                                        </Link>
                                        <Link href="/shop" className="block">
                                            <button className="w-full bg-white border-2 border-neutral-900 px-8 py-3 rounded-xl font-bold text-sm tracking-widest text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all uppercase">
                                                ← Continue Shopping
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="pt-8 flex justify-center gap-6 border-t-2 border-neutral-100">
                                        <div className="flex flex-col items-center text-center gap-1.5 opacity-60">
                                            <Lock className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">SECURE</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-1.5 opacity-60">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">RETURNS</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-1.5 opacity-60">
                                            <Zap className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">SUPPORT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Remove Confirmation Modal - Custom Brutalist Style */}
            <AnimatePresence>
                {removeModalItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                            onClick={() => setRemoveModalItem(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white border-4 border-neutral-900 rounded-3xl p-8 md:p-10 shadow-hard-xl max-w-md w-full relative z-10"
                        >
                            <h2 className="font-display text-3xl text-neutral-900 uppercase italic font-bold leading-none mb-6">
                                Remove from cart?
                            </h2>

                            <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border-2 border-neutral-100 mb-8">
                                <div className="w-16 h-16 relative rounded-lg border border-neutral-200 overflow-hidden bg-white">
                                    {removeModalItem.image && (
                                        <Image src={removeModalItem.image} alt={removeModalItem.name} fill className="object-cover" unoptimized />
                                    )}
                                </div>
                                <p className="font-bold text-neutral-900 truncate flex-1">{removeModalItem.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setRemoveModalItem(null)}
                                    className="bg-white border-2 border-neutral-900 px-6 py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-neutral-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        removeItem(removeModalItem.id);
                                        setRemoveModalItem(null);
                                        toast.success('Item removed from cart');
                                    }}
                                    className="bg-red-600 text-white border-2 border-neutral-900 px-6 py-4 rounded-xl font-bold text-sm tracking-widest uppercase shadow-hard-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}
