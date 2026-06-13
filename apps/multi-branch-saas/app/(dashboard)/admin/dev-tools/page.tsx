import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/utils'
import { RoleType } from '@/lib/generated/prisma'
import { DevToolsDashboard } from '@/features/admin/components/dev-tools-dashboard'

export const metadata = {
  title: 'Dev Tools - Admin',
  description: 'Developer tools for database management and testing',
}

export default async function DevToolsPage() {
  const user = await getCurrentUser()

  // Super Admin only
  if (!user || !user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN)) {
    redirect('/')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Developer Tools</h1>
        <p className="text-muted-foreground">
          Database management and testing utilities (Super Admin Only)
        </p>
      </div>

      <DevToolsDashboard />
    </div>
  )
}
