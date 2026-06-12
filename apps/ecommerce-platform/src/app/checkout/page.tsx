'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, Lock, MapPin, Truck, Mail, Phone, User, Home, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Script from 'next/script';
import { useUser, SignInButton } from '@clerk/nextjs';

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isLoaded, isSignedIn } = useUser();
    const { items, getTotal, getShipping, getTax, getGrandTotal, clearCart } = useCartStore();

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        shippingPhone: '',
        paymentMethod: 'online',
    });

    // Pre-fill user data
    useEffect(() => {
        if (isLoaded && user) {
            setFormData(prev => ({
                ...prev,
                email: user.emailAddresses[0]?.emailAddress || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            }));
        }
    }, [isLoaded, user]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getTotal();
    const shipping = getShipping();
    const tax = getTax();
    const total = getGrandTotal();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Required';
        if (!formData.phone) newErrors.phone = 'Required';
        if (!formData.firstName) newErrors.firstName = 'Required';
        if (!formData.lastName) newErrors.lastName = 'Required';
        if (!formData.addressLine1) newErrors.addressLine1 = 'Required';
        if (!formData.city) newErrors.city = 'Required';
        if (!formData.state) newErrors.state = 'Required';
        if (!formData.pincode) newErrors.pincode = 'Required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsProcessing(true);

        try {
            // Mock Mode Fallback if API keys are missing
            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                toast.loading('SIMULATING SECURE TUNNEL...', { duration: 1500 });
                setTimeout(() => {
                    toast.success('PRACTICE MISSION SUCCESSFUL');
                    clearCart();
                    router.push('/order-success/MOCK-HM-123');
                }, 2000);
                return;
            }

            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    customer: formData,
                    items: items,
                    clerk_user_id: user?.id,
                }),
            });

            const orderData = await res.json();
            if (!orderData.success) throw new Error(orderData.error);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount * 100,
                currency: 'INR',
                name: 'HEALMITRA',
                description: 'Ayurvedic Cargo Mission',
                order_id: orderData.razorpay_order_id,
                handler: async (response: any) => {
                    const verifyRes = await fetch('/api/razorpay/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            order_id: orderData.order_id
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success('DEPO COMPLETED ✦');
                        clearCart();
                        router.push(`/order-success/${orderData.order_id}`);
                    } else {
                        toast.error('SIGNATURE VERIFICATION FAILURE');
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#0A2A1F',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error: any) {
            toast.error(error.message || 'COMMUNICATION BREAKDOWN');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isLoaded) return <div className="min-h-screen bg-paper" />;

    if (!isSignedIn) {
        return (
            <>
                <Marquee />
                <Navbar />
                <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 pb-20">
                    <div className="max-w-md w-full text-center space-y-8">
                        <div className="bg-ink text-acid p-6 rounded-3xl shadow-hard border-2 border-ink inline-block mb-4">
                            <Lock className="w-12 h-12" />
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                            PROTECTED <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>CARGO.</span>
                        </h1>
                        <p className="font-bold opacity-40 uppercase tracking-widest text-xs italic">Authentification required to dispatch healing resources</p>
                        <SignInButton mode="modal">
                            <Button className="w-full py-6 text-xl uppercase italic shadow-hard-acid">
                                SIGN IN TO CHECKOUT
                            </Button>
                        </SignInButton>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                    <div className="mb-12">
                        <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase mb-2 leading-none">
                            SECURE <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>CHECKOUT.</span>
                        </h1>
                        <p className="font-bold opacity-40">Ready to secure the goods?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 mt-8 lg:mt-0">
                            <div className="bg-stone/40 border-2 border-ink rounded-3xl p-6 md:p-8 shadow-hard relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ink/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                                <h2 className="font-display text-2xl text-ink mb-8 uppercase tracking-tighter italic">THE <span className="text-outline" style={{ WebkitTextStroke: '1px #0A2A1F' }}>CARGO</span></h2>

                                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                                    {items.map(item => (
                                        <div key={item.product_id} className="flex gap-4 items-center bg-white p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                                            <div className="w-16 h-16 bg-paper border-2 border-ink rounded-lg overflow-hidden shrink-0 relative">
                                                {item.product_image ? <Image src={item.product_image} alt={item.product_name} fill className="object-contain p-1" unoptimized /> : <span className="flex items-center justify-center h-full">🌿</span>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-display text-[10px] truncate uppercase italic">{item.product_name}</p>
                                                <p className="font-bold text-[10px] opacity-50 uppercase">{item.quantity} × {formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 font-bold text-xs uppercase tracking-widest border-t-2 border-ink pt-6">
                                    <div className="flex justify-between">
                                        <span className="opacity-40">SUBTOTAL</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-40">SHIPPING</span>
                                        <span className={shipping === 0 ? 'text-ink bg-acid px-2 rounded border border-ink shadow-hard-sm' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-40">TAX</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-display border-t-2 border-ink/10 pt-4 mt-2 italic">
                                        <span>TOTAL</span>
                                        <span className="text-acid" style={{ WebkitTextStroke: '1.5px #0A2A1F' }}>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Left Column: Forms */}
                        <div className="lg:col-span-8 space-y-8 order-last lg:order-first">

                            {/* Step 1: Customer */}
                            <div className="bg-white border-2 border-ink rounded-3xl p-6 md:p-8 shadow-hard relative">
                                <div className="absolute -top-3 left-6 bg-ink text-paper px-4 py-1 rounded-lg font-display text-xs tracking-widest uppercase">
                                    01 ✸ INFO
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mt-4">
                                    <Input
                                        label="EMAIL ADDRESS"
                                        type="email"
                                        placeholder="you@email.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        error={errors.email}
                                        className="input-brutal"
                                    />
                                    <Input
                                        label="PHONE NUMBER"
                                        type="tel"
                                        placeholder="10-digit mobile"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        error={errors.phone}
                                        className="input-brutal"
                                    />
                                    <Input
                                        label="FIRST NAME"
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        error={errors.firstName}
                                        className="input-brutal"
                                    />
                                    <Input
                                        label="LAST NAME"
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        error={errors.lastName}
                                        className="input-brutal"
                                    />
                                </div>
                            </div>

                            {/* Step 2: Shipping */}
                            <div className="bg-white border-2 border-ink rounded-3xl p-6 md:p-8 shadow-hard relative">
                                <div className="absolute -top-3 left-6 bg-ink text-paper px-4 py-1 rounded-lg font-display text-xs tracking-widest uppercase">
                                    02 ✸ SHIPPING
                                </div>

                                <div className="space-y-6 mt-4">
                                    <Input
                                        label="ADDRESS LINE 1"
                                        placeholder="House, Building name..."
                                        required
                                        value={formData.addressLine1}
                                        onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                                        error={errors.addressLine1}
                                        className="input-brutal"
                                    />
                                    <Input
                                        label="ADDRESS LINE 2 (OPTIONAL)"
                                        placeholder="Area, Landmark..."
                                        value={formData.addressLine2}
                                        onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
                                        className="input-brutal"
                                    />

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <Input
                                            label="CITY"
                                            required
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            error={errors.city}
                                            className="input-brutal"
                                        />
                                        <div>
                                            <label className="block text-xs font-bold text-ink mb-2 uppercase">STATE</label>
                                            <select
                                                required
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold outline-none focus:bg-white transition-colors"
                                            >
                                                <option value="">SELECT</option>
                                                {indianStates.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <Input
                                            label="PINCODE"
                                            placeholder="6-digit"
                                            required
                                            maxLength={6}
                                            value={formData.pincode}
                                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                            error={errors.pincode}
                                            className="input-brutal"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Payment */}
                            <div className="bg-white border-2 border-ink rounded-3xl p-6 md:p-8 shadow-hard relative">
                                <div className="absolute -top-3 left-6 bg-ink text-paper px-4 py-1 rounded-lg font-display text-xs tracking-widest uppercase">
                                    03 ✸ PAYMENT
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mt-4">
                                    <label className={`cursor-pointer border-2 border-ink p-6 rounded-2xl transition-all flex items-center gap-4 ${formData.paymentMethod === 'online' ? 'bg-acid shadow-hard-sm translate-x-1 translate-y-1' : 'bg-paper hover:bg-stone/20'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="sr-only"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                                        />
                                        <div className="bg-ink p-2 rounded-lg"><CreditCard className="text-paper h-6 w-6" /></div>
                                        <span className="font-display text-sm tracking-wide">ONLINE (UPI/CARD)</span>
                                    </label>

                                    <label className={`cursor-pointer border-2 border-ink p-6 rounded-2xl transition-all flex items-center gap-4 ${formData.paymentMethod === 'cod' ? 'bg-acid shadow-hard-sm translate-x-1 translate-y-1' : 'bg-paper hover:bg-stone/20'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="sr-only"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                                        />
                                        <div className="bg-ink p-2 rounded-lg"><Home className="text-paper h-6 w-6" /></div>
                                        <span className="font-display text-sm tracking-wide">CASH ON DELIVERY</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-ink text-acid border-2 border-ink py-6 rounded-2xl font-display text-2xl tracking-widest shadow-hard hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isProcessing ? 'PROCESSING...' : 'CONFIRM ORDER'} <ArrowRight className="w-8 h-8" />
                                </button>
                            </div>

                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-4 sticky top-32">
                            <div className="bg-stone/40 border-2 border-ink rounded-3xl p-6 md:p-8 shadow-hard">
                                <h2 className="font-display text-2xl text-ink mb-8 uppercase tracking-tighter">THE <span className="text-outline" style={{ WebkitTextStroke: '1px #0A2A1F' }}>CARGO</span></h2>

                                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                                    {items.map(item => (
                                        <div key={item.product_id} className="flex gap-4 items-center bg-white p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                                            <div className="w-16 h-16 bg-paper border-2 border-ink rounded-lg overflow-hidden shrink-0 relative">
                                                {item.product_image ? <Image src={item.product_image} alt={item.product_name} fill className="object-contain p-1" unoptimized /> : <span className="flex items-center justify-center h-full">🌿</span>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-display text-[10px] truncate">{item.product_name}</p>
                                                <p className="font-bold text-xs opacity-50">{item.quantity} × {formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 font-bold text-xs uppercase tracking-widest border-t-2 border-ink pt-6">
                                    <div className="flex justify-between">
                                        <span className="opacity-40">SUBTOTAL</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-40">SHIPPING</span>
                                        <span className={shipping === 0 ? 'text-ink bg-acid px-2 rounded border border-ink' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-40">TAX</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-display border-t border-ink/10 pt-4 mt-2">
                                        <span>TOTAL</span>
                                        <span className="text-acid" style={{ WebkitTextStroke: '1.5px #0A2A1F' }}>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-white border-2 border-ink p-4 rounded-xl text-center shadow-hard-sm">
                                    <ShieldCheck className="w-6 h-6 mx-auto mb-2 opacity-40" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">LOCKED</span>
                                </div>
                                <div className="bg-white border-2 border-ink p-4 rounded-xl text-center shadow-hard-sm">
                                    <Truck className="w-6 h-6 mx-auto mb-2 opacity-40" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">EXPRESS</span>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
