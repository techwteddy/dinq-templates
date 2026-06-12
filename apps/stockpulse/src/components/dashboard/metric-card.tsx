import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export function MetricCard({ title, value, description, icon: Icon, trend, trendValue }: MetricCardProps) {
  return (
    <Card className="bg-[#0b0e14] border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-300 relative">
      {/* GLOW EFFECT */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">{title}</p>
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-primary/20 transition-all">
            <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-black text-white tracking-tight leading-none">{value}</div>
          
          <div className="flex items-center gap-1.5 pt-1">
            {trendValue && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                trend === "up" ? "bg-emerald-500/10 text-emerald-500" : 
                trend === "down" ? "bg-rose-500/10 text-rose-500" : 
                "bg-white/5 text-muted-foreground"
              }`}>
                {trend === "up" ? "+" : ""}{trendValue}
              </span>
            )}
            {description && (
              <p className="text-[10px] text-muted-foreground font-medium truncate opacity-60">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
