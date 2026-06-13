import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBranchByIdAction } from '@/features/branches/actions'
import { BranchForm } from '@/features/branches/components/branch-form'
import { DeleteBranchButton } from '@/features/branches/components/delete-branch-button'
import { getCurrentUser } from '@/features/auth/utils'
import { canAccessBranch } from '@/lib/rbac'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BranchType, RoleType } from '@/lib/generated/prisma'

export const metadata = {
  title: 'Branch Details',
  description: 'View and edit branch details',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { id } = await params
  const [branch, currentUser] = await Promise.all([getBranchByIdAction(id), getCurrentUser()])

  if (!branch) {
    notFound()
  }

  // Check if current user can delete this branch
  let canDelete = false

  if (currentUser) {
    // 1. Must have one of the allowed roles
    const allowedRoles = [RoleType.SUPER_ADMIN, RoleType.REGIONAL_MANAGER, RoleType.BRANCH_MANAGER]
    const hasAllowedRole = currentUser.profile.userRoles.some(ur =>
      (allowedRoles as string[]).includes(ur.role.type)
    )

    if (hasAllowedRole) {
      // 2. Cannot delete own branch
      const isOwnBranch = currentUser.profile.branchId === branch.id

      if (!isOwnBranch) {
        // 3. Check if branch is accessible
        const hasAccess = await canAccessBranch(branch.id)

        if (hasAccess) {
          // 4. Cannot delete if branch has children or users
          const hasChildren = branch.children.length > 0
          const hasUsers = branch.profiles.length > 0

          canDelete = !hasChildren && !hasUsers
        }
      }
    }
  }

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
        return 'Headquarters'
      case BranchType.BRANCH:
        return 'Branch'
      case BranchType.SUB_BRANCH:
        return 'Sub-Branch'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{branch.name}</h1>
            <Badge className={getBranchTypeColor(branch.type)}>
              {getBranchTypeName(branch.type)}
            </Badge>
          </div>
          <p className="text-muted-foreground">Code: {branch.code}</p>
        </div>
        <div className="flex gap-2">
          {canDelete && <DeleteBranchButton branchId={branch.id} branchName={branch.name} />}
          <Button asChild variant="outline">
            <Link href="/branches">Back to Branches</Link>
          </Button>
        </div>
      </div>

      {/* Branch Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Branch Code</p>
              <p className="text-base">{branch.code}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Branch Name</p>
              <p className="text-base">{branch.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Type</p>
              <Badge className={getBranchTypeColor(branch.type)}>
                {getBranchTypeName(branch.type)}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Status</p>
              {branch.isActive ? (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
              )}
            </div>
            {branch.parent && (
              <div>
                <p className="text-muted-foreground text-sm font-medium">Parent Branch</p>
                <Link
                  href={`/branches/${branch.parent.id}`}
                  className="text-primary text-base hover:underline"
                >
                  {branch.parent.name} ({branch.parent.code})
                </Link>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-sm font-medium">Address</p>
              <p className="text-base">{branch.address || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Phone</p>
              <p className="text-base">{branch.phone || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <p className="text-base">{branch.email || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Branches */}
      {branch.children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Child Branches ({branch.children.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {branch.children.map(child => (
                <Link
                  key={child.id}
                  href={`/branches/${child.id}`}
                  className="hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-muted-foreground text-sm">{child.code}</p>
                  </div>
                  <Badge className={getBranchTypeColor(child.type)}>
                    {getBranchTypeName(child.type)}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users */}
      {branch.profiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Users ({branch.profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {branch.profiles.map(profile => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="font-medium">{profile.fullName}</p>
                  <Badge variant="outline">{profile.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <BranchForm branch={branch} />
    </div>
  )
}
