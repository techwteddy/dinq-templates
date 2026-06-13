import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageShell } from '@/components/layout/PageShell'
import { RideCard } from '@/components/rides/RideCard'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { getMyRides } from '@/lib/queries/rides'
import { getMyRequests, getProfile } from '@/lib/queries/profiles'
import { formatDepartureDate } from '@/lib/utils/dates'
import { SignOutButton } from './SignOutButton'
import { cancelRideAction } from './actions'
import type { RideWithDriver, MyRequest } from '@/lib/types/database.types'

export const metadata = { title: 'Il mio profilo' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const [profile, myRides, myRequests] = await Promise.all([
    getProfile(session.user.id),
    getMyRides(session.user.id),
    getMyRequests(session.user.id),
  ])

  if (!profile) redirect('/onboarding')

  const activeRides = myRides.filter((r) => r.status !== 'cancelled')
  const cancelledRides = myRides.filter((r) => r.status === 'cancelled')

  const statusVariants = {
    pending: 'warning',
    accepted: 'success',
    declined: 'muted',
    cancelled: 'muted',
  } as const

  return (
    <PageShell>
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar src={profile.avatar_url} name={profile.display_name} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-stone-900 truncate">{profile.display_name}</h1>
          <p className="text-sm text-stone-400">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      {/* My rides as driver */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          I miei passaggi ({activeRides.length})
        </h2>
        {activeRides.length === 0 ? (
          <p className="text-sm text-stone-400 py-4">Non hai ancora pubblicato nessun passaggio.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeRides.map((ride) => (
              <div key={ride.id} className="relative">
                <RideCard ride={ride as RideWithDriver} />
                {ride.status === 'active' && (
                  <form action={cancelRideAction} className="absolute top-4 right-4">
                    <input type="hidden" name="ride_id" value={ride.id} />
                    <button
                      type="submit"
                      className="text-xs text-stone-400 hover:text-red-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}

        {cancelledRides.length > 0 && (
          <details className="mt-3">
            <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-600">
              {cancelledRides.length} passaggio{cancelledRides.length !== 1 ? 'i' : ''} annullato{cancelledRides.length !== 1 ? '' : ''}
            </summary>
            <div className="mt-2 flex flex-col gap-2 opacity-50">
              {cancelledRides.map((ride) => (
                <RideCard key={ride.id} ride={ride as RideWithDriver} />
              ))}
            </div>
          </details>
        )}
      </section>

      {/* My requests as passenger */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Le mie richieste ({myRequests.length})
        </h2>
        {myRequests.length === 0 ? (
          <p className="text-sm text-stone-400 py-4">Non hai ancora richiesto nessun passaggio.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {(myRequests as MyRequest[]).map((req) => {
              const ride = req.ride
              if (!ride) return null

              return (
                <div key={req.id} className="bg-card rounded-card border border-border p-4 shadow-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-ink">
                      {ride.origin_city} → {ride.destination}
                    </span>
                    <Badge variant={statusVariants[req.status as keyof typeof statusVariants]}>
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-ink-subtle">{formatDepartureDate(ride.departure_at)}</p>
                  {ride.driver && (
                    <p className="mt-1 text-xs text-stone-400">
                      con {ride.driver.display_name}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </PageShell>
  )
}
