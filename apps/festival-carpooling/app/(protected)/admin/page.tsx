import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { PageShell } from '@/components/layout/PageShell'
import { getAnnouncements } from '@/lib/queries/announcements'
import { AnnouncementForm } from './AnnouncementForm'
import { deleteRideAction, resolveReportAction, deleteAnnouncementAction } from './actions'
import { Button } from '@/components/ui/Button'
import { PinIcon } from '@/components/ui/icons'
import { formatDepartureDate } from '@/lib/utils/dates'

type ReportRow = {
  id: string
  reason: string
  resolved: boolean
  created_at: string
  ride: { id: string; origin_city: string; destination: string } | null
  reporter: { display_name: string } | null
}

type AdminRide = {
  id: string
  origin_city: string
  destination: string
  departure_at: string
  total_seats: number
  seats_taken: number
  status: string
  return_trip: boolean
  driver_name: string | null
  driver_email: string | null
  deleted_at: string | null
}

export const metadata = { title: 'Amministrazione' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profileData?.is_admin) redirect('/')

  const service = createServiceClient()

  const [announcements, reportsResult, ridesResult] = await Promise.all([
    getAnnouncements(),
    supabase
      .from('reports')
      .select('id, reason, resolved, created_at, ride:rides(id, origin_city, destination), reporter:profiles(display_name)')
      .eq('resolved', false)
      .order('created_at', { ascending: false }),
    service
      .from('rides')
      .select('id, origin_city, destination, departure_at, total_seats, seats_taken, status, return_trip, driver_name, driver_email, deleted_at')
      .order('departure_at', { ascending: false }),
  ])

  const openReports = (reportsResult.data ?? []) as unknown as ReportRow[]
  const allRides = (ridesResult.data ?? []) as AdminRide[]
  const activeRides = allRides.filter(r => !r.deleted_at && r.status !== 'cancelled')
  const cancelledRides = allRides.filter(r => r.deleted_at || r.status === 'cancelled')

  return (
    <PageShell title="Amministrazione" description="Pannello di controllo dello staff.">

      {/* Open reports */}
      {openReports.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Segnalazioni aperte ({openReports.length})</SectionTitle>
          <div className="flex flex-col gap-3">
            {openReports.map((report) => (
              <div key={report.id} className="bg-card rounded-card border border-terra/40 p-4 shadow-card">
                <p className="text-sm font-medium text-ink">{report.reason}</p>
                {report.ride && (
                  <p className="text-xs text-ink-subtle mt-1">
                    Passaggio: {report.ride.origin_city} → {report.ride.destination}
                  </p>
                )}
                {report.reporter && (
                  <p className="text-xs text-ink-subtle">Segnalato da: {report.reporter.display_name}</p>
                )}
                <div className="mt-3 flex gap-2">
                  {report.ride && (
                    <form action={deleteRideAction}>
                      <input type="hidden" name="ride_id" value={report.ride.id} />
                      <input type="hidden" name="report_id" value={report.id} />
                      <Button type="submit" variant="danger" size="sm">Rimuovi passaggio</Button>
                    </form>
                  )}
                  <form action={resolveReportAction}>
                    <input type="hidden" name="report_id" value={report.id} />
                    <Button type="submit" variant="secondary" size="sm">Ignora</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rides */}
      <section className="mb-8">
        <SectionTitle>Passaggi attivi ({activeRides.length})</SectionTitle>
        {activeRides.length === 0 ? (
          <p className="text-sm text-ink-subtle">Nessun passaggio.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeRides.map((ride) => (
              <div key={ride.id} className="bg-card rounded-card border border-border p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-ink">
                      {ride.origin_city} → {ride.destination}
                      {ride.return_trip && <span className="ml-2 text-xs font-sans font-normal text-ink-subtle">(ritorno)</span>}
                    </p>
                    <p className="text-xs text-ink-subtle mt-0.5">{formatDepartureDate(ride.departure_at)}</p>
                    <p className="text-xs text-ink-subtle">
                      {ride.driver_name ?? '—'} · {ride.driver_email ?? '—'}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {ride.seats_taken}/{ride.total_seats} posti occupati
                    </p>
                  </div>
                  <form action={deleteRideAction} className="shrink-0">
                    <input type="hidden" name="ride_id" value={ride.id} />
                    <Button type="submit" variant="danger" size="sm">Elimina</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {cancelledRides.length > 0 && (
          <details className="mt-3">
            <summary className="text-xs font-medium text-ink-subtle cursor-pointer select-none">
              Passaggi cancellati/eliminati ({cancelledRides.length})
            </summary>
            <div className="flex flex-col gap-2 mt-2">
              {cancelledRides.map((ride) => (
                <div key={ride.id} className="bg-card rounded-card border border-border p-4 opacity-60">
                  <p className="font-serif font-bold text-ink text-sm">
                    {ride.origin_city} → {ride.destination}
                  </p>
                  <p className="text-xs text-ink-subtle">{ride.driver_name ?? '—'} · {ride.driver_email ?? '—'}</p>
                  <p className="text-xs text-ink-subtle">{formatDepartureDate(ride.departure_at)}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </section>

      {/* Announcements */}
      <section className="mb-8">
        <SectionTitle>Pubblica annuncio</SectionTitle>
        <AnnouncementForm />
      </section>

      <section>
        <SectionTitle>Annunci ({announcements.length})</SectionTitle>
        {announcements.length === 0 ? (
          <p className="text-sm text-ink-subtle">Nessun annuncio.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {announcements.map((a) => (
              <div key={a.id} className="bg-card rounded-card border border-border p-4 shadow-card">
                {a.pinned && (
                  <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-terra">
                    <PinIcon className="w-3.5 h-3.5" /> In evidenza
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-ink leading-snug">{a.title}</p>
                    <p className="mt-1 text-sm text-ink-muted line-clamp-2">{a.body}</p>
                    <p className="mt-1 text-xs text-ink-subtle">{formatDepartureDate(a.created_at)}</p>
                  </div>
                  <form action={deleteAnnouncementAction} className="shrink-0">
                    <input type="hidden" name="announcement_id" value={a.id} />
                    <Button type="submit" variant="danger" size="sm">Elimina</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </PageShell>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
      {children}
    </h2>
  )
}
