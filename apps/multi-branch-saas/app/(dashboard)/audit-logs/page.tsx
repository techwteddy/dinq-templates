import { getAuditLogs } from '@/features/audit/actions'
import { AuditLogTable } from '@/features/audit/components'

export const metadata = {
  title: 'Audit Logs',
  description: 'View system audit logs and user activity',
}

export default async function AuditLogsPage() {
  try {
    const initialData = await getAuditLogs({ page: 1, limit: 20 })

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>

        <AuditLogTable initialData={initialData || undefined} />
      </div>
    )
  } catch (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>

        <div className="rounded-lg border p-8 text-center">
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Unauthorized access'}
          </p>
        </div>
      </div>
    )
  }
}
