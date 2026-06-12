"use client"

import * as React from "react"
import { StockData } from "@/lib/spreadsheet"
import { TrendingUp, TrendingDown, Activity, Flame } from "lucide-react"

interface MoverStripProps {
  data: StockData[]
  onSelect: (stock: StockData) => void
}

export function MoverStrip({ data, onSelect }: MoverStripProps) {
  const tickerContent = React.useMemo(() => {
    const gainers = [...data].sort((a, b) => b.change1d - a.change1d).slice(0, 5)
    const losers = [...data].sort((a, b) => a.change1d - b.change1d).slice(0, 5)
    const active = [...data].sort((a, b) => b.tradedValue - a.tradedValue).slice(0, 5)
    
    return [
      { type: 'header', label: 'TOP GAINERS', color: 'text-emerald-500' },
      ...gainers.map(s => ({ type: 'stock', ...s })),
      { type: 'header', label: 'TOP LOSERS', color: 'text-rose-500' },
      ...losers.map(s => ({ type: 'stock', ...s })),
      { type: 'header', label: 'MOST ACTIVE', color: 'text-primary' },
      ...active.map(s => ({ type: 'stock', ...s })),
    ]
  }, [data])

  return (
    <div className="w-full relative overflow-hidden border-y border-white/5 py-2 bg-black/40 backdrop-blur-sm">
       <div className="flex w-max animate-marquee gap-8 items-center">
          {/* Main List */}
          {tickerContent.map((item, idx) => (
            <TickerItem key={idx} item={item} onSelect={onSelect} />
          ))}
          {/* Duplicated List for seamless loop */}
          {tickerContent.map((item, idx) => (
            <TickerItem key={`dupe-${idx}`} item={item} onSelect={onSelect} />
          ))}
       </div>
    </div>
  )
}

function TickerItem({ item, onSelect }: { item: any; onSelect: (s: StockData) => void }) {
  if (item.type === 'header') {
    return (
      <div className="flex items-center gap-2 pr-2">
        <div className={`h-1.5 w-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>
          {item.label}
        </span>
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelect(item)}
      className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-md transition-colors group"
    >
      <span className="text-[11px] font-bold text-white group-hover:text-primary transition-colors">
        {item.ticker.split('.')[0]}
      </span>
      <span className="text-[11px] font-mono text-white/50">
        ₹{item.price.toFixed(1)}
      </span>
      <span className={`text-[10px] font-black ${item.change1d >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
        {item.change1d > 0 ? "+" : ""}{item.change1d.toFixed(1)}%
      </span>
    </button>
  )
}
