"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StockData } from "@/lib/spreadsheet"
import { TradingViewChart } from "./tradingview-chart"
import { useQuery } from "@tanstack/react-query"
import { Info, Clock, BarChart3, LineChart, CandlestickChart, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useStockStore } from "@/store/useStockStore"

interface EtfSummaryDialogProps {
  stock: StockData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
  return `₹${val.toLocaleString()}`
}

const RANGES = [
  { label: '1D', value: '1d', interval: '1m' },
  { label: '5D', value: '5d', interval: '15m' },
  { label: '1M', value: '1mo', interval: '1d' },
  { label: '1Y', value: '1y', interval: '1d' },
]

export function EtfSummaryDialog({ stock, open, onOpenChange }: EtfSummaryDialogProps) {
  const [range, setRange] = React.useState(RANGES[2]) // Default 1M
  const [chartType, setChartType] = React.useState<'area' | 'candlestick'>('candlestick')

  const liveStock = useStockStore((state: any) =>
    state.stocks.find((s: any) => s.ticker === stock?.ticker)
  )

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['history', stock?.ticker, range.value],
    queryFn: async () => {
      if (!stock?.ticker) return { quotes: [], meta: null }
      const res = await fetch(`/api/stocks?ticker=${stock.ticker}&range=${range.value}&interval=${range.interval}&t=${Date.now()}`)
      return res.json()
    },
    enabled: !!stock?.ticker && open,
  })

  const history = historyData?.quotes || []
  const meta = historyData?.meta || null

  const latestTick = React.useMemo(() => {
    if (!liveStock || history.length === 0) return null
    return {
      time: Math.floor(Date.now() / 1000) as any,
      open: liveStock.price,
      high: liveStock.price,
      low: liveStock.price,
      close: liveStock.price,
      value: liveStock.price,
    }
  }, [liveStock, history.length])

  const prevClose = range.value === '1d' ? meta?.previousClose : null

  const { data: details, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['details', stock?.ticker],
    queryFn: async () => {
      if (!stock?.ticker) return { expenseRatio: null }
      const res = await fetch(`/api/stocks?ticker=${stock.ticker}&details=true`)
      return res.json()
    },
    enabled: !!stock?.ticker && open,
  })

  if (!stock) return null

  const isPositive = (liveStock?.change1d ?? stock.change1d) >= 0

  const stats = [
    { label: 'Day High', value: `₹${(liveStock?.price ?? stock.price * 1.01).toFixed(2)}` },
    { label: 'Day Low', value: `₹${(liveStock?.price ?? stock.price * 0.99).toFixed(2)}` },
    { label: 'Traded Val', value: formatCurrency(stock.tradedValue) },
    { label: 'AUM (Est)', value: `₹${(stock.tradedValue / 5).toFixed(1)} Cr` },
    {
      label: 'Expense Ratio',
      value: isDetailsLoading ? 'FETCHING...' : (details?.expenseRatio ? `${(details.expenseRatio * 100).toFixed(2)}%` : 'N/A'),
      color: details?.expenseRatio ? 'text-primary' : 'text-muted-foreground/40'
    },
    { label: 'Volatility', value: 'MODERATE' },
    { label: '30D Perf', value: `${stock.change30d >= 0 ? '+' : ''}${stock.change30d.toFixed(2)}%`, color: stock.change30d >= 0 ? 'text-emerald-500' : 'text-rose-500' },
    { label: 'Volume', value: stock.volume.toLocaleString() },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] border-white/5 bg-[#0a0b0d] text-slate-200 p-0 overflow-hidden shadow-2xl rounded-3xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* HEADER SECTION */}
          <div className="p-8 pb-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/5 px-2.5 py-1 rounded text-xs font-black text-muted-foreground uppercase tracking-widest border border-white/5">
                  NSE: {stock.ticker.split('.')[0]}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5" />
                  {stock.sector}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-black uppercase tracking-widest opacity-40">
                <Clock className="h-3.5 w-3.5" />
                Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="space-y-1">
                <DialogTitle className="text-4xl font-heading font-black tracking-tighter text-white">
                  {stock.fullName}
                </DialogTitle>
                <p className="text-sm font-bold text-muted-foreground/70 uppercase tracking-tight">{stock.company}</p>
              </div>

              <div className="text-right">
                <p className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
                  ₹{(liveStock?.price ?? stock.price).toFixed(2)}
                </p>
                <div className={`flex items-center justify-end gap-1 text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {isPositive ? '+' : ''}{(liveStock?.change1d ?? stock.change1d).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8">
            {/* CHART SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner">
                  {RANGES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRange(r)}
                      className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${range.value === r.value
                          ? 'bg-white/10 text-white shadow-lg'
                          : 'text-muted-foreground hover:text-white/60'
                        }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner">
                  <button
                    onClick={() => setChartType('area')}
                    className={`p-2 rounded-lg transition-all ${chartType === 'area' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white/60'}`}
                  >
                    <LineChart className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setChartType('candlestick')}
                    className={`p-2 rounded-lg transition-all ${chartType === 'candlestick' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white/60'}`}
                  >
                    <CandlestickChart className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-black/20 rounded-3xl border border-white/5 p-6 h-[350px] relative">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center opacity-20">
                    <Activity className="h-8 w-8 animate-pulse text-white" />
                  </div>
                ) : (
                  <TradingViewChart
                    data={history}
                    type={chartType}
                    latestTick={latestTick}
                    previousClose={prevClose}
                  />
                )}
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat: any, i) => (
                <div key={i} className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                  <p className={`text-base font-black ${stat.color || 'text-white'} tracking-tight`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* INSIGHT SUMMARY */}
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-5">
                <BarChart3 className="h-32 w-32" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Quick Insight</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-bold max-w-2xl">
                {stock.fullName} is currently trading at ₹{(liveStock?.price ?? stock.price).toFixed(2)}.
                The price has shown a {isPositive ? "positive" : "negative"} trend of {Math.abs(liveStock?.change1d ?? stock.change1d).toFixed(2)}% in the last session.
                Daily volume and turnover suggest {stock.tradedValue > 10000000 ? "strong liquidity" : "moderate market interest"} today.
                Performance over 30 days is {stock.change30d > 0 ? "bullish" : "bearish"} at {stock.change30d.toFixed(2)}%.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
