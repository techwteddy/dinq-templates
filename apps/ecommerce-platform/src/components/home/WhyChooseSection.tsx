'use client';

import { Leaf, Droplet, ShieldCheck, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Leaf,
        title: 'PURE POTENCY',
        tag: 'Formula',
        description: 'Rooted in 5000-year-old Ayurvedic wisdom. No fluff, just results.',
        color: 'bg-acid',
    },
    {
        icon: Droplet,
        title: 'ZERO TRASH',
        tag: 'Standard',
        description: 'Carefully sourced botanicals. 0% harmful chemicals. 100% Truth.',
        color: 'bg-white',
    },
    {
        icon: ShieldCheck,
        title: 'CRAFTED COLD',
        tag: 'Quality',
        description: 'Handcrafted in small batches to preserve natural healing properties.',
        color: 'bg-stone',
    },
];

export default function WhyChooseSection() {
    return (
        <section className="py-20 bg-stone/30 border-y-2 border-ink">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <div className="text-acid bg-ink inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-4 border border-ink">The HealMitra Way</div>
                        <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none">
                            WHY WE ARE <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>BUILT DIFFERENT</span>
                        </h2>
                    </div>
                    <p className="font-bold text-ink opacity-60 md:text-right max-w-xs">
                        We don't hide behind luxury packaging. Our results speak for themselves.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                whileHover={{ y: -10 }}
                                className={`${feature.color} border-2 border-ink p-8 rounded-2xl shadow-hard relative group overflow-hidden`}
                            >
                                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon className="w-32 h-32" />
                                </div>

                                <div className="flex items-center justify-between mb-8">
                                    <div className="bg-ink text-paper p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                                        <Icon className="w-6 h-6 stroke-[2]" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest border border-ink/20 px-2 py-1 rounded">{feature.tag}</span>
                                </div>

                                <h3 className="font-display text-2xl text-ink mb-4">{feature.title}</h3>
                                <p className="font-bold text-sm text-ink opacity-70 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="mt-8 flex items-center gap-2 text-ink">
                                    <div className="w-12 h-[2px] bg-ink/10"></div>
                                    <Sparkles className="w-4 h-4 opacity-30" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
