"use client"

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useMemo } from "react"

interface HistoryChartProps {
  data: {
    price: number
    change1d: number
    change30d: number
  }
  variant?: "sparkline" | "detailed"
}

export function HistoryChart({ data, variant = "sparkline" }: HistoryChartProps) {
  // Generate mock historical data points based on 30D and 1D returns
  const chartData = useMemo(() => {
    const points = 30
    const currentPrice = data.price
    const totalChange30d = data.change30d / 100
    const startPrice = currentPrice / (1 + totalChange30d)
    
    const result = []
    for (let i = 0; i <= points; i++) {
        // Linear interpolation with a bit of "noise" for realism
        const progress = i / points
        const basePrice = startPrice + (currentPrice - startPrice) * progress
        const noise = (Math.random() - 0.5) * (currentPrice * 0.01)
        
        result.push({
            date: `Day ${i}`,
            price: basePrice + noise
        })
    }
    return result
  }, [data])

  const isPositive = data.change1d >= 0
  const sparklineStroke = isPositive ? "#10b981" : "#ef4444"

  if (variant === "sparkline") {
    return (
      <div className="h-14 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis hide domain={['auto', 'auto']} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={sparklineStroke}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs font-mono">
                            ₹{Number(payload[0].value).toFixed(2)}
                        </div>
                    )
                }
                return null
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={sparklineStroke}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
