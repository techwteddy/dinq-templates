import { BranchType } from '@/lib/generated/prisma'

export type BranchListItem = {
  id: string
  name: string
  code: string
  type: BranchType
  parentId: string | null
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count?: {
    children: number
    profiles: number
  }
}

export type BranchDetail = {
  id: string
  name: string
  code: string
  type: BranchType
  parentId: string | null
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  parent: {
    id: string
    name: string
    code: string
    type: BranchType
  } | null
  children: {
    id: string
    name: string
    code: string
    type: BranchType
  }[]
  profiles: {
    id: string
    fullName: string
    status: string
  }[]
}

export type BranchHierarchyItem = {
  id: string
  name: string
  code: string
  type: BranchType
  parentId: string | null
  isActive: boolean
  children: BranchHierarchyItem[]
  _count?: {
    profiles: number
  }
}

export type CreateBranchInput = {
  name: string
  code: string
  type: BranchType
  parentId?: string
  address?: string
  phone?: string
  email?: string
  isActive?: boolean
}

export type UpdateBranchInput = {
  name?: string
  code?: string
  type?: BranchType
  parentId?: string | null
  address?: string
  phone?: string
  email?: string
  isActive?: boolean
}

export type BranchFilters = {
  search?: string
  type?: BranchType
  isActive?: boolean
  parentId?: string
}
