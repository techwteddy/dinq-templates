'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Copy,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Tag
} from 'lucide-react';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';

export default function AdminDiscountsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('discounts')
                .select('*')
                .order('created_at', { ascending: false });

            if (statusFilter === 'Active') {
                query = query.eq('is_active', true);
            } else if (statusFilter === 'Inactive') {
                query = query.eq('is_active', false);
            }

            const { data, error } = await query;

            if (error) throw error;
            setCoupons(data || []);
        } catch (error) {
            console.error('Error fetching admin discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [statusFilter]);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`CODE [${code}] COPIED TO INTEL`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('TERMINATE THIS PROTOCOL?')) return;
        try {
            const { error } = await supabase.from('discounts').delete().eq('id', id);
            if (error) throw error;
            setCoupons(coupons.filter(c => c.id !== id));
            toast.success('PROTOCOL TERMINATED');
        } catch (error) {
            toast.error('TERMINATION FAILURE');
        }
    };

    const columns = [
        {
            header: 'Protocol Code',
            accessor: (coupon: any) => (
                <div className="flex items-center gap-3">
                    <span className="font-display text-xl uppercase italic bg-ink text-acid px-3 py-1 rounded-lg border-2 border-ink shadow-hard-sm">
                        {coupon.code}
                    </span>
                    <button onClick={() => copyCode(coupon.code)} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            )
        },
        {
            header: 'Yield / Type',
            accessor: (coupon: any) => (
                <div>
                    <p className="font-display text-lg">
                        {coupon.discount_type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                    </p>
                    <p className="text-[10px] font-bold opacity-30 uppercase">{coupon.discount_type} REDUCTION</p>
                </div>
            )
        },
        {
            header: 'Operational Conditions',
            accessor: (coupon: any) => (
                <div>
                    <p className="font-bold text-sm tracking-tighter">MIN: {formatPrice(coupon.min_purchase)}</p>
                    {coupon.expiry_date && (
                        <p className="text-[10px] font-bold opacity-30 uppercase italic">EXP: {new Date(coupon.expiry_date).toLocaleDateString()}</p>
                    )}
                </div>
            )
        },
        {
            header: 'Stage Status',
            accessor: (coupon: any) => (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-ink text-[10px] font-bold uppercase shadow-hard-sm ${coupon.is_active ? 'bg-acid text-ink' : 'bg-red-50 text-red-600 opacity-60'}`}>
                    {coupon.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {coupon.is_active ? 'Active' : 'Archived'}
                </div>
            )
        },
        {
            header: 'Operations',
            className: 'text-right',
            accessor: (coupon: any) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="p-2 min-w-0">
                        <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="p-2 min-w-0 group-hover:bg-red-600 transition-colors"
                        onClick={() => handleDelete(coupon.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                        DISCOUNT <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>PROTOCOL.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Manage incentive codes & promo campaigns</p>
                </div>
                <Button size="md" className="uppercase italic">
                    <Plus className="w-5 h-5 mr-2" /> NEW PROTOCOL
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'ACTIVE PROTOCOLS', value: coupons.filter(c => c.is_active).length.toString(), color: 'bg-acid' },
                    { label: 'TOTAL SAVED VIA PLUGS', value: formatPrice(14240), color: 'bg-paper' },
                    { label: 'CONVERSION LIFT', value: '+8.4%', color: 'bg-stone' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white border-2 border-ink rounded-2xl p-6 shadow-hard-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                        <p className="font-display text-3xl">{stat.value}</p>
                    </div>
                ))}
            </div>

            <DataTable
                data={coupons}
                columns={columns as any}
                searchKey="code"
                searchPlaceholder="SCAN ACTIVE PLUGS..."
                loading={loading}
                filters={[
                    {
                        label: 'Status',
                        options: ['Active', 'Inactive'],
                        onFilter: setStatusFilter
                    }
                ]}
            />

            <div className="bg-paper border-2 border-ink border-dashed rounded-[2.5rem] p-8 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white border-2 border-ink rounded-full flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform shadow-hard-sm">
                        <Tag className="w-8 h-8 opacity-20" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg uppercase italic opacity-40">Ready for a seasonal blitz?</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 mt-1">Deploy bulk discount protocols for upcoming festivals</p>
                    </div>
                </div>
                <Button variant="outline" size="md" className="uppercase italic border-ink/20 text-ink/40">
                    LEARN MORE
                </Button>
            </div>
        </div>
    );
}
