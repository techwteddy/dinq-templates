import Link from 'next/link'
import { getRolesAction } from '@/features/users/actions'
import { UserForm } from '@/features/users/components/user-form'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'New User',
  description: 'Create a new user',
}

export default async function NewUserPage() {
  const roles = await getRolesAction()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New User</h1>
          <p className="text-muted-foreground">Add a new user to the system</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/users">Back to Users</Link>
        </Button>
      </div>

      {/* Form */}
      <UserForm roles={roles} />
    </div>
  )
}
