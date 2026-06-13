'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Co2Badge } from './Co2Badge'
import { formatDepartureDate, formatRelativeDate } from '@/lib/utils/dates'
import { formatSeats } from '@/lib/utils/formatting'
import { getContactLink, getContactLabel, type ContactPreference } from '@/lib/utils/contact'
import type { RideWithDriver } from '@/lib/types/database.types'

interface RideCardProps {
  ride: RideWithDriver
  index?: number
}

export function RideCard({ ride, index = 0 }: RideCardProps) {
  const available = ride.total_seats - ride.seats_taken
  const r = ride as unknown as { type?: string; driver_name?: string; driver_phone?: string; contact_preference?: string }
  const isSeek = r.type === 'seek'
  const driverName = r.driver_name ?? ride.driver?.display_name ?? '?'
  const driverPhone = r.driver_phone ?? null
  const contactPref = (r.contact_preference ?? 'whatsapp') as ContactPreference

  return (
    <div
      className="ride-card-wrap animate-fade-up"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="bg-card rounded-card border border-border shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.98] overflow-hidden">
        {/* Clickable area → ride detail */}
        <Link href={`/rides/${ride.id}`} className="block p-5">
          {/* Name + date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Avatar src={ride.driver?.avatar_url} name={driverName} size="sm" />
              <span className="text-sm font-medium text-ink-muted">{driverName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-subtle">{formatRelativeDate(ride.departure_at)}</span>
              {isSeek
                ? <span className="text-xs font-semibold text-terra bg-terra-light px-2 py-0.5 rounded-full">Cerca</span>
                : <span className="text-xs font-semibold text-forest bg-forest-light px-2 py-0.5 rounded-full">Offre</span>
              }
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-serif text-xl font-bold text-ink leading-tight">{ride.origin_city}</span>
            <svg className="h-4 w-4 shrink-0 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span className="font-serif text-xl font-bold text-ink leading-tight">{ride.destination}</span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            {isSeek ? (
              <Badge variant="outline">
                {ride.total_seats === 1 ? '1 persona' : `${ride.total_seats} persone`}
              </Badge>
            ) : (
              <Badge variant={available > 0 ? 'default' : 'muted'}>
                {formatSeats(ride.seats_taken, ride.total_seats)}
              </Badge>
            )}
            <span className="text-xs text-ink-subtle">{formatDepartureDate(ride.departure_at)}</span>
            {ride.return_trip && <Badge variant="outline">ritorno</Badge>}
            {!isSeek && ride.fuel_contribution_eur != null && ride.fuel_contribution_eur > 0 && (
              <span className="text-xs text-ink-subtle">~€{ride.fuel_contribution_eur}</span>
            )}
          </div>

          {/* CO₂ — only for offers */}
          {!isSeek && ride.estimated_co2_saved_kg > 0 && (
            <div className="mt-3">
              <Co2Badge kg={ride.estimated_co2_saved_kg} variant="compact" />
            </div>
          )}
        </Link>

        {/* Contact button — outside the Link to avoid nested <a> */}
        {driverPhone && (
          <a
            href={getContactLink(driverPhone, contactPref)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border-t border-border py-3 text-sm font-semibold text-forest hover:bg-forest-light transition-colors"
          >
            {getContactLabel(contactPref)} →
          </a>
        )}
      </div>
    </div>
  )
}
