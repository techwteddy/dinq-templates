import { PageShell } from '@/components/layout/PageShell'
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard'
import { getAnnouncements } from '@/lib/queries/announcements'

export const revalidate = 60
export const metadata = { title: 'Announcements' }

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <PageShell title="Annunci" description="Aggiornamenti dall'organizzazione.">
      {announcements.length === 0 ? (
        <p className="text-center py-16 text-stone-400">Ancora nessun annuncio.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
