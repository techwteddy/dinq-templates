'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Leaf, ShieldCheck, Flame } from 'lucide-react';

export default function AboutPage() {
    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                    <div className="text-center mb-20">
                        <div className="inline-block bg-acid text-ink border-2 border-ink px-4 py-1 rounded-lg shadow-hard-sm font-display text-xs tracking-widest uppercase mb-6">
                            OUR CODE ✸
                        </div>
                        <h1 className="font-display text-5xl md:text-8xl tracking-tighter text-ink uppercase leading-none mb-6">
                            AYURVEDA <br />
                            <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>WITHOUT BLINDERS.</span>
                        </h1>
                        <p className="font-sans text-xl md:text-3xl font-bold opacity-60 max-w-3xl mx-auto">
                            No luxury fluff. Just raw, ancient botanical power for the brave individual.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        <div className="bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl aspect-square flex items-center justify-center relative group">
                            <div className="text-9xl group-hover:scale-110 transition-transform duration-700">🌿</div>
                            <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-acid border-2 border-ink p-8 rounded-2xl shadow-hard">
                                <h3 className="font-display text-2xl mb-4">THE MISSION</h3>
                                <p className="font-bold text-lg leading-relaxed opacity-80">
                                    HealMitra was born out of frustration. Frustration with weak formulations hidden behind pretty labels. We strip the branding bare and let the ingredients do the talking.
                                </p>
                            </div>

                            <div className="bg-paper border-2 border-ink p-8 rounded-2xl shadow-hard">
                                <h3 className="font-display text-2xl mb-4">THE TRADITION</h3>
                                <p className="font-bold text-lg leading-relaxed opacity-80">
                                    We don't invent. We rediscover. Every batch is an echo of 5000 years of Ayurvedic clinical proof, adapted for the modern hustle.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-ink text-paper border-2 border-ink rounded-[3rem] p-12 md:p-20 shadow-hard-acid relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-acid opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                        <div className="max-w-4xl mx-auto text-center relative z-10">
                            <div className="flex justify-center gap-4 mb-8">
                                <Flame className="w-12 h-12 text-acid animate-pulse" />
                            </div>
                            <h2 className="font-display text-4xl md:text-7xl uppercase tracking-tighter mb-8 leading-none">
                                WE ARE <span className="text-transparent" style={{ WebkitTextStroke: '2px #D2E823' }}>BUILT DIFFERENT.</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                                <div className="bg-acid text-ink p-6 rounded-2xl border-2 border-paper rotate-2">
                                    <span className="font-display text-xl block mb-2">RAW</span>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Untouched Nature</p>
                                </div>
                                <div className="bg-paper text-ink p-6 rounded-2xl border-2 border-acid -rotate-3">
                                    <span className="font-display text-xl block mb-2">COLD</span>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Small Batch</p>
                                </div>
                                <div className="bg-acid text-ink p-6 rounded-2xl border-2 border-paper rotate-6">
                                    <span className="font-display text-xl block mb-2">PROUD</span>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Made in India</p>
                                </div>
                                <div className="bg-paper text-ink p-6 rounded-2xl border-2 border-acid -rotate-2">
                                    <span className="font-display text-xl block mb-2">BOLD</span>
                                    <p className="text-[10px] font-bold uppercase opacity-60">No Secrets</p>
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
