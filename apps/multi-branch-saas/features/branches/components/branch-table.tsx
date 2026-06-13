'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBranchesAction } from '../actions'
import { BranchType } from '@/lib/generated/prisma'
import type { BranchListItem } from '../types'
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

type BranchTableProps = {
  initialData?: BranchListItem[]
  canCreate?: boolean
}

export function BranchTable({ initialData, canCreate = false }: BranchTableProps) {
  const [data, setData] = useState<BranchListItem[]>(initialData || [])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<BranchType | ''>('')
  const [activeFilter, setActiveFilter] = useState<string>('')

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true)
      try {
        const result = await getBranchesAction({
          search: search || undefined,
          type: typeFilter || undefined,
          isActive:
            activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined,
        })
        setData(result)
      } catch (error) {
        console.error('Error fetching branches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [search, typeFilter, activeFilter])

  const getBranchTypeColor = (type: BranchType) => {
    switch (type) {
      case BranchType.HEADQUARTERS:
        return 'bg-purple-100 text-purple-800'
      case BranchType.BRANCH:
        return 'bg-blue-100 text-blue-800'
      case BranchType.SUB_BRANCH:
        return 'bg-cyan-100 text-cyan-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBranchTypeName = (type: BranchType) => {
    switch (type) {
      case BranchType.HEADQUARTERS:
        return 'HQ'
      case BranchType.BRANCH:
        return 'Branch'
      case BranchType.SUB_BRANCH:
        return 'Sub-Branch'
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border-input bg-background ring-offset-background flex h-10 rounded-md border px-3 py-2 text-sm"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as BranchType | '')}
        >
          <option value="">All Types</option>
          <option value={BranchType.HEADQUARTERS}>Headquarters</option>
          <option value={BranchType.BRANCH}>Branch</option>
          <option value={BranchType.SUB_BRANCH}>Sub-Branch</option>
        </select>
        <select
          className="border-input bg-background ring-offset-background flex h-10 rounded-md border px-3 py-2 text-sm"
          value={activeFilter}
          onChange={e => setActiveFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {canCreate && (
          <Button asChild>
            <Link href="/branches/new">Add Branch</Link>
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No branches found
                </TableCell>
              </TableRow>
            ) : (
              data.map(branch => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.code}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>
                    <Badge className={getBranchTypeColor(branch.type)}>
                      {getBranchTypeName(branch.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{branch.address || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{branch._count?.profiles || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{branch._count?.children || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    {branch.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/branches/${branch.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
