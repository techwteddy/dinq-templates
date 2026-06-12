'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Phone, MessageCircle, MapPin, Send, ArrowRight, Sparkles } from 'lucide-react';

export default function ContactPage() {
    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                    <div className="mb-16">
                        <h1 className="font-display text-5xl md:text-8xl tracking-tighter text-ink uppercase leading-none mb-4">
                            TALK IS <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>CHEAP.</span><br />
                            WE <span className="text-acid" style={{ WebkitTextStroke: '1px #0A2A1F' }}>LISTEN.</span>
                        </h1>
                        <p className="font-sans text-xl font-bold opacity-60">Feedback, orders, or just a vibe check – we're ready.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* Contact Details */}
                        <div className="lg:col-span-5 space-y-6">
                            <a href="mailto:healmitraayurvedicproducts@gmail.com" className="block group">
                                <div className="bg-white border-2 border-ink p-8 rounded-3xl shadow-hard group-hover:bg-acid transition-colors flex items-center gap-6">
                                    <div className="bg-ink p-4 rounded-xl shadow-hard-sm">
                                        <Mail className="w-8 h-8 text-paper" />
                                    </div>
                                    <div>
                                        <p className="font-display text-lg mb-1 uppercase">Email Us</p>
                                        <p className="font-bold opacity-50 break-all">healmitraayurvedicproducts@gmail.com</p>
                                    </div>
                                </div>
                            </a>

                            <a href="tel:+919322318810" className="block group">
                                <div className="bg-white border-2 border-ink p-8 rounded-3xl shadow-hard group-hover:bg-acid transition-colors flex items-center gap-6">
                                    <div className="bg-ink p-4 rounded-xl shadow-hard-sm">
                                        <Phone className="w-8 h-8 text-paper" />
                                    </div>
                                    <div>
                                        <p className="font-display text-lg mb-1 uppercase">Call Us</p>
                                        <p className="font-bold opacity-50">+91 9322318810</p>
                                    </div>
                                </div>
                            </a>

                            <a href="https://wa.me/919322318810" target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="bg-ink text-paper border-2 border-ink p-8 rounded-3xl shadow-hard group-hover:bg-acid group-hover:text-ink transition-colors flex items-center gap-6">
                                    <div className="bg-paper p-4 rounded-xl shadow-hard-sm border-2 border-ink group-hover:bg-ink">
                                        <MessageCircle className="w-8 h-8 text-ink group-hover:text-acid" />
                                    </div>
                                    <div>
                                        <p className="font-display text-lg mb-1 tracking-widest uppercase">WhatsApp</p>
                                        <p className="font-bold opacity-60">DM US DIRECTLY</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-paper border-2 border-ink rounded-[2rem] p-8 md:p-12 shadow-hard relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-acid/10 rounded-full blur-2xl -z-10"></div>

                                <h2 className="font-display text-3xl text-ink mb-10 uppercase tracking-tighter">DROP A <span className="text-outline" style={{ WebkitTextStroke: '1px #0A2A1F' }}>MESSAGE</span></h2>

                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input label="YOUR NAME" placeholder="REQUIRED" required className="input-brutal" />
                                        <Input label="EMAIL" placeholder="REQUIRED" required type="email" className="input-brutal" />
                                    </div>
                                    <Input label="SUBJECT" placeholder="WHAT'S ON YOUR MIND?" className="input-brutal" />
                                    <div>
                                        <label className="block text-xs font-bold text-ink mb-2 uppercase tracking-widest">MESSAGE</label>
                                        <textarea
                                            rows={5}
                                            placeholder="SPEAK FREELY..."
                                            className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold outline-none focus:bg-white transition-colors"
                                        ></textarea>
                                    </div>
                                    <button className="w-full bg-ink text-acid border-2 border-ink py-6 rounded-2xl font-display text-2xl tracking-widest shadow-hard hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-4">
                                        SEND INTENT <ArrowRight className="w-8 h-8" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
