import Link from 'next/link'
import { BranchForm } from '@/features/branches/components/branch-form'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'New Branch',
  description: 'Create a new branch',
}

export default function NewBranchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Branch</h1>
          <p className="text-muted-foreground">Add a new branch to the organization</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/branches">Back to Branches</Link>
        </Button>
      </div>

      {/* Form */}
      <BranchForm />
    </div>
  )
}
