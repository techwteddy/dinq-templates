import Link from 'next/link'
import type { Announcement } from '@/lib/types/database.types'

interface AnnouncementBannerProps {
  announcements: Announcement[]
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  if (announcements.length === 0) return null

  const first = announcements[0]
  return (
    <Link
      href="/announcements"
      className="block rounded-card bg-terra p-5 text-card hover:bg-terra/90 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium mb-1 uppercase tracking-widest" style={{ color: 'rgba(250,246,239,0.7)' }}>
          {announcements.length > 1
            ? `${announcements.length} annunci`
            : 'Annuncio'}
        </p>
        <p className="font-serif text-sm font-bold leading-snug line-clamp-2">{first.title}</p>
        <p className="mt-1 text-xs line-clamp-1" style={{ color: 'rgba(250,246,239,0.7)' }}>{first.body}</p>
      </div>
    </Link>
  )
}
