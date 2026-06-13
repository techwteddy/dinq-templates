'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getBranchHierarchyAction } from '../actions'
import { BranchType } from '@/lib/generated/prisma'
import type { BranchHierarchyItem } from '../types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRealtimeBranches } from '@/lib/hooks'

type BranchHierarchyProps = {
  initialData?: BranchHierarchyItem[]
}

type BranchNodeProps = {
  branch: BranchHierarchyItem
  level: number
}

function BranchNode({ branch, level }: BranchNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels

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

  const hasChildren = branch.children && branch.children.length > 0

  return (
    <div className="space-y-2">
      <div
        className={`hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 transition-colors ${
          !branch.isActive ? 'opacity-60' : ''
        }`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-accent flex h-6 w-6 flex-shrink-0 items-center justify-center rounded"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        {/* Branch Info */}
        <div className="flex flex-1 items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{branch.name}</span>
              <span className="text-muted-foreground text-sm">({branch.code})</span>
              <Badge className={getBranchTypeColor(branch.type)}>
                {getBranchTypeName(branch.type)}
              </Badge>
              {!branch.isActive && (
                <Badge variant="outline" className="bg-gray-100">
                  Inactive
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {branch._count?.profiles || 0} users
              {hasChildren &&
                ` · ${branch.children.length} ${branch.children.length === 1 ? 'child' : 'children'}`}
            </div>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/branches/${branch.id}`}>View</Link>
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {branch.children.map(child => (
            <BranchNode key={child.id} branch={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function BranchHierarchy({ initialData }: BranchHierarchyProps) {
  const [data, setData] = useState<BranchHierarchyItem[]>(initialData || [])
  const [loading, setLoading] = useState(!initialData)

  // Fetch hierarchy function
  const fetchHierarchy = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getBranchHierarchyAction()
      setData(result)
    } catch (error) {
      console.error('Error fetching branch hierarchy:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Setup real-time subscription
  useRealtimeBranches(fetchHierarchy)

  useEffect(() => {
    if (!initialData) {
      fetchHierarchy()
    }
  }, [initialData, fetchHierarchy])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading hierarchy...</p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No branches found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Hierarchy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map(branch => (
          <BranchNode key={branch.id} branch={branch} level={0} />
        ))}
      </CardContent>
    </Card>
  )
}
