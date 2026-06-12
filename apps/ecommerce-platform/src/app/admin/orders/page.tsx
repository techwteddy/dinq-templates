'use client';

import { useState, useEffect } from 'react';
import {
    Download,
    Eye,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (statusFilter) {
                query = query.eq('status', statusFilter.toLowerCase());
            }

            const { data, error } = await query;

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching admin orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const columns = [
        {
            header: 'Order ID',
            accessor: (order: any) => (
                <div>
                    <p className="font-display text-lg italic uppercase">{order.id.split('-')[0]}</p>
                    <p className="text-[10px] font-bold opacity-30 uppercase italic">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            )
        },
        {
            header: 'Customer',
            accessor: (order: any) => (
                <div>
                    <p className="font-bold text-sm uppercase truncate max-w-[200px]">{order.customer_email}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'paid' ? 'bg-acid' : 'bg-red-400'}`} />
                        <span className="text-[10px] font-bold opacity-40 uppercase italic">{order.payment_status}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Cargo Value',
            accessor: (order: any) => (
                <span className="font-display text-xl">{formatPrice(order.total_amount)}</span>
            )
        },
        {
            header: 'Mission Status',
            accessor: (order: any) => (
                <OrderStatusBadge status={order.status} />
            )
        },
        {
            header: 'Logistics',
            className: 'text-right',
            accessor: (order: any) => (
                <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="p-2 min-w-0">
                        <Eye className="w-4 h-4" />
                    </Button>
                </Link>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                        ORDER <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>REGISTRY.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Operational log of all healing mission cargos</p>
                </div>
                <Button variant="outline" size="md" className="uppercase italic">
                    <Download className="w-5 h-5 mr-2" /> EXPORT LOG
                </Button>
            </div>

            <DataTable
                data={orders}
                columns={columns as any}
                searchKey="customer_email"
                searchPlaceholder="SCAN MISSION REGISTRY..."
                loading={loading}
                filters={[
                    {
                        label: 'Mission Status',
                        options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
                        onFilter: setStatusFilter
                    }
                ]}
            />
        </div>
    );
}
