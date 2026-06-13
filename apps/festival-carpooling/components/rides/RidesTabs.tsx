'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CarIcon, SearchIcon } from '@/components/ui/icons'

export function RidesTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isSeek = searchParams.get('type') === 'seek'

  const switchTo = (type: 'offer' | 'seek') => {
    const params = new URLSearchParams()
    if (type === 'seek') params.set('type', 'seek')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-1 bg-stone-100 rounded-2xl p-1 mb-5">
      <button
        type="button"
        onClick={() => switchTo('offer')}
        className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${!isSeek ? 'bg-card text-ink shadow-sm' : 'text-ink-subtle hover:text-ink'}`}
      >
        <CarIcon className="w-3.5 h-3.5" /> Passaggi
      </button>
      <button
        type="button"
        onClick={() => switchTo('seek')}
        className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${isSeek ? 'bg-card text-ink shadow-sm' : 'text-ink-subtle hover:text-ink'}`}
      >
        <SearchIcon className="w-3.5 h-3.5" /> Chi cerca
      </button>
    </div>
  )
}
