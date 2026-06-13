import { AuditAction } from '@/lib/generated/prisma'

export interface AuditLogFilters {
  userId?: string
  resource?: string
  action?: AuditAction
  dateFrom?: Date
  dateTo?: Date
  search?: string
  page?: number
  limit?: number
}

export interface AuditLogItem {
  id: string
  userId: string
  user: {
    id: string
    email: string
    profile: {
      fullName: string
    } | null
  }
  action: AuditAction
  resource: string
  resourceId: string
  changes: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

export interface PaginatedAuditLogs {
  data: AuditLogItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}
