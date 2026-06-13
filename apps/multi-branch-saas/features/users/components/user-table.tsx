'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getUsersAction } from '../actions'
import { UserStatus, RoleType } from '@/lib/generated/prisma'
import type { PaginatedUsers } from '../types'
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
import { useRealtimeUsers } from '@/lib/hooks'

type UserTableProps = {
  initialData?: PaginatedUsers
}

export function UserTable({ initialData }: UserTableProps) {
  const [data, setData] = useState<PaginatedUsers | null>(initialData || null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('')
  const [page, setPage] = useState(1)

  // Fetch users function
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getUsersAction({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      })
      setData(result)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, page])

  // Setup real-time subscription
  useRealtimeUsers(fetchUsers)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case UserStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800'
      case UserStatus.SUSPENDED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border-input bg-background ring-offset-background flex h-10 rounded-md border px-3 py-2 text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as UserStatus | '')}
        >
          <option value="">All Status</option>
          <option value={UserStatus.ACTIVE}>Active</option>
          <option value={UserStatus.INACTIVE}>Inactive</option>
          <option value={UserStatus.SUSPENDED}>Suspended</option>
        </select>
        <Button asChild>
          <Link href="/users/new">Add User</Link>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !data || data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data.data.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.profile?.fullName || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.profile?.branch.name || '-'}
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({user.profile?.branch.code})
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.profile?.userRoles.map(ur => (
                        <Badge key={ur.role.id} variant="outline">
                          {ur.role.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.profile && (
                      <Badge className={getStatusColor(user.profile.status)}>
                        {user.profile.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/users/${user.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
