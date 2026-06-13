'use client'

import { useState, useEffect } from 'react'
import { getAuditLogs } from '../actions'
import { AuditAction } from '@/lib/generated/prisma'
import type { PaginatedAuditLogs } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'

type AuditLogTableProps = {
  initialData?: PaginatedAuditLogs
}

export function AuditLogTable({ initialData }: AuditLogTableProps) {
  const [data, setData] = useState<PaginatedAuditLogs | null>(initialData || null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [resourceFilter, setResourceFilter] = useState<string>('')
  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const result = await getAuditLogs({
          search: search || undefined,
          resource: resourceFilter || undefined,
          action: actionFilter || undefined,
          page,
          limit: 20,
        })
        setData(result)
      } catch (error) {
        console.error('Error fetching audit logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [search, resourceFilter, actionFilter, page])

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case AuditAction.CREATE:
        return 'bg-green-100 text-green-800'
      case AuditAction.UPDATE:
        return 'bg-blue-100 text-blue-800'
      case AuditAction.DELETE:
        return 'bg-red-100 text-red-800'
      case AuditAction.LOGIN:
        return 'bg-purple-100 text-purple-800'
      case AuditAction.LOGOUT:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatChanges = (changes: any) => {
    if (!changes) return null

    try {
      const parsed = typeof changes === 'string' ? JSON.parse(changes) : changes
      return (
        <pre className="max-w-md overflow-x-auto text-xs">{JSON.stringify(parsed, null, 2)}</pre>
      )
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by user email, resource, or resource ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border-input bg-background ring-offset-background flex h-10 rounded-md border px-3 py-2 text-sm"
          value={resourceFilter}
          onChange={e => setResourceFilter(e.target.value)}
        >
          <option value="">All Resources</option>
          <option value="users">Users</option>
          <option value="branches">Branches</option>
          <option value="auth">Auth</option>
        </select>
        <select
          className="border-input bg-background ring-offset-background flex h-10 rounded-md border px-3 py-2 text-sm"
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value as AuditAction | '')}
        >
          <option value="">All Actions</option>
          <option value={AuditAction.CREATE}>Create</option>
          <option value={AuditAction.UPDATE}>Update</option>
          <option value={AuditAction.DELETE}>Delete</option>
          <option value={AuditAction.LOGIN}>Login</option>
          <option value={AuditAction.LOGOUT}>Logout</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Resource ID</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Changes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data && data.data.length > 0 ? (
              data.data.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.user.profile?.fullName || 'Unknown'}</div>
                      <div className="text-muted-foreground text-sm">{log.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{log.resource}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.resourceId.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm">{log.ipAddress || 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {log.changes && (
                      <details className="cursor-pointer">
                        <summary className="text-sm text-blue-600 hover:underline">
                          View changes
                        </summary>
                        <div className="mt-2">{formatChanges(log.changes)}</div>
                      </details>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No audit logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {(page - 1) * data.limit + 1} to {Math.min(page * data.limit, data.total)} of{' '}
            {data.total} logs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
