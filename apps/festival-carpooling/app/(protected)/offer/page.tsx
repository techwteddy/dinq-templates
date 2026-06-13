import { PageShell } from '@/components/layout/PageShell'
import { RideForm } from '@/components/rides/RideForm'
import { createRideAction } from './actions'
import { getActiveFestival } from '@/lib/queries/festivals'

export const metadata = { title: 'Offri un passaggio' }

export default async function OfferPage() {
  const festival = await getActiveFestival()

  // Allow ±2 days around the festival dates
  const pad = 2 * 24 * 60 * 60 * 1000
  const minDate = festival.starts_at
    ? new Date(new Date(festival.starts_at).getTime() - pad).toISOString().slice(0, 16)
    : undefined
  const maxDate = festival.ends_at
    ? new Date(new Date(festival.ends_at).getTime() + pad).toISOString().slice(0, 16)
    : undefined

  return (
    <PageShell
      title="Offri un passaggio"
      description="Pubblica il tuo viaggio e permetti alle persone di richiedere un posto."
    >
      <RideForm
        action={createRideAction}
        festivalName={festival.name}
        minDate={minDate}
        maxDate={maxDate}
      />
    </PageShell>
  )
}
