"use client"

import * as React from "react"
import { Search, X, Plus, Check, Loader2, TrendingUp } from "lucide-react"

interface SearchResult {
  symbol: string
  longname?: string
  shortname?: string
  exchDisp?: string
  quoteType?: string
}

interface ETFSearchModalProps {
  open: boolean
  onClose: () => void
  userEtfs: string[]
  onAdd: (ticker: string, fullName: string, sector: string, company: string, assetType: 'ETF' | 'EQUITY') => void
  onRemove: (ticker: string) => void
}

export function ETFSearchModal({ open, onClose, userEtfs, onAdd, onRemove }: ETFSearchModalProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [adding, setAdding] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery("")
      setResults([])
    }
  }, [open])

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim() || query.length < 2) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  const handleAdd = async (r: SearchResult) => {
    setAdding(r.symbol)
    const name = r.longname || r.shortname || r.symbol
    const company = name.split(" ")[0].toUpperCase()
    const assetType: 'ETF' | 'EQUITY' = r.quoteType === 'ETF' ? 'ETF' : 'EQUITY'
    await onAdd(r.symbol, name, "MARKET", company, assetType)
    setAdding(null)
  }

  const handleRemove = async (ticker: string) => {
    setAdding(ticker)
    await onRemove(ticker)
    setAdding(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Add ETFs</h2>
            </div>
            <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            {loading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 animate-spin" />}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search ETFs... (e.g. Nifty 50, Gold ETF)"
              className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-muted-foreground/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
          {results.length === 0 && !loading && query.length > 1 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No results found for &quot;{query}&quot;</p>
            </div>
          )}

          {results.length === 0 && !query && (
            <div className="p-8 text-center space-y-2">
              <Search className="h-8 w-8 text-muted-foreground/20 mx-auto" />
              <p className="text-xs text-muted-foreground/50 font-bold">Search Indian Stocks & ETFs by name or ticker</p>
              <p className="text-[10px] text-muted-foreground/30">Powered by Yahoo Finance</p>
            </div>
          )}

          {results.map(r => {
            const isAdded = userEtfs.includes(r.symbol)
            const isLoading = adding === r.symbol
            const name = r.longname || r.shortname || r.symbol
            const ticker = r.symbol.replace(".NS", "").replace(".BO", "")

            return (
              <div key={r.symbol} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-black border rounded px-1.5 py-0.5 uppercase tracking-widest shrink-0 ${
                      r.quoteType === 'EQUITY'
                        ? 'text-blue-400/80 bg-blue-500/10 border-blue-500/20'
                        : 'text-emerald-400/70 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      {ticker}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 font-bold uppercase">{r.exchDisp}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1 py-0.5 rounded ${
                      r.quoteType === 'EQUITY' ? 'text-blue-400/60' : 'text-emerald-400/60'
                    }`}>{r.quoteType === 'EQUITY' ? 'STOCK' : 'ETF'}</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{name}</p>
                </div>

                <button
                  onClick={() => isAdded ? handleRemove(r.symbol) : handleAdd(r)}
                  disabled={isLoading}
                  className={`ml-4 h-7 w-7 shrink-0 flex items-center justify-center rounded-xl border transition-all ${isAdded
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                    }`}
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : isAdded ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
          <p className="text-[10px] text-muted-foreground/40 font-bold text-center">
            {userEtfs.length} ETF{userEtfs.length !== 1 ? "s" : ""} in your watchlist
          </p>
        </div>
      </div>
    </div>
  )
}
