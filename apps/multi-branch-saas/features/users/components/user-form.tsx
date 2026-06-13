'use client'

import { useState, useEffect, useTransition, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createUserSchema, updateUserSchema } from '@/lib/validation/user.schema'
import { createUserAction, updateUserAction } from '../actions'
import { getActiveBranches } from '@/features/branches/actions/get-branches'
import { UserStatus, RoleType } from '@/lib/generated/prisma'
import type { UserDetail } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'

type Branch = {
  id: string
  name: string
  code: string
  type: string
}

type Role = {
  id: string
  name: string
  type: RoleType
  level: number
}

type UserFormProps = {
  user?: UserDetail
  roles: Role[]
}

export function UserForm({ user, roles }: UserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user?.profile?.userRoles.map(ur => ur.role.id) || []
  )

  const isEditMode = !!user

  const schema = isEditMode ? updateUserSchema : createUserSchema

  const defaultValues = isEditMode
    ? {
        email: user.email,
        fullName: user.profile?.fullName || '',
        phone: user.profile?.phone || '',
        branchId: user.profile?.branchId || '',
        status: user.profile?.status || UserStatus.ACTIVE,
        roleIds: user.profile?.userRoles.map(ur => ur.role.id) || [],
      }
    : {
        email: '',
        password: '',
        fullName: '',
        phone: '',
        branchId: '',
        status: UserStatus.ACTIVE,
        roleIds: [],
      }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
  })

  // Watch all form values for changes
  const watchedValues = watch()

  // Check if form has changed (for edit mode)
  const hasFormChanged = useMemo(() => {
    if (!isEditMode) return true // Always allow create

    // Compare current values with initial values
    const current = {
      email: watchedValues.email,
      fullName: watchedValues.fullName,
      phone: watchedValues.phone || '',
      branchId: watchedValues.branchId,
      status: watchedValues.status,
      roleIds: selectedRoles.sort().join(','),
    }

    const initial = {
      email: defaultValues.email,
      fullName: defaultValues.fullName,
      phone: defaultValues.phone || '',
      branchId: defaultValues.branchId,
      status: defaultValues.status,
      roleIds: defaultValues.roleIds?.sort().join(',') || '',
    }

    return JSON.stringify(current) !== JSON.stringify(initial)
  }, [watchedValues, selectedRoles, isEditMode, defaultValues])

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      const data = await getActiveBranches()
      setBranches(data)

      // In edit mode, ensure branchId is set after branches are loaded
      if (isEditMode && user.profile?.branchId) {
        setValue('branchId', user.profile.branchId)
      }
    }
    fetchBranches()
  }, [isEditMode, user, setValue])

  const onSubmit = (data: any) => {
    console.log('onSubmit called with data:', data)
    console.log('Form errors:', errors)
    setError('')
    setSuccess('')

    console.log('Submitting form data:', data)

    startTransition(async () => {
      const result = isEditMode
        ? await updateUserAction(user.id, data)
        : await createUserAction(data)

      if (!result.success) {
        setError(result.error || 'Operation failed')
      } else {
        setSuccess(result.message || 'User saved successfully')
        if (!isEditMode) {
          setTimeout(() => {
            router.push('/users')
          }, 1500)
        }
      }
    })
  }

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
      console.log('toggleRole - roleId:', roleId)
      console.log('toggleRole - prev:', prev)
      console.log('toggleRole - new:', newRoles)
      // Sync with React Hook Form
      setValue('roleIds', newRoles)
      return newRoles
    })
  }

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit User' : 'Create New User'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update user information and permissions' : 'Add a new user to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {error && <Alert variant="destructive">{error}</Alert>}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-900">{success}</Alert>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                disabled={isPending}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message as string}</p>
              )}
            </div>

            {/* Password (only for create) */}
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  disabled={isPending}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message as string}</p>
                )}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                disabled={isPending}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message as string}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+62-812-3456-7890"
                disabled={isPending}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message as string}</p>
              )}
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branchId">Branch</Label>
              <select
                id="branchId"
                className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                disabled={isPending}
                {...register('branchId')}
              >
                <option value="">Select a branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <p className="text-sm text-red-500">{errors.branchId.message as string}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                disabled={isPending}
                {...register('status')}
              >
                <option value={UserStatus.ACTIVE}>Active</option>
                <option value={UserStatus.INACTIVE}>Inactive</option>
                <option value={UserStatus.SUSPENDED}>Suspended</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message as string}</p>
              )}
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="space-y-3 rounded-lg border p-4">
              {roles.map(role => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => toggleRole(role.id)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`role-${role.id}`} className="cursor-pointer text-sm font-normal">
                    {role.name}
                    <span className="text-muted-foreground ml-2 text-xs">(Level {role.level})</span>
                  </Label>
                </div>
              ))}
            </div>
            {selectedRoles.length === 0 && (
              <p className="text-sm text-red-500">At least one role is required</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending || selectedRoles.length === 0 || (isEditMode && !hasFormChanged)}
              onClick={() =>
                console.log(
                  'Button clicked - selectedRoles:',
                  selectedRoles,
                  'isPending:',
                  isPending,
                  'hasFormChanged:',
                  hasFormChanged
                )
              }
            >
              {isPending ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
