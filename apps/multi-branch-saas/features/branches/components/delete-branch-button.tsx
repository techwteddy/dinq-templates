'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteBranchAction } from '../actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert } from '@/components/ui/alert'

type DeleteBranchButtonProps = {
  branchId: string
  branchName: string
}

export function DeleteBranchButton({ branchId, branchName }: DeleteBranchButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      const result = await deleteBranchAction(branchId)

      if (!result.success) {
        setError(result.error || 'Failed to delete branch')
      } else {
        setOpen(false)
        router.push('/branches')
        router.refresh()
      }
    })
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Branch
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the branch{' '}
              <span className="font-semibold">{branchName}</span> and remove it from the system.
              <br />
              <br />
              <span className="text-destructive font-semibold">
                Note: You cannot delete a branch that has child branches or users. Please reassign
                or delete them first.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Deleting...' : 'Delete Branch'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
