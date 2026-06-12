import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change: string;
    trend: 'up' | 'down';
    icon: any;
    color?: string;
}

export default function StatsCard({ title, value, change, trend, icon: Icon, color = 'bg-stone' }: StatsCardProps) {
    return (
        <div className="bg-white border-2 border-ink rounded-[2rem] p-6 shadow-hard hover:shadow-hard-xl transition-all group overflow-hidden relative">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-full blur-3xl -z-10 group-hover:opacity-20 transition-opacity`} />

            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 border-2 border-ink rounded-2xl ${color} shadow-hard-sm group-hover:-rotate-3 transition-transform`}>
                    <Icon className="w-6 h-6 text-ink" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-ink rounded-lg ${trend === 'up' ? 'bg-acid text-ink' : 'bg-red-100 text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </div>
            </div>

            <div>
                <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.3em] mb-1 italic">{title}</h3>
                <p className="font-display text-4xl text-ink tracking-tighter leading-none">{value}</p>
            </div>

            {/* Subtle Texture/Pattern */}
            <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-12 h-12 text-ink" />
            </div>
        </div>
    );
}
