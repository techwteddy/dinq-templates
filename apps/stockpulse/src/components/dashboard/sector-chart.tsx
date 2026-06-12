"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StockData } from "@/lib/spreadsheet"
import { Activity, BarChart3 } from "lucide-react"

interface SectorChartProps {
  data: StockData[]
}

export function SectorChart({ data }: SectorChartProps) {
  // Calculate average 1D performance per sector
  const sectorPerformance = data.reduce((acc, stock) => {
    if (!acc[stock.sector]) {
      acc[stock.sector] = { totalChange: 0, count: 0 }
    }
    acc[stock.sector].totalChange += stock.change1d
    acc[stock.sector].count += 1
    return acc
  }, {} as Record<string, { totalChange: number, count: number }>)

  const chartData = Object.entries(sectorPerformance)
    .map(([name, stats]) => ({
      name: name.toUpperCase(),
      avgChange: stats.totalChange / stats.count
    }))
    .sort((a, b) => b.avgChange - a.avgChange)
    .slice(0, 10) // Show top 10 sectors by performance

  return (
    <Card className="col-span-full xl:col-span-1 bg-[#0b0e14]/50 border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      <div className="absolute -right-12 -bottom-12 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
         <BarChart3 className="h-48 w-48 text-white" />
      </div>

      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center gap-2 mb-1">
           <Activity className="h-3.5 w-3.5 text-primary" />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Industry Pulse</span>
        </div>
        <CardTitle className="text-xl font-black text-white tracking-tight">Sector Performance</CardTitle>
        <p className="text-[11px] text-muted-foreground font-medium">Avg 1D Momentum by Industry</p>
      </CardHeader>

      <CardContent className="h-[400px] pb-6 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              type="number" 
              domain={['auto', 'auto']} 
              fontSize={10} 
              tick={{ fill: '#64748b' }}
              tickFormatter={(val) => `${val.toFixed(1)}%`} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              fontSize={9} 
              width={100}
              tick={{ fill: '#94a3b8', fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number
                  return (
                    <div className="rounded-xl border border-white/10 bg-[#0f172a] p-3 shadow-2xl backdrop-blur-md">
                      <div className="text-[10px] font-black text-muted-foreground uppercase mb-1 tracking-wider">{payload[0].payload.name}</div>
                      <div className={`text-sm font-black ${val >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {val > 0 ? "+" : ""}{val.toFixed(2)}% AVG
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="avgChange" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.avgChange >= 0 ? '#10b981' : '#f43f5e'}
                  className="transition-all duration-500 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
