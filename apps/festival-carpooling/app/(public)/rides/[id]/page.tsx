import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Co2Badge } from '@/components/rides/Co2Badge'
import { getRideById } from '@/lib/queries/rides'
import { createClient } from '@/lib/supabase/server'
import { formatDepartureDate } from '@/lib/utils/dates'
import { formatSeats } from '@/lib/utils/formatting'
import { getContactLink, getContactLabel, type ContactPreference } from '@/lib/utils/contact'
import { RequestSection } from './RequestSection'

export const revalidate = 30

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ posted?: string; email?: string }>
}

export default async function RideDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { posted, email } = await searchParams
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const ride = await getRideById(id)
  if (!ride || ride.status === 'cancelled') notFound()

  const available = ride.total_seats - ride.seats_taken
  const acceptedPassengers = ride.ride_requests.filter((r) => r.status === 'accepted')

  // Driver check: only for legacy auth-based rides
  const isDriver = session ? session.user.id === ride.driver_id : false

  const myRequest = session
    ? ride.ride_requests.find((r) => r.passenger_id === session.user.id) ?? null
    : null

  const driverName = ride.driver_name ?? ride.driver?.display_name ?? '?'
  const r = ride as unknown as { type?: string; driver_phone?: string; contact_preference?: string }
  const isSeek = r.type === 'seek'
  const driverPhone = r.driver_phone ?? null
  const contactPref = (r.contact_preference ?? 'whatsapp') as ContactPreference

  return (
    <PageShell>
      {/* Posted confirmation banner */}
      {posted === 'true' && email && (
        <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-4">
          <p className="font-semibold text-emerald-800">{isSeek ? 'Ricerca pubblicata!' : 'Passaggio pubblicato!'}</p>
          <p className="mt-1 text-sm text-emerald-700">
            Un link per gestirlo è stato inviato a <strong>{decodeURIComponent(email)}</strong>.
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Non lo trovi? Controlla <strong>Spam</strong> o <strong>Promozioni</strong>.
          </p>
        </div>
      )}

      {/* Route header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          {isSeek && <Badge variant="outline">Cerca passaggio</Badge>}
          {ride.return_trip && <Badge variant="outline">Viaggio di ritorno</Badge>}
          {!isSeek && (
            <Badge variant={available > 0 ? 'default' : 'muted'}>
              {formatSeats(ride.seats_taken, ride.total_seats)}
            </Badge>
          )}
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink mt-2">
          {ride.origin_city}
          <span className="mx-2 text-terra">→</span>
          {ride.destination}
        </h1>
        <p className="mt-1 text-ink-muted">{formatDepartureDate(ride.departure_at)}</p>
      </div>

      {/* Driver / Seeker card */}
      <div className="mb-4 bg-card rounded-card border border-border p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
          {isSeek ? 'Chi cerca' : 'Alla guida'}
        </p>
        <div className="flex items-center gap-3">
          <Avatar src={ride.driver?.avatar_url} name={driverName} size="lg" />
          <div>
            <p className="font-serif font-bold text-ink">{driverName}</p>
            {driverPhone && (
              <a
                href={getContactLink(driverPhone, contactPref)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-forest font-semibold mt-0.5 inline-block"
              >
                {getContactLabel(contactPref)} →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mb-4 bg-card rounded-card border border-border p-5 shadow-card space-y-3">
        {isSeek ? (
          <DetailRow label="Persone" value={`${ride.total_seats}`} />
        ) : (
          <DetailRow label="Posti" value={`${available} su ${ride.total_seats} liberi`} />
        )}
        {ride.stops && <DetailRow label="Soste" value={ride.stops} />}
        {ride.meeting_point && <DetailRow label="Punto di ritrovo" value={ride.meeting_point} />}
        {!isSeek && ride.fuel_contribution_eur != null && ride.fuel_contribution_eur > 0 && (
          <DetailRow label="Contributo carburante" value={`~€${ride.fuel_contribution_eur}`} />
        )}
        {ride.notes && <DetailRow label="Note" value={ride.notes} />}
      </div>

      {/* CO₂ — only for offers */}
      {!isSeek && ride.estimated_co2_saved_kg > 0 && (
        <div className="mb-4">
          <Co2Badge kg={ride.estimated_co2_saved_kg} variant="full" />
        </div>
      )}

      {/* Request section — only for offers */}
      {!isSeek && (
        <RequestSection
          ride={ride}
          isDriver={isDriver}
          myRequest={myRequest}
          session={session}
          acceptedPassengers={acceptedPassengers}
        />
      )}

      <div className="mt-4 flex items-center justify-between">
        <Link href="/rides" className="text-sm text-stone-400 hover:text-stone-600">
          ← Torna ai passaggi
        </Link>
      </div>
    </PageShell>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-stone-400 shrink-0">{label}</span>
      <span className="text-stone-700 text-right">{value}</span>
    </div>
  )
}
