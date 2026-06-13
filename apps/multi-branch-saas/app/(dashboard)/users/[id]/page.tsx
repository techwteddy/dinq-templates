import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserByIdAction, getRolesAction } from '@/features/users/actions'
import { UserForm } from '@/features/users/components/user-form'
import { DeleteUserButton } from '@/features/users/components/delete-user-button'
import { getCurrentUser } from '@/features/auth/utils'
import { RoleType } from '@/lib/generated/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'User Details',
  description: 'View and edit user details',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params
  const [user, roles, currentUser] = await Promise.all([
    getUserByIdAction(id),
    getRolesAction(),
    getCurrentUser(),
  ])

  if (!user) {
    notFound()
  }

  // Check if current user can delete this user
  let canDelete = false

  if (currentUser) {
    // 1. Must have one of the allowed roles
    const allowedRoles = [RoleType.SUPER_ADMIN, RoleType.REGIONAL_MANAGER, RoleType.BRANCH_MANAGER]
    const hasAllowedRole = currentUser.profile.userRoles.some(ur =>
      (allowedRoles as string[]).includes(ur.role.type)
    )

    if (hasAllowedRole) {
      // 2. Cannot delete self
      const isSelf = currentUser.id === user.id

      if (!isSelf) {
        // 3. Check role hierarchy - can only delete users with lower role level
        const currentUserHighestRole = currentUser.profile.userRoles.reduce((prev, current) => {
          return prev.role.level < current.role.level ? prev : current
        })

        if (user.profile && user.profile.userRoles.length > 0) {
          const targetUserHighestRole = user.profile.userRoles.reduce((prev, current) => {
            return prev.role.level < current.role.level ? prev : current
          })

          // Can only delete if target user has lower role (higher level number)
          canDelete = targetUserHighestRole.role.level > currentUserHighestRole.role.level
        } else {
          // If user has no roles, can delete
          canDelete = true
        }
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{user.profile?.fullName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {canDelete && (
            <DeleteUserButton userId={user.id} userName={user.profile?.fullName || user.email} />
          )}
          <Button asChild variant="outline">
            <Link href="/users">Back to Users</Link>
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Full Name</p>
              <p className="text-base">{user.profile?.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Phone</p>
              <p className="text-base">{user.profile?.phone || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Status</p>
              {user.profile && (
                <Badge className={getStatusColor(user.profile.status)}>{user.profile.status}</Badge>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Branch</p>
              <p className="text-base">
                {user.profile?.branch.name}{' '}
                <span className="text-muted-foreground">({user.profile?.branch.code})</span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Roles</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {user.profile?.userRoles.map(ur => (
                  <Badge key={ur.role.id} variant="outline">
                    {ur.role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <UserForm user={user} roles={roles} />
    </div>
  )
}
