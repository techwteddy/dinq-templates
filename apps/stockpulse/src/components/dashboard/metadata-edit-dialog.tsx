"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save, Info } from "lucide-react"

interface MetadataEditDialogProps {
  stock: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function MetadataEditDialog({ stock, open, onOpenChange, onUpdate }: MetadataEditDialogProps) {
  const [expenseRatio, setExpenseRatio] = React.useState("")
  const [aumCr, setAumCr] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (stock && open) {
      setExpenseRatio(stock.expenseRatio?.toString() || "")
      setAumCr(stock.aum?.toString() || "")
    }
  }, [stock, open])

  const handleSave = async () => {
    if (!stock) return
    setLoading(true)
    try {
      const res = await fetch("/api/metadata/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: stock.ticker,
          expense_ratio: parseFloat(expenseRatio) || null,
          aum_cr: parseFloat(aumCr) || null,
        }),
      })

      if (res.ok) {
        onUpdate()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Failed to update metadata:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!stock) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1117] border-white/10 rounded-3xl max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
             <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                {stock.ticker.replace(".NS", "").replace(".BO", "")}
             </div>
          </div>
          <DialogTitle className="text-xl font-black text-white leading-tight">Edit Metadata</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
             Update fundamental data manually
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label htmlFor="er" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Expense Ratio (%)</label>
            <div className="relative">
              <Input
                id="er"
                type="number"
                step="0.01"
                value={expenseRatio}
                onChange={(e) => setExpenseRatio(e.target.value)}
                placeholder="e.g. 0.15"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-primary/50 transition-all font-bold placeholder:text-white/10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="aum" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">AUM (Cr)</label>
            <div className="relative">
              <Input
                id="aum"
                type="number"
                step="0.1"
                value={aumCr}
                onChange={(e) => setAumCr(e.target.value)}
                placeholder="e.g. 65.7"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-primary/50 transition-all font-bold placeholder:text-white/10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50">₹ Cr</span>
            </div>
          </div>

          <div className="p-3 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
             <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
             <p className="text-[9px] text-primary/70 leading-relaxed font-bold uppercase tracking-tight">
                This will override standard data sources. Changes will reflect on dashboard after refresh.
             </p>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 mt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white rounded-xl h-11 font-black uppercase text-[10px] tracking-widest transition-all"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl h-11 font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-3.5 w-3.5 mr-2" /> Save Data</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
