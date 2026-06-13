import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/service'
import { formatDepartureDate } from '@/lib/utils/dates'
import { type ContactPreference } from '@/lib/utils/contact'
import { cancelRideFromTokenAction } from './actions'
import { ManageRequestsSection } from './ManageRequestsSection'
import { ManageEditForm } from './ManageEditForm'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function ManagePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { token } = await searchParams

  if (!token) {
    return (
      <PageShell title="Link non valido">
        <p className="text-sm text-ink-muted">
          Questo link non è valido. Controlla l&apos;email con il link di gestione del passaggio.
        </p>
        <Link href="/rides" className="mt-4 block text-sm text-stone-400 hover:text-stone-600">
          ← Torna ai passaggi
        </Link>
      </PageShell>
    )
  }

  const supabase = createServiceClient()

  const { data: ride } = await supabase
    .from('rides')
    .select(`
      *,
      ride_requests(
        id, status, seats_requested, message,
        passenger_name, passenger_contact, created_at
      )
    `)
    .eq('id', id)
    .eq('management_token', token)
    .is('deleted_at', null)
    .single()

  if (!ride) {
    return (
      <PageShell title="Link non valido">
        <p className="text-sm text-ink-muted">
          Questo link non è valido o il passaggio è stato eliminato.
        </p>
        <Link href="/rides" className="mt-4 block text-sm text-stone-400 hover:text-stone-600">
          ← Torna ai passaggi
        </Link>
      </PageShell>
    )
  }

  if (ride.status === 'cancelled') notFound()

  const available = ride.total_seats - ride.seats_taken
  const pending = ride.ride_requests.filter((r: { status: string }) => r.status === 'pending')
  const accepted = ride.ride_requests.filter((r: { status: string }) => r.status === 'accepted')

  const departureDatetimeLocal = ride.departure_at
    ? new Date(ride.departure_at).toISOString().slice(0, 16)
    : ''

  return (
    <PageShell title="Gestisci il passaggio">
      {/* Route summary */}
      <div className="mb-6 bg-card rounded-card border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={available > 0 ? 'default' : 'muted'}>
            {available > 0 ? `${available} posti liberi` : 'Al completo'}
          </Badge>
          {ride.return_trip && <Badge variant="outline">Ritorno</Badge>}
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          {ride.origin_city}
          <span className="mx-2 text-terra">→</span>
          {ride.destination}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">{formatDepartureDate(ride.departure_at)}</p>
        <Link
          href={`/rides/${id}`}
          className="mt-3 inline-block text-xs text-stone-400 hover:text-stone-600"
        >
          Vedi il passaggio pubblico →
        </Link>
      </div>

      {/* Pending and accepted requests */}
      <ManageRequestsSection
        rideId={id}
        managementToken={token}
        pending={pending}
        accepted={accepted}
      />

      {/* Edit form */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Modifica dettagli
        </h2>
        <ManageEditForm
          rideId={id}
          managementToken={token}
          rideType={(ride.type as 'offer' | 'seek') ?? 'offer'}
          departureDatetimeLocal={departureDatetimeLocal}
          meetingPoint={ride.meeting_point ?? ''}
          notes={ride.notes ?? ''}
          fuelContributionEur={ride.fuel_contribution_eur}
          totalSeats={ride.total_seats}
          seatsTaken={ride.seats_taken}
          driverName={(ride as unknown as { driver_name?: string }).driver_name ?? ''}
          driverPhone={(ride as unknown as { driver_phone?: string }).driver_phone ?? ''}
          contactPreference={((ride as unknown as { contact_preference?: string }).contact_preference ?? 'whatsapp') as ContactPreference}
        />
      </section>

      {/* Cancel ride */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Annulla passaggio
        </h2>
        <div className="bg-card rounded-card border border-border p-5 shadow-card">
          <p className="text-sm text-ink-muted mb-4">
            Annullando il passaggio, verrà rimosso dalla lista. Questa azione non è reversibile.
          </p>
          <form action={cancelRideFromTokenAction}>
            <input type="hidden" name="ride_id" value={id} />
            <input type="hidden" name="management_token" value={token} />
            <Button type="submit" variant="danger" size="sm">
              Annulla il passaggio
            </Button>
          </form>
        </div>
      </section>

      <Link href="/rides" className="text-sm text-stone-400 hover:text-stone-600">
        ← Torna ai passaggi
      </Link>
    </PageShell>
  )
}
