'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Mail,
    Phone,
    ShoppingBag,
    MoreHorizontal,
    ArrowUpRight,
    Star
} from 'lucide-react';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        loyal: 0,
        topSpender: 0
    });

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, orders(total_amount, status)');

            if (error) throw error;

            const mappedCustomers = data?.map(profile => {
                const profileOrders = profile.orders || [];
                const paidOrders = profileOrders.filter((o: any) => o.status !== 'cancelled' && o.status !== 'pending');
                const totalSpent = paidOrders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0);

                return {
                    ...profile,
                    orderCount: profileOrders.length,
                    totalSpent
                };
            }) || [];

            setCustomers(mappedCustomers);
            setStats({
                total: mappedCustomers.length,
                loyal: mappedCustomers.filter(c => c.orderCount > 3).length,
                topSpender: mappedCustomers.reduce((prev, current) => (prev.totalSpent > current.totalSpent) ? prev : current, { totalSpent: 0 }).totalSpent
            });

        } catch (error) {
            console.error('Error fetching admin customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const columns = [
        {
            header: 'Citizen Identity',
            accessor: (customer: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-acid border-2 border-ink rounded-lg flex items-center justify-center font-display italic shrink-0">
                        {customer.full_name?.[0] || 'C'}
                    </div>
                    <div>
                        <p className="font-display text-sm italic uppercase">{customer.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">ID: {customer.id.split('-')[0]}</p>
                    </div>
                    {customer.totalSpent > 5000 && (
                        <Star className="w-3 h-3 text-acid fill-acid" />
                    )}
                </div>
            )
        },
        {
            header: 'Contact Intel',
            accessor: (customer: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                        <Mail className="w-3 h-3" /> {customer.email}
                    </div>
                    {customer.phone && (
                        <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                            <Phone className="w-3 h-3" /> {customer.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Mission Metrics',
            accessor: (customer: any) => (
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-display text-lg">{customer.orderCount}</span>
                        <span className="text-[10px] font-bold opacity-30 uppercase">Missions</span>
                    </div>
                    <p className="text-[10px] font-bold opacity-30 uppercase italic">Registered: {new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
            )
        },
        {
            header: 'Lifetime Value',
            accessor: (customer: any) => (
                <span className="font-display text-xl text-acid" style={{ WebkitTextStroke: '1px #0A2A1F' }}>
                    {formatPrice(customer.totalSpent)}
                </span>
            )
        },
        {
            header: 'Operations',
            className: 'text-right',
            accessor: (customer: any) => (
                <Button variant="outline" size="sm" className="p-2 min-w-0">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                        CITIZEN <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>REGISTRY.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Operational directory of all mission recipients</p>
                </div>
                <Button size="md" className="uppercase italic">
                    <Mail className="w-5 h-5 mr-2" /> Mass Intel
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'ACTIVE CITIZENS', value: stats.total.toString(), icon: Users, color: 'bg-acid' },
                    { label: 'LOYAL OPERATIVES', value: stats.loyal.toString(), icon: Star, color: 'bg-paper' },
                    { label: 'TOP SPECIMEN SPEND', value: formatPrice(stats.topSpender), icon: ShoppingBag, color: 'bg-stone' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white border-2 border-ink rounded-2xl p-6 shadow-hard-sm flex justify-between items-center group overflow-hidden relative">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                            <p className="font-display text-3xl">{stat.value}</p>
                        </div>
                        <div className={`p-3 border-2 border-ink rounded-xl ${stat.color} transition-transform group-hover:-rotate-3`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            <DataTable
                data={customers}
                columns={columns as any}
                searchKey="full_name"
                searchPlaceholder="SCAN CITIZEN DATABANKS..."
                loading={loading}
            />
        </div>
    );
}
