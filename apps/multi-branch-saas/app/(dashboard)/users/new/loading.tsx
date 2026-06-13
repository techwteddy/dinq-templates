import { FormSkeleton } from '@/components/shared/form-skeleton'

export default function NewUserLoading() {
  return (
    <div className="space-y-6">
      <FormSkeleton fields={8} title />
    </div>
  )
}
