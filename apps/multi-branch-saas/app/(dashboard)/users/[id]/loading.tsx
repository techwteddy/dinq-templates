import { FormSkeleton } from '@/components/shared/form-skeleton'

export default function EditUserLoading() {
  return (
    <div className="space-y-6">
      <FormSkeleton fields={8} title />
    </div>
  )
}
