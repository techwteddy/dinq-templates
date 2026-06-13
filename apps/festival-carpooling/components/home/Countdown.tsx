'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string  // ISO date string, time will be forced to 13:00 local
  festivalName?: string
}

function getTimeLeft(targetDate: string) {
  const target = new Date(targetDate)
  target.setHours(13, 0, 0, 0)
  const diff = target.getTime() - Date.now()

  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export function Countdown({ targetDate, festivalName }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (timeLeft === null) return null

  return (
    <div className="mb-8 rounded-card bg-card border border-border p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
        Manca poco{festivalName ? ` a ${festivalName}` : ''}
      </p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <Unit value={timeLeft.days} label="giorni" />
        <Unit value={timeLeft.hours} label="ore" />
        <Unit value={timeLeft.minutes} label="min" />
        <Unit value={timeLeft.seconds} label="sec" />
      </div>
    </div>
  )
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-serif text-3xl font-bold text-ink tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink-subtle">
        {label}
      </span>
    </div>
  )
}
