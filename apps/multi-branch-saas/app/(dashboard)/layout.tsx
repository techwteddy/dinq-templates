import Link from 'next/link'
import { getCurrentUser } from '@/features/auth/utils'
import { logout } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { RoleType } from '@/lib/generated/prisma'
import { ModeToggle } from '@/components/mode-toggle'
import { NotificationBell } from '@/features/notifications/components'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                RepairShop
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/users"
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  Users
                </Link>
                <Link
                  href="/branches"
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  Branches
                </Link>
                <Link
                  href="/audit-logs"
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  Audit Logs
                </Link>
                {user.profile.userRoles.some(ur => ur.role.type === RoleType.SUPER_ADMIN) && (
                  <Link
                    href="/admin/dev-tools"
                    className="hover:text-primary text-sm font-medium text-orange-600 transition-colors"
                  >
                    Dev Tools
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-medium">{user.profile.fullName}</p>
                <p className="text-muted-foreground text-xs">{user.profile.branch.name}</p>
              </div>
              <NotificationBell profileId={user.profile.id} />
              <ModeToggle />
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
