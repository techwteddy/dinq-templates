'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RoleType } from '@/lib/generated/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createRoleAction, updateRoleAction } from '../actions/role.actions'

const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  type: z.nativeEnum(RoleType, { message: 'Invalid role type' }),
  level: z.number().int().min(2, 'Level must be >= 2').max(6, 'Level must be <= 6'),
  description: z.string().max(200, 'Description too long').optional(),
})

const updateRoleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
})

type CreateRoleFormData = z.infer<typeof createRoleSchema>
type UpdateRoleFormData = z.infer<typeof updateRoleSchema>

type RoleFormProps = {
  role?: {
    id: string
    name: string
    type: string
    level: number
    description: string | null
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>('')

  const isEditMode = !!role
  const schema = isEditMode ? updateRoleSchema : createRoleSchema

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues: isEditMode
      ? {
          id: role.id,
          name: role.name,
          description: role.description || '',
        }
      : {
          name: '',
          type: '' as RoleType,
          level: 2,
          description: '',
        },
  })

  const selectedType = watch('type')
  const selectedLevel = watch('level')

  const onSubmit = async (data: any) => {
    setError('')

    startTransition(async () => {
      try {
        const result = isEditMode
          ? await updateRoleAction(data as UpdateRoleFormData)
          : await createRoleAction(data as CreateRoleFormData)

        if (result.success) {
          toast.success(result.message || 'Role saved successfully')
          onSuccess?.()
        } else {
          setError(result.error || 'Failed to save role')
          toast.error(result.error || 'Failed to save role')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        toast.error(message)
      }
    })
  }

  // Available role types (excluding SUPER_ADMIN)
  const availableTypes = [
    { value: RoleType.REGIONAL_MANAGER, label: 'Regional Manager', level: 2 },
    { value: RoleType.BRANCH_MANAGER, label: 'Branch Manager', level: 3 },
    { value: RoleType.ADMIN_STAFF, label: 'Admin Staff', level: 4 },
    { value: RoleType.TECHNICIAN, label: 'Technician', level: 5 },
    { value: RoleType.USER, label: 'User', level: 6 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Role' : 'Create New Role'}</CardTitle>
        <CardDescription>
          {isEditMode
            ? 'Update role name and description. Type and level cannot be changed.'
            : 'Create a new role with custom permissions.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Role Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter role name"
              disabled={isPending}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
          </div>

          {/* Type (only for create) */}
          {!isEditMode && (
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Role Type <span className="text-red-500">*</span>
              </label>
              <RadioGroup
                value={selectedType}
                onValueChange={value => {
                  setValue('type', value as RoleType)
                  // Auto-set level based on type
                  const roleType = availableTypes.find(t => t.value === value)
                  if (roleType) {
                    setValue('level', roleType.level)
                  }
                }}
                disabled={isPending}
              >
                {availableTypes.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="cursor-pointer">
                      {type.label}{' '}
                      <span className="text-muted-foreground">(Level {type.level})</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message as string}</p>
              )}
            </div>
          )}

          {/* Level (only for create, read-only display) */}
          {!isEditMode && (
            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium">
                Role Level <span className="text-red-500">*</span>
              </label>
              <Input
                id="level"
                type="number"
                {...register('level', { valueAsNumber: true })}
                min="2"
                max="6"
                disabled={isPending}
                readOnly
              />
              <p className="text-muted-foreground text-xs">
                Level is auto-set based on role type (2-6, lower = higher authority)
              </p>
              {errors.level && (
                <p className="text-sm text-red-500">{errors.level.message as string}</p>
              )}
            </div>
          )}

          {/* Type display (for edit mode) */}
          {isEditMode && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Type</label>
              <Input value={role.type} disabled />
              <p className="text-muted-foreground text-xs">Type cannot be changed after creation</p>
            </div>
          )}

          {/* Level display (for edit mode) */}
          {isEditMode && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Level</label>
              <Input value={role.level} disabled />
              <p className="text-muted-foreground text-xs">
                Level cannot be changed after creation
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter role description"
              rows={3}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message as string}</p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEditMode ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
