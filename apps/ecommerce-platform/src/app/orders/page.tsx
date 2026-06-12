'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import { ShoppingBag, ArrowRight, Package, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

export default function OrdersPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        }

        if (isSignedIn) fetchOrders();
    }, [isSignedIn, user]);

    if (!isLoaded) return <div className="min-h-screen bg-paper" />;

    if (!isSignedIn) {
        return (
            <>
                <Marquee />
                <Navbar />
                <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 pb-24 text-center">
                    <div className="bg-ink text-acid p-6 rounded-3xl shadow-hard border-2 border-ink mb-8 -rotate-3">
                        <ShoppingBag className="w-12 h-12" />
                    </div>
                    <h1 className="font-display text-4xl uppercase italic mb-4 leading-none">Access Restricted</h1>
                    <p className="font-bold opacity-40 uppercase tracking-widest text-xs mb-8 max-w-xs">Please sign in to view your high-fidelity purchase history</p>
                    <Link href="/sign-in">
                        <button className="bg-ink text-acid border-2 border-ink px-10 py-5 rounded-2xl font-display text-xl tracking-widest uppercase italic shadow-hard hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">SIGN IN</button>
                    </Link>
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
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <h1 className="font-display text-5xl md:text-7xl tracking-tighter text-ink uppercase leading-none italic">
                            ORDER <span className="text-outline" style={{ WebkitTextStroke: '2.5px #0A2A1F' }}>HISTORY.</span>
                        </h1>
                        <p className="font-bold opacity-30 mt-4 uppercase tracking-[0.3em] text-[10px]">Registry tracking for {user.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-40 bg-white border-2 border-ink rounded-3xl animate-pulse shadow-hard" />
                                ))}
                            </div>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white border-2 border-ink rounded-3xl p-6 shadow-hard hover:translate-x-1 hover:-translate-y-1 hover:shadow-hard-xl transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-acid/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Badge status={order.status.toUpperCase()} />
                                                <span className="font-display text-lg md:text-2xl text-ink uppercase italic truncate max-w-[200px]">{order.id}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold opacity-40 uppercase tracking-widest">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {order.order_items?.length || 0} ITEMS</span>
                                                <span className="bg-paper px-2 rounded font-mono text-[10px]">{order.payment_status?.toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto border-t-2 md:border-t-0 border-ink/5 pt-4 md:pt-0">
                                            <div className="text-right flex-1 md:flex-none">
                                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Total Val.</p>
                                                <p className="font-display text-3xl text-ink leading-none mt-1">{formatPrice(order.total_amount)}</p>
                                            </div>
                                            <button className="bg-ink text-acid p-4 rounded-xl shadow-hard-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                                <ArrowRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-paper border-2 border-ink border-dashed rounded-[2.5rem] p-12 text-center">
                                <p className="font-display text-2xl opacity-20 uppercase italic mb-6 text-ink">Zero Data Detected</p>
                                <Link href="/shop">
                                    <button className="text-ink font-bold uppercase tracking-widest text-[10px] underline hover:text-acid transition-colors">Start your first mission</button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 bg-acid border-2 border-ink rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-ink/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="max-w-md relative z-10">
                            <h2 className="font-display text-3xl uppercase italic leading-none mb-4">Support Request?</h2>
                            <p className="font-bold text-sm opacity-60 leading-relaxed mb-8">If you're having trouble with an existing cargo delivery, our operatives are standing by to assist.</p>
                            <Link href="/contact">
                                <button className="bg-ink text-acid border-2 border-ink px-8 py-4 rounded-xl font-display text-sm tracking-widest uppercase italic shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">CONTACT UNIT</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function Badge({ status }: { status: string }) {
    const isProcessing = status === 'PROCESSING' || status === 'PENDING';
    return (
        <div className={`px-2 py-1 rounded-lg border-2 border-ink text-[10px] font-bold uppercase tracking-widest shadow-hard-sm ${isProcessing ? 'bg-acid animate-pulse' : 'bg-green-400 opacity-60'}`}>
            {status}
        </div>
    );
}
