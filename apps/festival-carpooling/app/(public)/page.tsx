import { Suspense } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { RideList } from '@/components/rides/RideList'
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'
import { CommunityImpact } from '@/components/home/CommunityImpact'
import { Countdown } from '@/components/home/Countdown'
import { CarIcon } from '@/components/ui/icons'
import { getRides } from '@/lib/queries/rides'
import { getPinnedAnnouncements } from '@/lib/queries/announcements'
import { getActiveFestival } from '@/lib/queries/festivals'

export const revalidate = 60

export default async function HomePage() {
  const [rides, pinned, festival] = await Promise.all([
    getRides().catch(() => []),
    getPinnedAnnouncements().catch(() => []),
    getActiveFestival().catch(() => null),
  ])

  const upcoming = rides.slice(0, 5)

  return (
    <PageShell>
      {/* Hero */}
      <div className="mb-8">
        {/* Squiggle decoration */}
        <svg className="mb-4" width="44" height="22" viewBox="0 0 44 22" fill="none" aria-hidden>
          <path d="M2 11 C7 4, 15 18, 22 11 C29 4, 37 18, 42 11" stroke="#b85c38" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>

        <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-ink">
          Condividi<br />
          la strada<br />
          <em className="text-forest not-italic">per {festival?.name ?? 'il festival'}.</em>
        </h1>
        <p className="mt-3 text-ink-muted leading-relaxed max-w-xs">
          Workshop, musica, radio nella natura — inizia il viaggio insieme.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/rides"
            className="flex-1 rounded-full bg-ink px-4 py-3 text-center text-sm font-semibold text-card hover:bg-ink/85 transition-all duration-150 active:scale-[0.96]"
          >
            Trova un passaggio
          </Link>
          <Link
            href="/offer"
            className="flex-1 rounded-full border border-forest text-forest px-4 py-3 text-center text-sm font-semibold hover:bg-forest-light transition-all duration-150 active:scale-[0.96]"
          >
            Offri →
          </Link>
        </div>

      </div>

      {/* Countdown */}
      {festival?.starts_at && (
        <Countdown targetDate={festival.starts_at} festivalName={festival.name} />
      )}

      {/* Announcements */}
      {pinned.length > 0 && (
        <div className="mb-8">
          <AnnouncementBanner announcements={pinned} />
        </div>
      )}

      {/* Wave divider */}
      <WaveDivider />

      {/* Upcoming departures */}
      <section className="mt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base font-bold text-ink flex items-center gap-1.5">
            <CarIcon className="w-4 h-4" /> Prossimi passaggi
          </h2>
          <Link href="/rides" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
            Vedi tutti →
          </Link>
        </div>
        <RideList
          rides={upcoming}
          emptyMessage="Ancora nessun passaggio. Sii la prima persona a offrirne uno!"
        />
      </section>

      {/* Community stats */}
      <Suspense fallback={null}>
        <CommunityImpact />
      </Suspense>
    </PageShell>
  )
}

function WaveDivider() {
  return (
    <svg width="100%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none" fill="none" aria-hidden>
      <path
        d="M0 9 C50 2, 100 16, 150 9 C200 2, 250 16, 300 9 C350 2, 380 14, 400 9"
        stroke="#d4c4a0"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
