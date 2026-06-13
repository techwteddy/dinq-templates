import { UserStatus, RoleType } from '@/lib/generated/prisma'

export type UserListItem = {
  id: string
  email: string
  profile: {
    id: string
    fullName: string
    phone: string | null
    status: UserStatus
    branchId: string
    branch: {
      id: string
      name: string
      code: string
    }
    userRoles: {
      role: {
        id: string
        name: string
        type: RoleType
        level: number
      }
    }[]
  } | null
  createdAt: Date
  updatedAt: Date
}

export type UserDetail = {
  id: string
  email: string
  profile: {
    id: string
    fullName: string
    phone: string | null
    avatar: string | null
    status: UserStatus
    branchId: string
    branch: {
      id: string
      name: string
      code: string
      type: string
      address: string | null
      phone: string | null
    }
    userRoles: {
      id: string
      role: {
        id: string
        name: string
        type: RoleType
        level: number
        description: string | null
      }
    }[]
  } | null
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = {
  email: string
  password: string
  fullName: string
  phone?: string
  branchId: string
  roleIds: string[]
  status?: UserStatus
}

export type UpdateUserInput = {
  email?: string
  fullName?: string
  phone?: string
  branchId?: string
  roleIds?: string[]
  status?: UserStatus
  avatar?: string
}

export type UserFilters = {
  search?: string
  branchId?: string
  status?: UserStatus
  roleType?: RoleType
  page?: number
  limit?: number
}

export type PaginatedUsers = {
  data: UserListItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
