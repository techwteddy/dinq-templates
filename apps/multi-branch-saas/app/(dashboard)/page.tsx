import { getCurrentUser } from '@/features/auth/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats, RecentActivity } from '@/features/dashboard'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.profile.fullName}</p>
      </div>

      {/* Quick Stats */}
      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-muted-foreground text-sm font-medium">Email</dt>
                <dd className="text-sm">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">Branch</dt>
                <dd className="text-sm">{user?.profile.branch.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">Role</dt>
                <dd className="text-sm">
                  {user?.profile.userRoles[0]?.role.name || 'No role assigned'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  )
}
