"use client"

import * as React from "react"

interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  strokeWidth?: number
}

export function Sparkline({ 
  data, 
  color = "#3b82f6", 
  width = 80, 
  height = 30, 
  strokeWidth = 2 
}: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = range === 0 ? height / 2 : height - ((val - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="transition-all duration-500"
      />
    </svg>
  )
}
