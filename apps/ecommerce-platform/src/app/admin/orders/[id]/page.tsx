'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Printer,
    Truck,
    Mail,
    Phone,
    MapPin,
    Copy,
    Save
} from 'lucide-react';
import Button from '@/components/ui/Button';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*), profiles(*)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setOrder(data);
                setStatus(data.status);
            } catch (error) {
                console.error('Error fetching admin order detail:', error);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchOrder();
    }, [id]);

    const handleUpdateStatus = async () => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: status.toLowerCase() })
                .eq('id', id);

            if (error) throw error;
            toast.success('MISSION STATUS SYNCHRONIZED ✸');

            // Refresh order data
            const { data } = await supabase
                .from('orders')
                .select('*, order_items(*), profiles(*)')
                .eq('id', id)
                .single();
            setOrder(data);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('COMMUNICATIONS FAILURE');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-pulse">
                <h2 className="font-display text-4xl uppercase italic opacity-20">DECRYPTING MISSION...</h2>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                <h2 className="font-display text-4xl uppercase italic mb-4">MISSION LOST</h2>
                <Link href="/admin/orders">
                    <Button variant="outline">Back to Registry</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/admin/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Registry
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                            MISSION <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>{order.id.split('-')[0]}.</span>
                        </h1>
                        <p className="font-bold opacity-40 uppercase tracking-widest text-xs italic">Deployed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm" className="uppercase italic">
                            <Printer className="w-4 h-4 mr-2" /> Invoice
                        </Button>
                        <Button size="sm" className="uppercase italic">
                            <Truck className="w-4 h-4 mr-2" /> Ship Cargo
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Mission Intel */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Order Items */}
                    <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-display text-xl uppercase italic">CARGO MANIFEST</h2>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="space-y-6">
                            {order.order_items?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-6 p-4 bg-paper border-2 border-ink rounded-2xl group hover:shadow-hard-sm transition-all">
                                    <div className="w-16 h-16 bg-white border-2 border-ink rounded-lg flex items-center justify-center text-4xl">
                                        🌿
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-display text-lg italic uppercase">{item.product_name}</p>
                                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                    </div>
                                    <p className="font-display text-xl">{formatPrice(item.quantity * item.price)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t-2 border-dashed border-ink/10 space-y-3">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-40 italic">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-40 italic">
                                <span>Logistics</span>
                                <span className="text-acid bg-ink px-2 rounded">FREE</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t-2 border-ink">
                                <span className="font-display text-xl italic uppercase">TOTAL CARGO VALUE</span>
                                <span className="font-display text-3xl text-acid" style={{ WebkitTextStroke: '2px #0A2A1F' }}>{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Mission Control */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status Update */}
                    <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard sticky top-28">
                        <h2 className="font-display text-xl uppercase italic mb-6">OPERATIONAL STATUS</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Mission Stage</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <Button
                                onClick={handleUpdateStatus}
                                disabled={updating}
                                className="w-full py-5 text-lg uppercase italic shadow-hard-acid"
                            >
                                {updating ? 'SYNCING...' : 'SYNC MISSION'} <Save className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        {/* Customer Intelligence */}
                        <div className="mt-10 pt-10 border-t-2 border-dashed border-ink/10">
                            <h3 className="font-display text-sm uppercase italic mb-4">CITIZEN INTELLIGENCE</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-paper border-2 border-ink rounded-2xl">
                                    <p className="font-display text-base uppercase italic">{order.profiles?.full_name || 'Unidentified Citizen'}</p>
                                    <div className="flex flex-col gap-2 mt-3">
                                        <a href={`mailto:${order.customer_email}`} className="flex items-center gap-2 text-[10px] font-bold hover:text-acid transition-colors">
                                            <Mail className="w-3 h-3" /> {order.customer_email}
                                        </a>
                                        {order.profiles?.phone && (
                                            <a href={`tel:${order.profiles.phone}`} className="flex items-center gap-2 text-[10px] font-bold hover:text-acid transition-colors">
                                                <Phone className="w-3 h-3" /> {order.profiles.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {order.profiles?.address && (
                                    <div className="p-4 bg-paper border-2 border-ink rounded-2xl flex gap-3">
                                        <MapPin className="w-5 h-5 opacity-40 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest leading-normal">
                                                {order.profiles.address}
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 opacity-20 hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                navigator.clipboard.writeText(order.profiles.address);
                                                toast.success('COORDINATES COPIED');
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
