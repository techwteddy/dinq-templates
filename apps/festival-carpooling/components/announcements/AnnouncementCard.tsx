import { formatDepartureDate } from '@/lib/utils/dates'
import type { Announcement } from '@/lib/types/database.types'
import { PinIcon } from '@/components/ui/icons'

interface AnnouncementCardProps {
  announcement: Announcement
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <article className="bg-card rounded-card border border-border p-5 shadow-card">
      {announcement.pinned && (
        <span className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-terra">
          <PinIcon className="w-3.5 h-3.5" /> In evidenza
        </span>
      )}
      <h3 className="font-serif text-base font-bold text-ink leading-snug">
        {announcement.title}
      </h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed whitespace-pre-line">
        {announcement.body}
      </p>
      <p className="mt-3 text-xs text-ink-subtle">
        {formatDepartureDate(announcement.created_at)}
      </p>
    </article>
  )
}
