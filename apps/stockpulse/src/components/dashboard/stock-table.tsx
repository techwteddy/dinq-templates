"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { StockData } from "@/lib/spreadsheet"
import {
  ArrowUpDown, Search, FilterX, TrendingUp, Droplets, Info, ChevronLeft, ChevronRight, Star,
  Settings2, Eye, EyeOff, ChevronUp, ChevronDown, GripVertical, Check, X, Trash2, MoreHorizontal, Scale
} from "lucide-react"
import { EtfSummaryDialog } from "./etf-summary-dialog"
import { MetadataEditDialog } from "./metadata-edit-dialog"
import { Sparkline } from "./sparkline"

const STORAGE_KEY = 'stockPulse-table-settings-v2'

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`
  return `₹${val.toLocaleString()}`
}

// Helper to generate a consistent "fake" sparkline based on ticker and range
const getSparkData = (ticker: string, change1d: number, change30d: number, range: '7d' | '30d') => {
  const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const baseValue = 100 + (seed % 10)

  if (range === '7d') {
    const data = [change1d * 0.8, change1d * 0.5, change1d * 1.2, change1d * 0.9, change1d * 1.5, change1d * 0.7, change1d]
    return data.map(v => baseValue + v)
  } else {
    // 30D: More points, weighted towards 30D change
    const points = 12
    const data = []
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      const volatility = Math.sin(progress * Math.PI * 2 + seed) * 2
      const trend = change30d * progress
      data.push(baseValue + trend + volatility)
    }
    return data
  }
}

interface StockTableProps {
  data: StockData[]
  sectors: string[]
  companies: string[]
  favorites?: string[]
  onToggleFavorite?: (ticker: string) => void
  onRemoveEtf?: (ticker: string) => void
}

export function StockTable({ data, sectors, companies, favorites = [], onToggleFavorite, onRemoveEtf }: StockTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "tradedValue", desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [showOnlyGainers, setShowOnlyGainers] = React.useState(false)
  const [showHighLiquidity, setShowHighLiquidity] = React.useState(false)
  const [selectedStock, setSelectedStock] = React.useState<StockData | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [stockToEdit, setStockToEdit] = React.useState<StockData | null>(null)
  const [sparkRange, setSparkRange] = React.useState<'7d' | '30d'>('7d')
  const [isCustomizing, setIsCustomizing] = React.useState(false)
  const [selectedColumnId, setSelectedColumnId] = React.useState<string | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Customization State
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})
  const [columnOrder, setColumnOrder] = React.useState<string[]>([
    "watchlist", "ticker", "fullName", "price", "change1d", "change30d", "dayHigh", "dayLow", "volume", "tradedValue", "aum", "expenseRatio", "volatility", "trend", "sector"
  ])

  // 1. Initial Load & Migrate
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { visibility, order, sorting: savedSorting, gainers, liquidity } = JSON.parse(saved)
        const defaultOrder = ["watchlist", "ticker", "fullName", "price", "change1d", "change30d", "dayHigh", "dayLow", "volume", "tradedValue", "aum", "expenseRatio", "volatility", "trend", "sector"]
        const newMetricColumns = ["dayHigh", "dayLow", "aum", "expenseRatio", "volatility"]

        // 🛡️ Migrate visibility (Ensure existing settings aren't lost)
        const updatedVisibility = { ...visibility }
        newMetricColumns.forEach(col => {
          if (updatedVisibility[col] === undefined) {
            updatedVisibility[col] = false
          }
        })

        // 🛡️ Migrate order
        const updatedOrder = order ? [...order] : [...defaultOrder]
        newMetricColumns.forEach(col => {
          if (!updatedOrder.includes(col)) {
            updatedOrder.push(col)
          }
        })

        setColumnVisibility(updatedVisibility)
        setColumnOrder(updatedOrder)
        if (savedSorting) setSorting(savedSorting)
        if (gainers !== undefined) setShowOnlyGainers(gainers)
        if (liquidity !== undefined) setShowHighLiquidity(liquidity)
      } catch (e) {
        console.error("Failed to load table settings", e)
      }
    } else {
      // 🛡️ Default hidden columns for new users
      setColumnVisibility({
        dayHigh: false,
        dayLow: false,
        aum: false,
        expenseRatio: false,
        volatility: false,
        sector: false,
      })
    }
    setIsLoaded(true)
  }, [])

  // 2. Persistent Save (only after load)
  React.useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      visibility: columnVisibility,
      order: columnOrder,
      sorting,
      gainers: showOnlyGainers,
      liquidity: showHighLiquidity
    }))
  }, [isLoaded, columnVisibility, columnOrder, sorting, showOnlyGainers, showHighLiquidity])

  const columns: ColumnDef<StockData>[] = React.useMemo(() => [
    {
      id: "watchlist",
      accessorKey: "watchlist",
      header: () => <span className="uppercase tracking-widest text-[9px] font-black text-muted-foreground/40 block text-center">Fav</span>,
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(row.original.ticker)
          }}
          className={`transition-colors p-1 hover:bg-white/5 rounded-md ${favorites.includes(row.original.ticker) ? "text-amber-400" : "text-white/20 hover:text-white/40"
            }`}
        >
          <Star className={`h-3.5 w-3.5 ${favorites.includes(row.original.ticker) ? "fill-current" : ""}`} />
        </button>
      ),
    },
    {
      id: "ticker",
      accessorKey: "ticker",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Symbol <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col w-[50px]">
          <span className="font-mono text-sm font-black text-white">{row.original.ticker.split('.')[0]}</span>
          <span className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-tighter">NSE</span>
        </div>
      ),
    },
    {
      id: "fullName",
      accessorKey: "fullName",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ETF Discovery <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[280px] lg:max-w-[320px]">
          <button
            className="font-bold text-sm text-white text-left hover:text-primary transition-all group truncate"
            title={row.original.fullName}
            onClick={() => {
              setSelectedStock(row.original)
              setDialogOpen(true)
            }}
          >
            {row.original.fullName}
          </button>
          <span className="text-[10px] text-muted-foreground/50 font-bold truncate" title={row.original.company}>
            {row.original.company}
          </span>
        </div>
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => <span className="font-mono text-sm font-black text-white">₹{row.original.price.toFixed(1)}</span>,
    },
    {
      id: "volume",
      accessorKey: "volume",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Volume <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => <span className="text-xs text-muted-foreground/60 font-mono font-bold tracking-tighter">{row.original.volume.toLocaleString()}</span>,
    },
    {
      id: "change1d",
      accessorKey: "change1d",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Day % <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => {
        const val = row.original.change1d;
        return (
          <div className={`text-xs font-black px-2 py-0.5 rounded ${val >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
            {val > 0 ? "+" : ""}{val.toFixed(2)}%
          </div>
        )
      },
    },
    {
      id: "change30d",
      accessorKey: "change30d",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          30D % <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => {
        const val = row.original.change30d;
        return (
          <div className={`text-xs font-black px-2 py-0.5 rounded ${val >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
            {val > 0 ? "+" : ""}{val.toFixed(2)}%
          </div>
        )
      },
    },
    {
      id: "trend",
      header: () => (
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest text-[10px] font-black text-muted-foreground">Trend</span>
          <div className="flex items-center bg-white/5 rounded-md p-0.5 border border-white/5">
            {(['7d', '30d'] as const).map(r => (
              <button
                key={r}
                onClick={(e) => {
                  e.stopPropagation()
                  setSparkRange(r)
                }}
                className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded transition-all ${sparkRange === r ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground/50 hover:text-white/60'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      ),
      cell: ({ row }) => (
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
          <Sparkline
            data={getSparkData(row.original.ticker, row.original.change1d, row.original.change30d, sparkRange)}
            color={(sparkRange === '7d' ? row.original.change1d : row.original.change30d) >= 0 ? "#10b981" : "#f43f5e"}
            width={120}
            height={28}
            strokeWidth={1.8}
          />
        </div>
      )
    },
    {
      id: "tradedValue",
      accessorKey: "tradedValue",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Val (Cr) <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => <span className="text-xs text-muted-foreground font-mono font-bold italic">{formatCurrency(row.original.tradedValue)}</span>,
    },
    {
      id: "dayHigh",
      accessorKey: "dayHigh",
      header: ({ column }) => <button className="uppercase tracking-widest text-[10px] font-black text-muted-foreground mr-4" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Day High</button>,
      cell: ({ row }) => <span className="text-[11px] font-bold text-emerald-400/90 pr-4">₹{row.original.dayHigh.toLocaleString()}</span>,
    },
    {
      id: "dayLow",
      accessorKey: "dayLow",
      header: ({ column }) => <button className="uppercase tracking-widest text-[10px] font-black text-muted-foreground mr-4" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Day Low</button>,
      cell: ({ row }) => <span className="text-[11px] font-bold text-rose-400/90 pr-4">₹{row.original.dayLow.toLocaleString()}</span>,
    },
    {
      id: "aum",
      accessorKey: "aum",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors mr-4" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          AUM (Cr) <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => {
        const isEquity = row.original.assetType === 'EQUITY'
        if (isEquity) return <span className="text-[11px] text-white/10 pr-4">—</span>
        return <span className="text-[11px] font-bold text-slate-300 pr-4">{row.original.aum ? formatCurrency(row.original.aum) : "N/A"}</span>
      },
    },
    {
      id: "expenseRatio",
      accessorKey: "expenseRatio",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors mr-4" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Exp. Ratio <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => {
        const isEquity = row.original.assetType === 'EQUITY'
        if (isEquity) {
          return (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest border text-blue-400 bg-blue-400/10 border-blue-400/20">
              EQ
            </span>
          )
        }
        return (
          <span className="text-[11px] font-bold text-slate-300 pr-4">
            {row.original.expenseRatio ? `${row.original.expenseRatio.toFixed(2)}%` : "N/A"}
          </span>
        )
      },
    },
    {
      id: "volatility",
      accessorKey: "volatility",
      header: ({ column }) => <button className="uppercase tracking-widest text-[10px] font-black text-muted-foreground mr-4" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Volatility</button>,
      cell: ({ row }) => {
        const val = row.original.volatility;
        const color = val === "LOW" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
          val === "HIGH" ? "text-rose-400 bg-rose-400/10 border-rose-400/20" :
            "text-amber-400 bg-amber-400/10 border-amber-400/20";
        return (
          <div className="pr-4">
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest border ${color}`}>
              {val}
            </span>
          </div>
        )
      },
    },
    {
      id: "sector",
      accessorKey: "sector",
      header: ({ column }) => (
        <button className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-black text-muted-foreground hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Sector <ArrowUpDown className="h-2.5 w-2.5" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-[11px] text-white/40 font-black uppercase tracking-widest">
          {row.original.sector}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <ActionCell
          row={row}
          onRemoveEtf={onRemoveEtf}
          onEditMetadata={(stock) => {
            setStockToEdit(stock)
            setEditDialogOpen(true)
          }}
        />
      ),
    }
  ], [favorites, onToggleFavorite, onRemoveEtf, sparkRange])

  const filteredData = React.useMemo(() => {
    let result = data
    if (showOnlyGainers) {
      result = result.filter(s => s.change1d > 0)
    }
    if (showHighLiquidity) {
      result = result.filter(s => s.tradedValue >= 10000000)
    }
    return result
  }, [data, showOnlyGainers, showHighLiquidity])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  const isFiltered = columnFilters.length > 0 || showOnlyGainers || showHighLiquidity

  const moveColumn = (direction: 'up' | 'down') => {
    if (!selectedColumnId) return
    const currentIndex = columnOrder.indexOf(selectedColumnId)
    if (currentIndex === -1) return

    const newOrder = [...columnOrder]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newOrder.length) return

    const temp = newOrder[currentIndex]
    newOrder[currentIndex] = newOrder[targetIndex]
    newOrder[targetIndex] = temp
    setColumnOrder(newOrder)
  }

  return (
    <div className="space-y-4">
      <EtfSummaryDialog
        stock={selectedStock}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <MetadataEditDialog
        stock={stockToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={() => {
          window.location.reload()
        }}
      />

      {/* FILTER TOOLBAR */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <div className="relative flex-1 md:w-64 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("fullName")?.setFilterValue(event.target.value)
                  }
                  className="pl-9 h-[40px] border-white/5 bg-white/5 focus-visible:ring-primary focus-visible:border-white/20 text-sm font-bold text-white placeholder:text-muted-foreground/30 rounded-xl"
                />
              </div>

              <Select
                value={(table.getColumn("sector")?.getFilterValue() as string) || "all-sectors"}
                onValueChange={(val) =>
                  table.getColumn("sector")?.setFilterValue(val === "all-sectors" ? "" : val)
                }
              >
                <SelectTrigger className="w-[110px] md:w-[160px] !h-[40px] min-h-0 !py-0 border-white/5 bg-white/5 text-xs md:text-sm font-bold text-white rounded-xl focus:ring-primary shadow-none capitalize">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0e14] border-white/10 text-white">
                  <SelectItem value="all-sectors">All Sectors</SelectItem>
                  {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters()
                  setShowOnlyGainers(false)
                  setShowHighLiquidity(false)
                }}
                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyGainers(!showOnlyGainers)}
                className={`h-9 gap-2 px-3 md:px-4 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border-none ${showOnlyGainers ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-muted-foreground hover:text-white"
                  }`}
              >
                <TrendingUp className="h-3 w-3" />
                Gainers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHighLiquidity(!showHighLiquidity)}
                className={`h-9 gap-2 px-3 md:px-4 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border-none ${showHighLiquidity ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground hover:text-white"
                  }`}
              >
                <Droplets className="h-3 w-3" />
                High Volume
              </Button>
            </div>

            {/* VERTICAL SETTINGS DROPDOWN TRIGGER */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`h-9 w-9 border-none transition-all rounded-xl ${isCustomizing
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.4)] opacity-100 scale-105"
                  : "bg-white/5 text-white hover:bg-white/10"
                  }`}
              >
                {isCustomizing ? <Check className="h-4 w-4 stroke-[3px]" /> : <Settings2 className="h-4 w-4" />}
              </Button>

              {/* FLOATING VERTICAL PANEL */}
              {isCustomizing && (
                <div
                  className="absolute right-0 top-12 z-[100] w-72 bg-[#0a0b0d]/98 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                >
                  <div className="flex items-center justify-between mb-5 px-1 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Advanced View</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveColumn('up')}
                        disabled={!selectedColumnId || columnOrder.indexOf(selectedColumnId || "") === 0}
                        className="h-6 w-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-10 transition-all"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveColumn('down')}
                        disabled={!selectedColumnId || columnOrder.indexOf(selectedColumnId || "") === columnOrder.length - 1}
                        className="h-6 w-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-10 transition-all"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    {table.getAllLeafColumns().map((column) => {
                      const isSelected = selectedColumnId === column.id
                      return (
                        <div
                          key={column.id}
                          onClick={() => setSelectedColumnId(column.id)}
                          className={`group flex items-center justify-between px-3 py-1 rounded-xl border transition-all cursor-pointer ${isSelected ? "bg-primary/20 border-primary/50" : "bg-white/[0.01] border-transparent hover:bg-white/[0.03] hover:border-white/5"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full transition-all ${isSelected ? "bg-primary scale-125" : "bg-white/10 group-hover:bg-white/30"}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${isSelected ? "text-primary" : "text-slate-200"}`}>
                              {column.id === 'watchlist' ? 'Watchlist' :
                                (typeof column.columnDef.header === 'string'
                                  ? column.columnDef.header
                                  : column.id.replace(/([A-Z])/g, ' $1').trim())
                              }
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              column.toggleVisibility()
                            }}
                            className={`p-1.5 rounded-md transition-all ${column.getIsVisible() ? 'text-primary' : 'text-white/10 hover:text-white/40'}`}
                          >
                            {column.getIsVisible() ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5">
                    <Button
                      onClick={() => {
                        setColumnVisibility({})
                        setColumnOrder(["watchlist", "ticker", "fullName", "price", "change1d", "change30d", "volume", "trend", "tradedValue", "sector"])
                        setSelectedColumnId(null)
                      }}
                      variant="ghost"
                      className="h-6 w-full text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-lg"
                    >
                      Reset Default
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md relative z-10 w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/[0.01]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-white/5">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10 px-4 text-left first:w-[40px]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group hover:bg-white/[0.04] border-white/[0.02] transition-colors cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5 px-4 first:w-[40px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleFlatColumns().length} className="h-32 text-center text-muted-foreground italic text-xs font-medium tracking-wide">
                  NO MATCHES FOUND
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 rounded-lg hover:bg-white/5 text-white disabled:opacity-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 rounded-lg hover:bg-white/5 text-white disabled:opacity-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ActionCell({ row, onRemoveEtf, onEditMetadata }: { row: any, onRemoveEtf?: (ticker: string) => void, onEditMetadata: (stock: any) => void }) {
  const [open, setOpen] = React.useState(false)
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [menuRect, setMenuRect] = React.useState<{ top: number, left: number } | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Handle positioning on open
  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setMenuRect({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 192, // 192 is w-48
      })
    }
  }, [open])

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setIsConfirming(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handler)
    }
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="flex justify-center">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
          setIsConfirming(false)
        }}
        className="transition-colors p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white group-hover:opacity-100 data-[state=open]:opacity-100"
        data-state={open ? "open" : "closed"}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && menuRect && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: menuRect.top,
            left: menuRect.left,
          }}
          className="w-48 bg-[#0f1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onEditMetadata(row.original)
              setOpen(false)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all text-left"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Edit Metadata
          </button>

          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all text-left"
          >
            <span className="flex items-center gap-2.5">
              <Scale className="h-3.5 w-3.5" />
              Compare ETF
            </span>
            <span className="text-[9px] uppercase tracking-widest text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">Soon</span>
          </button>

          <div className="h-px bg-white/5 my-1 mx-2" />

          {isConfirming ? (
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Confirm?</span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    onRemoveEtf?.(row.original.ticker)
                    setOpen(false)
                  }}
                  className="p-1 hover:bg-rose-500/20 rounded-md text-rose-400"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsConfirming(false)}
                  className="p-1 hover:bg-white/10 rounded-md text-white/40"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirming(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-left"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove ETF
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
