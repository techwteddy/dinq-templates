'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import { HelpCircle, ChevronDown, Sparkles, Truck, ShieldCheck, HeartPulse } from 'lucide-react';
import { useState } from 'react';

const faqCategories = [
    {
        title: 'TRANSIT & CARGO',
        icon: Truck,
        questions: [
            { q: 'How fast is the delivery?', a: 'Standard missions take 3-5 business days. Express protocols arrive within 48 hours for authorized sectors.' },
            { q: 'Can I track my cargo?', a: 'Yes. Every shipment is tagged with a digital signature accessible in your Order Registry.' }
        ]
    },
    {
        title: 'AUTHENTICITY',
        icon: ShieldCheck,
        questions: [
            { q: 'Are the products authentic?', a: '100%. All resources are sourced directly from high-fidelity Himalayan labs and verified by our botanists.' },
            { q: 'Do you use synthetic additives?', a: 'Zero tolerance. We only deploy pure botanical extracts with zero chemical interference.' }
        ]
    },
    {
        title: 'CITIZEN CARE',
        icon: HeartPulse,
        questions: [
            { q: 'What is your return policy?', a: 'If a resource doesnt resonate with your bio-data, return it within 14 days for a full registry credit.' },
            { q: 'How do I contact an operative?', a: 'Use the Contact Unit interface in your profile menu for priority communication.' }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>('TRANSIT & CARGO-0');

    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-24">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-16 text-center">
                        <div className="inline-block bg-acid text-ink p-4 rounded-2xl shadow-hard border-2 border-ink mb-6 rotate-3">
                            <HelpCircle className="w-10 h-10" />
                        </div>
                        <h1 className="font-display text-5xl md:text-8xl tracking-tighter text-ink uppercase leading-none italic">
                            CENTRAL <span className="text-outline" style={{ WebkitTextStroke: '2.5px #0A2A1F' }}>INTEL.</span>
                        </h1>
                        <p className="font-bold opacity-30 mt-4 uppercase tracking-[0.4em] text-[10px]">Answers for the modern citizen</p>
                    </div>

                    <div className="space-y-12">
                        {faqCategories.map((category) => (
                            <section key={category.title} className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <category.icon className="w-6 h-6 text-ink" />
                                    <h2 className="font-display text-2xl uppercase italic tracking-wider">{category.title}</h2>
                                    <div className="h-[2px] bg-ink/10 flex-1 ml-4" />
                                </div>

                                <div className="grid gap-4">
                                    {category.questions.map((item, idx) => {
                                        const id = `${category.title}-${idx}`;
                                        const isOpen = openIndex === id;
                                        return (
                                            <div key={id} className="bg-white border-2 border-ink rounded-3xl overflow-hidden shadow-hard-sm transition-all">
                                                <button
                                                    onClick={() => setOpenIndex(isOpen ? null : id)}
                                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-stone/5 transition-colors"
                                                >
                                                    <span className="font-display text-lg md:text-xl uppercase italic leading-tight pr-8">{item.q}</span>
                                                    <ChevronDown className={`w-6 h-6 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                <div className={`transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                                    <p className="font-bold text-sm text-ink/60 leading-relaxed border-t-2 border-ink/5 pt-6">{item.a}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-20 bg-ink text-paper rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-acid/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="relative z-10">
                            <Sparkles className="w-12 h-12 text-acid mx-auto mb-6 animate-pulse" />
                            <h2 className="font-display text-4xl uppercase italic leading-none mb-6">Still have query?</h2>
                            <p className="font-bold text-xs opacity-60 uppercase tracking-[0.2em] mb-10 max-w-sm mx-auto leading-loose">Open a direct channel with our high-fidelity support unit</p>
                            <Link href="/contact">
                                <button className="bg-acid text-ink border-2 border-acid px-10 py-5 rounded-2xl font-display text-xl tracking-widest uppercase italic shadow-hard-acid hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">ESTABLISH CONTACT</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
