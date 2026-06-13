import { RideCard } from './RideCard'
import { CarIcon } from '@/components/ui/icons'
import type { RideWithDriver } from '@/lib/types/database.types'

interface RideListProps {
  rides: RideWithDriver[]
  emptyMessage?: string
}

export function RideList({ rides, emptyMessage = 'Nessun passaggio trovato.' }: RideListProps) {
  if (rides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CarIcon className="w-10 h-10 mb-3 text-stone-300" />
        <p className="text-stone-500">{emptyMessage}</p>
        <p className="mt-1 text-sm text-stone-400">
          Sii la prima persona a offrire un passaggio.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {rides.map((ride, i) => (
        <RideCard key={ride.id} ride={ride} index={i} />
      ))}
    </div>
  )
}
