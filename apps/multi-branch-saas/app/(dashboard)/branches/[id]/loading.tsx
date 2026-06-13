import { FormSkeleton } from '@/components/shared/form-skeleton'

export default function EditBranchLoading() {
  return (
    <div className="space-y-6">
      <FormSkeleton fields={5} title />
    </div>
  )
}
