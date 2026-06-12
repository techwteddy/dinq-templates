'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    ShoppingBag,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import Button from '@/components/ui/Button';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7D');
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        avgOrderValue: 0,
        conversionRate: '3.82%'
    });
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAnalytics() {
            setLoading(true);
            try {
                // 1. Fetch Orders
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*, order_items(*)');

                if (!orders) return;

                const paidOrders = orders.filter(o => o.payment_status === 'paid');
                const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

                setStats({
                    revenue: totalRevenue,
                    orders: orders.length,
                    avgOrderValue: orders.length ? totalRevenue / orders.length : 0,
                    conversionRate: '3.82%'
                });

                // 2. Process Revenue Over Time
                const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90;
                const dateArray = Array.from({ length: days }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const dailyStats = dateArray.map(date => {
                    const revenue = paidOrders
                        .filter(o => o.created_at.startsWith(date))
                        .reduce((acc, curr) => acc + Number(curr.total_amount), 0);

                    return {
                        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        revenue
                    };
                });
                setRevenueData(dailyStats);

                // 3. Top Products
                const productSales: Record<string, { name: string; sales: number }> = {};
                paidOrders.forEach(order => {
                    order.order_items?.forEach((item: any) => {
                        if (!productSales[item.product_id]) {
                            productSales[item.product_id] = { name: item.product_name, sales: 0 };
                        }
                        productSales[item.product_id].sales += item.quantity;
                    });
                });

                const sortedProducts = Object.values(productSales)
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5);
                setTopProducts(sortedProducts);

            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, [timeRange]);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                        SYSTEM <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>INTELLIGENCE.</span>
                    </h1>
                    <p className="font-bold opacity-40 mt-2 uppercase tracking-widest text-xs italic">Advanced data metrics & vector projections</p>
                </div>
                <div className="flex bg-white border-2 border-ink rounded-xl p-1 shadow-hard-sm">
                    {['7D', '30D', '90D'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${timeRange === range ? 'bg-acid text-ink' : 'text-ink/40 hover:text-ink'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'GROSS YIELD', value: formatPrice(stats.revenue), change: '+12%', trend: 'up', icon: TrendingUp },
                    { label: 'CONVERSION', value: stats.conversionRate, change: '+0.5%', trend: 'up', icon: Users },
                    { label: 'AVG ORDER', value: formatPrice(stats.avgOrderValue), change: '-2%', trend: 'down', icon: ShoppingBag },
                    { label: 'RETENTION', value: '24%', change: '+4%', trend: 'up', icon: BarChart3 },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white border-2 border-ink rounded-[2rem] p-6 shadow-hard group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-stone/20 p-3 rounded-xl border-2 border-ink shadow-hard-sm group-hover:-rotate-3 transition-transform">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border-2 border-ink ${stat.trend === 'up' ? 'bg-acid' : 'bg-red-100 text-red-600'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 italic mb-1">{stat.label}</p>
                        <p className="font-display text-3xl">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Revenue Overview Area Chart */}
                <div className="lg:col-span-8 bg-paper border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden h-[450px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-acid/5 rounded-full blur-3xl -z-10" />
                    <h2 className="font-display text-2xl uppercase italic mb-8">REVENUE VECTOR</h2>

                    <div className="h-[320px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center animate-pulse">
                                <p className="font-display text-lg uppercase italic opacity-20">Scanning Trajectory...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D2E823" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#D2E823" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D6" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#0A2A1F', opacity: 0.4 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#0A2A1F', opacity: 0.4 }} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-ink text-white p-4 rounded-xl border-2 border-ink shadow-hard-sm">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">{payload[0].payload.date}</p>
                                                        <p className="font-display text-xl text-acid">{formatPrice(Number(payload[0].value))}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#0A2A1F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Top Formulations Bar Chart */}
                <div className="lg:col-span-4 bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard h-[450px]">
                    <h2 className="font-display text-xl uppercase italic mb-8">SECTOR YIELD</h2>

                    <div className="h-[280px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center animate-pulse">
                                <p className="font-display text-lg uppercase italic opacity-20">Calculating Yield...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 8, fontWeight: 'bold', fill: '#0A2A1F' }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="sales" radius={[0, 8, 8, 0]}>
                                        {topProducts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D2E823' : '#0A2A1F'} stroke="#0A2A1F" strokeWidth={2} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="space-y-4 mt-4">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-t border-ink/5 pt-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full border border-ink" style={{ backgroundColor: i % 2 === 0 ? '#D2E823' : '#0A2A1F' }} />
                                    <span className="truncate max-w-[120px]">{product.name}</span>
                                </div>
                                <span className="font-display text-sm">{product.sales} UNITS</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Intelligence Card */}
            <div className="bg-ink text-paper border-2 border-ink rounded-[2.5rem] p-10 shadow-hard-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-acid opacity-5 rounded-full blur-3xl -z-10 group-hover:opacity-10 transition-opacity" />
                <div className="max-w-2xl">
                    <div className="inline-block bg-acid text-ink px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">AI INSIGHTS ✦</div>
                    <h2 className="font-display text-3xl text-paper uppercase italic leading-none mb-6">MISSION TRAJECTORY SECURE</h2>
                    <p className="font-bold opacity-40 uppercase tracking-[0.2em] text-xs leading-relaxed">System analysis indicates a surging demand for Ayurvedic formulations. Vector projections suggest optimizing cargo for the upcoming healing cycle.</p>
                </div>
            </div>
        </div>
    );
}
