import { getBranchesAction, getBranchHierarchyAction } from '@/features/branches/actions'
import { BranchTable } from '@/features/branches/components/branch-table'
import { BranchHierarchy } from '@/features/branches/components/branch-hierarchy'
import { getCurrentUser } from '@/features/auth/utils'
import { RoleType } from '@/lib/generated/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Branches',
  description: 'Manage branch offices and hierarchy',
}

export default async function BranchesPage() {
  const [branches, hierarchy, currentUser] = await Promise.all([
    getBranchesAction({}),
    getBranchHierarchyAction(),
    getCurrentUser(),
  ])

  // Check if user can create branches
  let canCreate = false

  if (currentUser) {
    const allowedRoles = [RoleType.SUPER_ADMIN, RoleType.REGIONAL_MANAGER, RoleType.BRANCH_MANAGER]
    canCreate = currentUser.profile.userRoles.some(ur =>
      (allowedRoles as string[]).includes(ur.role.type)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branches</h1>
        <p className="text-muted-foreground">Manage branch offices and organizational hierarchy</p>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <BranchTable initialData={branches} canCreate={canCreate} />
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <BranchHierarchy initialData={hierarchy} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
