"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useStockStore } from "@/store/useStockStore"
import { StockTable } from "@/components/dashboard/stock-table"
import { MoverStrip } from "@/components/dashboard/mover-strip"
import { AuthHeader } from "@/components/dashboard/auth-header"
import { ETFSearchModal } from "@/components/dashboard/etf-search-modal"
import { useUserEtfs, useUserFavorites } from "@/lib/hooks/useSupabase"
import { Activity, RefreshCw, Plus, Star, LayoutGrid } from "lucide-react"
import { StockData } from "@/lib/spreadsheet"

type ViewMode = "all" | "favorites"

export default function LiveDashboard() {
  const { setStocks, setLastUpdated, lastUpdated } = useStockStore()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<ViewMode>("all")

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("stockPulse-dashboard-view")
    if (saved === "all" || saved === "favorites") {
      setViewMode(saved as ViewMode)
    }
  }, [])

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem("stockPulse-dashboard-view", viewMode)
  }, [viewMode])

  const { userEtfs, addEtf, removeEtf } = useUserEtfs()
  const { favorites, toggleFavorite } = useUserFavorites()

  const { data: stocks = [], isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const res = await fetch(`/api/stocks?t=${Date.now()}`)
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    refetchInterval: 15000, // Reduced to 15s to be more server-friendly, but still responsive
  })

  React.useEffect(() => {
    if (stocks.length > 0) {
      setStocks(stocks)
      // Update lastUpdated whenever query finishes fetching successfully
      setLastUpdated(new Date(dataUpdatedAt))
    }
  }, [stocks, dataUpdatedAt, setStocks, setLastUpdated])

  // Filter stocks based on view mode
  const filteredStocks = React.useMemo(() => {
    if (viewMode === "favorites") {
      return stocks.filter((s: StockData) => favorites.includes(s.ticker))
    }
    return stocks
  }, [stocks, viewMode, favorites])

  const sectors = React.useMemo(() =>
    Array.from(new Set(filteredStocks.map((s: any) => s.sector))).sort() as string[]
    , [filteredStocks])

  const companies = React.useMemo(() =>
    Array.from(new Set(filteredStocks.map((s: any) => s.company))).sort() as string[]
    , [filteredStocks])

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-slate-200">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#0a0b0d]/80 backdrop-blur-xl border-b border-white/5">
        <div className="p-4 md:p-6 lg:px-8 lg:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Row 1: Brand + Mobile Snapshot/Auth */}
          <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <svg className="h-10 w-10 flex-shrink-0 drop-shadow-xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="url(#SVGnR2Endgx)" fillRule="evenodd" d="M21 13.04c0 .091-.02.179-.057.255l-3.86 7.21a.91.91 0 0 1-.794.495H7.71a.91.91 0 0 1-.794-.494l-3.86-7.212A.6.6 0 0 1 3 13.04c0-.298.224-.54.501-.54h4.235l1.074 1.966l.006.012a.48.48 0 0 0 .68.18l.012-.008a.54.54 0 0 0 .219-.323l1.367-5.702l1.175 9.18l.002.013c.043.289.292.489.563.449l.012-.002a.52.52 0 0 0 .404-.398l1.649-6.873l.677 1.24l.006.011a.5.5 0 0 0 .425.255H20.5c.277 0 .501.242.501.54M16.289 3c.327 0 .63.188.793.494l3.861 7.211a.6.6 0 0 1 .057.256c0 .298-.224.54-.501.54h-4.25l-1.073-1.966l-.007-.013a.5.5 0 0 0-.299-.236l-.012-.003c-.264-.067-.53.106-.599.39l-1.367 5.703l-1.174-9.18l-.002-.013a.53.53 0 0 0-.37-.437c-.267-.074-.54.1-.61.388l-1.649 6.873l-.676-1.24l-.007-.011a.5.5 0 0 0-.425-.255H3.5c-.277 0-.501-.242-.501-.54c0-.091.019-.178.056-.253l3.861-7.214A.91.91 0 0 1 7.711 3z" clipRule="evenodd" /><defs><linearGradient id="SVGnR2Endgx" x1="18.226" x2="5.326" y1="2.147" y2="20.689" gradientUnits="userSpaceOnUse"><stop stopColor="#00eaff" /><stop offset=".253" stopColor="#0080ff" /><stop offset=".497" stopColor="#8000ff" /><stop offset=".75" stopColor="#e619e6" /><stop offset=".999" stopColor="red" /></linearGradient></defs></g></svg>
              <div>
                <h2 className="text-2xl font-sans text-white tracking-tighter">StockPulse</h2>
              </div>
            </div>

            {/* Mobile Only: Snapshot & Auth */}
            <div className="flex md:hidden items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[7px] text-muted-foreground uppercase font-black tracking-widest opacity-40">Snapshot</span>
                <span className="text-xs font-mono font-bold text-white/90" suppressHydrationWarning>
                  {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
              </div>
              <AuthHeader />
            </div>
          </div>

          {/* Row 2 (Mobile) / Right Control (Desktop) */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Action Group */}
            <div className="flex items-center gap-2">
              {/* All / Favorites toggle */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("all")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === "all"
                    ? "bg-white/10 text-white shadow"
                    : "text-muted-foreground hover:text-white"
                    }`}
                >
                  <LayoutGrid className="h-3 w-3" />
                  All
                </button>
                <button
                  onClick={() => setViewMode("favorites")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === "favorites"
                    ? "bg-amber-500/15 text-amber-400 shadow border border-amber-500/20"
                    : "text-muted-foreground hover:text-white"
                    }`}
                >
                  <Star className={`h-3 w-3 ${viewMode === "favorites" ? "fill-amber-400" : ""}`} />
                  Favs
                </button>
              </div>

              {/* Add ETF Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-xl px-3 py-2 transition-all text-[9px] font-black uppercase tracking-widest"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            {/* Desktop Only: Snapshot & Auth */}
            <div className="hidden md:flex items-center gap-4">
              {/* Snapshot */}
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-40">Snapshot</span>
                <span className="text-sm font-mono font-bold text-white tracking-widest" suppressHydrationWarning>
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                </span>
              </div>
              <button
                onClick={() => refetch()}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 active:scale-95"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </button>

              <AuthHeader />
            </div>

            {/* Mobile Only: Quick Refresh */}
            <button
              onClick={() => refetch()}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white active:scale-90"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* TICKER STRIP */}
        <div className="w-full">
          <MoverStrip data={stocks} onSelect={() => { }} />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-4 md:p-6 lg:p-8 space-y-6">

        {/* Empty state for ALL ETFs (User hasn't added any ETF) */}
        {viewMode === "all" && filteredStocks.length === 0 && !isFetching && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 border border-white/5 rounded-3xl bg-white/[0.02]">
            <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
              <Plus className="h-8 w-8 text-emerald-400/80" />
            </div>
            <p className="text-xl font-black text-white">Your Dashboard is Empty</p>
            <p className="text-sm text-muted-foreground/70 max-w-sm text-center">
              Search and add Indian ETFs to your watchlist to start tracking their performance, expense ratio, and more.
            </p>
            <button
              onClick={() => setSearchOpen(true)}
              className="mt-4 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl px-6 py-3 transition-all text-sm font-black uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
            >
              <Plus className="h-4 w-4" />
              Add Your First ETF
            </button>
          </div>
        )}

        {/* Empty state for favorites */}
        {viewMode === "favorites" && filteredStocks.length === 0 && !isFetching && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Star className="h-8 w-8 text-amber-400/50" />
            </div>
            <p className="text-sm font-black text-muted-foreground">No favorites yet</p>
            <p className="text-xs text-muted-foreground/50">Star an ETF from the table to add it here</p>
            <button
              onClick={() => setViewMode("all")}
              className="text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              ← Back to All ETFs
            </button>
          </div>
        )}

        {/* TABLE */}
        {filteredStocks.length > 0 && (
          <StockTable
            data={filteredStocks}
            sectors={sectors}
            companies={companies}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onRemoveEtf={removeEtf}
          />
        )}
      </div>

      {/* ETF Search Modal */}
      <ETFSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        userEtfs={userEtfs}
        onAdd={addEtf}
        onRemove={removeEtf}
      />
    </div>
  )
}
