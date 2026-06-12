'use client';

import { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    ArrowRight,
    AlertCircle,
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        customers: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                // 1. Fetch Stats
                const { data: ordersData } = await supabase
                    .from('orders')
                    .select('total_amount, payment_status, created_at');

                const { count: productCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true);

                const { count: customerCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                const totalRevenue = ordersData
                    ?.filter(o => o.payment_status === 'paid')
                    .reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

                setStats({
                    revenue: totalRevenue,
                    orders: ordersData?.length || 0,
                    products: productCount || 0,
                    customers: customerCount || 0
                });

                // 2. Process Chart Data (Last 7 days)
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const dailyRevenue = last7Days.map(date => {
                    const dayTotal = ordersData
                        ?.filter(o => o.created_at.startsWith(date) && o.payment_status === 'paid')
                        .reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

                    return {
                        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                        revenue: dayTotal
                    };
                });
                setChartData(dailyRevenue);

                // 3. Fetch Recent Orders
                const { data: recent } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);
                setRecentOrders(recent || []);

                // 4. Fetch Low Stock
                const { data: lowStock } = await supabase
                    .from('products')
                    .select('name, stock_quantity, sku')
                    .lt('stock_quantity', 10)
                    .limit(5);
                setLowStockProducts(lowStock || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                        SYSTEM <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>OVERVIEW.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Live metrics and operational intelligence</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="uppercase italic">
                        Generate Report
                    </Button>
                    <Button size="sm" className="uppercase italic">
                        Export Intel
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.revenue)}
                    change="+12.5%"
                    trend="up"
                    icon={TrendingUp}
                    color="bg-acid"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.orders.toString()}
                    change="+3 today"
                    trend="up"
                    icon={ShoppingBag}
                    color="bg-paper"
                />
                <StatsCard
                    title="Product Catalog"
                    value={stats.products.toString()}
                    change="Active"
                    trend="up"
                    icon={Package}
                    color="bg-stone"
                />
                <StatsCard
                    title="Citizen Registry"
                    value={stats.customers.toString()}
                    change="+42 new"
                    trend="up"
                    icon={Users}
                    color="bg-acid"
                />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Revenue Chart Area */}
                <div className="lg:col-span-8 bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="font-display text-2xl uppercase italic">MISSION PULSE</h2>
                            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">7-Day Revenue Log</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-acid/10 border border-ink/10 rounded-lg">
                            <div className="w-2 h-2 bg-acid rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest italic">Live Feed</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center animate-pulse">
                                <p className="font-display text-lg uppercase italic opacity-20">Calibrating Pulse...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D9FF00" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D9FF00" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#0A2A1F', opacity: 0.4 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-ink text-white p-3 rounded-xl border-2 border-ink shadow-hard-sm">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                                                        <p className="font-display text-acid">{formatPrice(Number(payload[0].value))}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#0A2A1F"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="lg:col-span-4 bg-ink text-paper border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-acid rounded-full opacity-10 blur-3xl" />
                    <h2 className="font-display text-xl text-acid italic mb-6 uppercase">RESTOCK REQUIRED ✦</h2>
                    <div className="space-y-4">
                        {lowStockProducts.map((item) => (
                            <div key={item.sku} className="flex justify-between items-center bg-white/5 p-4 border border-paper/10 rounded-xl">
                                <div>
                                    <p className="text-xs font-bold uppercase">{item.name}</p>
                                    <p className="text-[10px] font-bold opacity-30">SKU: {item.sku}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-display text-red-400">{item.stock_quantity}</p>
                                    <p className="text-[10px] font-bold uppercase text-red-400">Low Stock</p>
                                </div>
                            </div>
                        ))}
                        {lowStockProducts.length === 0 && (
                            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-center py-4">Inventory integrity secure</p>
                        )}
                    </div>
                    <Link href="/admin/inventory">
                        <Button variant="acid" size="sm" className="w-full mt-6 uppercase italic">
                            Open Inventory
                        </Button>
                    </Link>
                </div>

                {/* Recent Missions Area */}
                <div className="lg:col-span-12 bg-paper border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-display text-2xl uppercase italic">RECENT MISSIONS</h2>
                        <Link href="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest hover:text-acid flex items-center gap-2 group">
                            Full Registry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        {loading ? (
                            <div className="py-10 text-center animate-pulse">
                                <p className="font-display text-lg uppercase italic opacity-20">Scanning Missions...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-ink/10">
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest opacity-40">ORDER ID</th>
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest opacity-40">CUSTOMER</th>
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest opacity-40">CARGO VALUE</th>
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest opacity-40">STATUS</th>
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest opacity-40 text-right">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-ink/5">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-stone/20 transition-colors">
                                            <td className="py-5">
                                                <span className="font-display text-sm italic truncate max-w-[100px] inline-block">{order.id.split('-')[0]}</span>
                                                <p className="text-[10px] font-bold opacity-30 uppercase italic">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </td>
                                            <td className="py-5">
                                                <p className="font-bold text-sm tracking-tight truncate max-w-[200px]">{order.customer_email.toUpperCase()}</p>
                                            </td>
                                            <td className="py-5">
                                                <p className="font-display text-sm">{formatPrice(order.total_amount)}</p>
                                            </td>
                                            <td className="py-5">
                                                <OrderStatusBadge status={order.status} />
                                            </td>
                                            <td className="py-5 text-right">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <button className="p-2 border-2 border-ink rounded-lg bg-white hover:bg-ink hover:text-acid hover:shadow-none translate-x-0 shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 transition-all">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-[10px] font-bold opacity-20 uppercase tracking-widest italic">Zero operations detected</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
