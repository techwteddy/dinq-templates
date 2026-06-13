import { Suspense } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { RideList } from '@/components/rides/RideList'
import { RideFilters } from '@/components/rides/RideFilters'
import { RidesTabs } from '@/components/rides/RidesTabs'
import { getRides } from '@/lib/queries/rides'
import type { RideFilters as Filters } from '@/lib/types/database.types'

export const revalidate = 30

interface PageProps {
  searchParams: Promise<{ origin?: string; return?: string; date?: string; type?: string }>
}

export default async function RidesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const type = params.type === 'seek' ? 'seek' : 'offer'
  const isSeek = type === 'seek'

  const filters: Filters = {
    origin: params.origin,
    returnTrip: params.return === 'true' ? true : params.return === 'false' ? false : undefined,
    date: params.date,
    type,
  }

  const rides = await getRides(filters).catch(() => [])

  return (
    <PageShell>
      <Suspense>
        <RidesTabs />
      </Suspense>

      {!isSeek && (
        <div className="mb-5">
          <Suspense>
            <RideFilters />
          </Suspense>
        </div>
      )}

      <RideList
        rides={rides}
        emptyMessage={
          isSeek
            ? 'Nessuno sta cercando un passaggio al momento.'
            : 'Nessun passaggio corrisponde ai filtri.'
        }
      />
    </PageShell>
  )
}
