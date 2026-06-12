'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-4 pb-12 md:pt-8 md:pb-20 px-4 md:px-8 bg-paper">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A2A1F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left Column: Content */}
                    <div className="flex flex-col gap-6 relative z-10 max-w-2xl">
                        {/* Styled Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-ink/10 bg-white/50 backdrop-blur-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-acid animate-pulse shadow-[0_0_8px_rgba(210,232,35,0.8)]" />
                            <span className="font-bold text-[10px] tracking-[0.2em] uppercase text-ink">Premium Ayurvedic Formulations</span>
                        </motion.div>

                        {/* Headlines */}
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="font-display text-4xl md:text-5xl lg:text-7xl leading-[0.9] text-ink uppercase tracking-tight"
                            >
                                Ancient Wisdom. <br />
                                <span className="relative inline-block">
                                    Modern Armour.
                                    <span className="absolute -bottom-2 left-0 w-full h-3 bg-acid/40 -z-10 transform -rotate-1 rounded-sm"></span>
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="font-sans text-base md:text-lg text-ink/70 max-w-lg leading-relaxed font-medium"
                            >
                                Reclaim your vitality with science-backed Ayurvedic solutions. 100% natural, zero compromise, designed for the brave.
                            </motion.p>
                        </div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap gap-4 pt-2"
                        >
                            <Link href="/shop">
                                <button className="bg-ink text-paper px-8 py-4 rounded-xl font-display text-sm tracking-widest uppercase hover:bg-ink/90 transition-all hover:-translate-y-1 shadow-xl shadow-ink/20 flex items-center gap-3 group">
                                    Shop Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/about">
                                <button className="px-8 py-4 rounded-xl font-display text-sm tracking-widest uppercase border-2 border-ink hover:bg-ink hover:text-paper transition-all text-ink bg-transparent">
                                    Our Mission
                                </button>
                            </Link>
                        </motion.div>

                        {/* Validated Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex items-center gap-8 pt-6 border-t border-ink/10 mt-2"
                        >
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-stone/20 rounded-full group-hover:bg-acid/20 transition-colors">
                                    <CheckCircle className="w-5 h-5 text-ink/80" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Guaranteed</span>
                                    <span className="text-xs font-bold uppercase tracking-wide text-ink">100% Natural</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-stone/20 rounded-full group-hover:bg-acid/20 transition-colors">
                                    <Star className="w-5 h-5 text-ink/80 fill-ink/80" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Community</span>
                                    <span className="text-xs font-bold uppercase tracking-wide text-ink">4.9/5 Rated</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* Layered Cards Effect */}
                        <div className="relative w-full max-w-[450px] aspect-square">
                            {/* Decorative Elements */}
                            <div className="absolute top-6 -right-6 w-full h-full border-2 border-ink rounded-[2rem] bg-transparent opacity-20 -z-10" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-acid rounded-full blur-[50px] opacity-40 -z-10" />

                            {/* Main Image Card */}
                            <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden border border-ink/10 shadow-xl shadow-ink/20 bg-stone/5">
                                <Image
                                    src="/images/hero_premium.png"
                                    alt="Premium Ayurvedic Collection"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-[1.5s] ease-in-out"
                                    priority
                                    unoptimized
                                />

                                {/* Refined Floating Badge */}
                                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-xl p-4 rounded-xl border border-ink/5 shadow-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-display text-base text-ink leading-tight">THE ESSENTIALS</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50 mt-1">Complete Holistic Care</p>
                                    </div>
                                    <div className="bg-ink text-acid p-2 rounded-lg">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
