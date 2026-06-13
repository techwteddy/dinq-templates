import { Users, UserCheck, Building2, Shield } from 'lucide-react'
import { getDashboardStatsAction } from '../actions/dashboard.actions'
import { StatsCard } from './stats-card'

export async function DashboardStats() {
  const stats = await getDashboardStatsAction()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        description="All users in your scope"
        icon={Users}
        iconColor="text-blue-500"
      />
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        description="Currently active users"
        icon={UserCheck}
        iconColor="text-green-500"
      />
      <StatsCard
        title="Total Branches"
        value={stats.totalBranches}
        description="Accessible branches"
        icon={Building2}
        iconColor="text-purple-500"
      />
      <StatsCard
        title="Total Roles"
        value={stats.totalRoles}
        description="Configured system roles"
        icon={Shield}
        iconColor="text-orange-500"
      />
    </div>
  )
}
