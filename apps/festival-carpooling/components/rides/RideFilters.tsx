'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function RideFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const currentType = searchParams.get('type') ?? 'offer'
  const returnTrip = searchParams.get('return')
  const currentDate = searchParams.get('date') ?? ''

  return (
    <div className="flex flex-col gap-3">
      {/* City search */}
      <input
        type="text"
        placeholder="Cerca per città di partenza..."
        defaultValue={searchParams.get('origin') ?? ''}
        onChange={(e) => updateParam('origin', e.target.value.trim() || null)}
        className="w-full h-11 rounded-2xl border border-border bg-card px-4 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-forest"
      />

      {/* Direction toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => updateParam('return', null)}
          className={`flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.96] ${!returnTrip ? 'bg-ink text-card border-ink' : 'bg-card text-ink-subtle border-border'}`}
        >
          → Verso il festival
        </button>
        <button
          type="button"
          onClick={() => updateParam('return', 'true')}
          className={`flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.96] ${returnTrip === 'true' ? 'bg-ink text-card border-ink' : 'bg-card text-ink-subtle border-border'}`}
        >
          ← Ritorno
        </button>
      </div>

      {/* Date filter */}
      <div className="relative">
        <label className="block text-xs font-medium text-ink-subtle mb-1.5">
          Filtra per data
        </label>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => updateParam('date', e.target.value || null)}
          className="w-full h-11 rounded-2xl border border-border bg-card px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest appearance-none"
        />
        {currentDate && (
          <button
            type="button"
            onClick={() => updateParam('date', null)}
            className="absolute right-3 top-7 text-ink-subtle hover:text-ink text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
