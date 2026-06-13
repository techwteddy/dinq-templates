import { AuditAction } from '@/lib/generated/prisma'

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalBranches: number
  totalRoles: number
}

export interface StatCard {
  title: string
  value: number
  description: string
  icon?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export interface RecentActivity {
  id: string
  action: AuditAction
  resource: string
  resourceId: string
  userName: string
  createdAt: Date
}
