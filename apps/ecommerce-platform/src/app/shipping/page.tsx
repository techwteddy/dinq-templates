'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import { Truck, Clock, ShieldCheck, MapPin, Package, AlertCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                    <div className="mb-16">
                        <h1 className="font-display text-5xl md:text-8xl tracking-tighter text-ink uppercase leading-none mb-4">
                            THE <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>CARGO</span><br />
                            LOGISTICS.
                        </h1>
                        <p className="font-sans text-xl font-bold opacity-60">How we get the wisdom to your doorstep.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* Policy Details */}
                        <div className="lg:col-span-8 space-y-12">

                            <section className="bg-white border-2 border-ink rounded-3xl p-8 shadow-hard relative">
                                <div className="absolute -top-3 left-6 bg-ink text-acid px-3 py-1 rounded-lg font-display text-[10px] tracking-widest uppercase border-2 border-ink shadow-hard-sm">
                                    ✸ PROCESSING
                                </div>
                                <div className="flex gap-6 items-start mt-4">
                                    <div className="bg-acid p-4 rounded-2xl border-2 border-ink shadow-hard-sm shrink-0">
                                        <Clock className="w-8 h-8 text-ink" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-2xl mb-4 uppercase">SMALL BATCH, CAREFUL PACK.</h3>
                                        <p className="font-bold text-lg leading-relaxed opacity-70">
                                            Every order is manually verified. We process within <span className="underline decoration-acid decoration-4">24–48 hours</span>. We don't rush perfection.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-paper border-2 border-ink rounded-3xl p-8 shadow-hard relative">
                                <div className="absolute -top-3 left-6 bg-ink text-paper px-3 py-1 rounded-lg font-display text-[10px] tracking-widest uppercase border-2 border-ink shadow-hard-sm">
                                    ✸ TIMELINES
                                </div>
                                <div className="flex gap-6 items-start mt-4">
                                    <div className="bg-ink p-4 rounded-2xl border-2 border-ink shadow-hard-sm shrink-0">
                                        <Truck className="w-8 h-8 text-acid" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-2xl mb-6 uppercase">TRANSIT CODES.</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-white border-2 border-ink p-6 rounded-xl shadow-hard-sm">
                                                <p className="font-display text-lg text-acid mb-1" style={{ WebkitTextStroke: '1px #0A2A1F' }}>MAHARASHTRA</p>
                                                <p className="font-bold text-sm">2–4 BUSINESS DAYS</p>
                                            </div>
                                            <div className="bg-white border-2 border-ink p-6 rounded-xl shadow-hard-sm">
                                                <p className="font-display text-lg text-acid mb-1" style={{ WebkitTextStroke: '1px #0A2A1F' }}>REST OF INDIA</p>
                                                <p className="font-bold text-sm">4–7 BUSINESS DAYS</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-acid border-2 border-ink rounded-3xl p-8 shadow-hard relative">
                                <div className="absolute -top-3 left-6 bg-ink text-paper px-3 py-1 rounded-lg font-display text-[10px] tracking-widest uppercase border-2 border-ink shadow-hard-sm">
                                    ✸ CHARGES
                                </div>
                                <div className="flex gap-6 items-start mt-4">
                                    <div className="bg-white p-4 rounded-2xl border-2 border-ink shadow-hard-sm shrink-0">
                                        <Package className="w-8 h-8 text-ink" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-2xl mb-4 uppercase">SHIPPING MATH.</h3>
                                        <ul className="space-y-4 font-bold text-lg">
                                            <li className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-ink rotate-45"></div>
                                                ORDERS ₹499+ = <span className="bg-black text-white px-2 rounded">FREE SHIPPING</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-ink rotate-45"></div>
                                                ORDERS UNDER ₹499 = ₹49 FLAT RATE
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Sticky Info */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                            <div className="bg-ink text-paper border-2 border-ink rounded-3xl p-8 shadow-hard-acid">
                                <AlertCircle className="w-10 h-10 text-acid mb-6 animate-pulse" />
                                <h3 className="font-display text-xl mb-4 uppercase">TRACKING GEAR</h3>
                                <p className="font-bold text-sm leading-relaxed opacity-60">
                                    Once the cargo drops, you'll receive a tracking code via SMS and Email. Use it to follow your wisdom journey.
                                </p>
                                <div className="mt-8 pt-8 border-t border-paper/20">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Security Status</p>
                                    <p className="font-display text-xs mt-2 text-acid">ALL SHIPMENTS INSURED</p>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-ink rounded-3xl p-6 shadow-hard-sm flex items-center gap-4">
                                <MapPin className="text-ink w-8 h-8" />
                                <div>
                                    <p className="font-display text-xs uppercase">Location</p>
                                    <p className="font-bold text-sm opacity-60">SHIPPED FROM JALNA, MH</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
