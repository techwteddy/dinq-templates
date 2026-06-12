'use client';

import { CheckCircle2, Clock, AlertCircle, Truck, XCircle } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const config = {
        pending: {
            label: 'Pending',
            icon: Clock,
            className: 'bg-white text-ink border-ink/20'
        },
        processing: {
            label: 'Processing',
            icon: AlertCircle,
            className: 'bg-stone/10 text-ink border-ink/20'
        },
        shipped: {
            label: 'Shipped',
            icon: Truck,
            className: 'bg-acid text-ink border-ink shadow-hard-sm'
        },
        delivered: {
            label: 'Delivered',
            icon: CheckCircle2,
            className: 'bg-green-100 text-green-700 border-green-200'
        },
        cancelled: {
            label: 'Cancelled',
            icon: XCircle,
            className: 'bg-red-50 text-red-600 border-red-100 opacity-60'
        }
    };

    const { label, icon: Icon, className } = config[status] || config.pending;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 text-[10px] font-bold uppercase ${className}`}>
            <Icon className="w-3 h-3" />
            {label}
        </div>
    );
}
