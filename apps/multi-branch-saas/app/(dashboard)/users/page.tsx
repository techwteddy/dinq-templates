import { getUsersAction } from '@/features/users/actions'
import { UserTable } from '@/features/users/components/user-table'

export const metadata = {
  title: 'Users',
  description: 'Manage users and their permissions',
}

export default async function UsersPage() {
  const initialData = await getUsersAction({ page: 1, limit: 10 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      <UserTable initialData={initialData || undefined} />
    </div>
  )
}
