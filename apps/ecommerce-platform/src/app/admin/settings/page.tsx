'use client';

import { useState } from 'react';
import {
    Truck,
    CreditCard,
    Mail,
    ShieldCheck,
    Save,
    Globe,
    Store,
    Smartphone
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('CONFIG UPDATED ✸');
        }, 800);
    };

    return (
        <div className="max-w-4xl space-y-12 pb-20">
            <div>
                <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                    GLOBAL <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>CONFIG.</span>
                </h1>
                <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">System preferences & operational parameters</p>
            </div>

            <div className="space-y-10">
                {/* Shipping Settings */}
                <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-acid/10 rounded-full blur-2xl -z-10" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-ink text-acid p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                            <Truck className="w-6 h-6" />
                        </div>
                        <h2 className="font-display text-2xl uppercase italic">LOGISTICS CONTROL</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Free Shipping Threshold (₹)</label>
                            <input type="number" defaultValue="499" className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold outline-none focus:bg-white transition-all shadow-hard-sm" />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Base Shipping Rate (₹)</label>
                            <input type="number" defaultValue="49" className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold outline-none focus:bg-white transition-all shadow-hard-sm" />
                        </div>
                    </div>
                </section>

                {/* Payment Settings */}
                <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-ink text-acid p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h2 className="font-display text-2xl uppercase italic">PAYMENT INTELLIGENCE</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Razorpay Key ID</label>
                                <input type="password" value="rzp_test_XXXXXXXXXXXX" readOnly className="w-full bg-stone/20 border-2 border-ink rounded-xl px-4 py-3 font-mono font-bold outline-none shadow-hard-sm opacity-50" />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Payment Mode</label>
                                <div className="flex gap-4">
                                    <button className="flex-1 bg-acid text-ink border-2 border-ink py-3 rounded-xl font-display text-[10px] tracking-widest uppercase italic shadow-hard-sm">Live</button>
                                    <button className="flex-1 bg-white text-ink border-2 border-ink py-3 rounded-xl font-display text-[10px] tracking-widest uppercase italic shadow-hard-sm opacity-40">Sandbox</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-4 bg-paper border-2 border-ink rounded-2xl border-dashed">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-stone border-2 border-ink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-acid after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ink after:border-ink after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-acid"></div>
                            </label>
                            <div>
                                <p className="font-display text-sm italic uppercase">CASH ON DELIVERY ACCESS</p>
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Enable manual collection protocol</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Website Settings */}
                <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-ink text-acid p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                            <Store className="w-6 h-6" />
                        </div>
                        <h2 className="font-display text-2xl uppercase italic">WEBSITE SEO & METADATA</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Meta Navigation Title</label>
                            <input type="text" defaultValue="HealMitra | Authentic Ayurveda" className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold outline-none focus:bg-white transition-all shadow-hard-sm" />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Brand Identity Statement</label>
                            <textarea rows={3} defaultValue="Brave Ayurveda. Natural healing for the modern world." className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold outline-none focus:bg-white transition-all shadow-hard-sm resize-none"></textarea>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end pt-8 border-t-2 border-ink/10">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-12 py-6 text-xl uppercase italic"
                >
                    {loading ? 'STORING...' : 'SYNC CONFIG'} <Save className="ml-3 w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
