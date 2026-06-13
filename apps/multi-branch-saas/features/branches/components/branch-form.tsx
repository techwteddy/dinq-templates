'use client'

import { useState, useEffect, useTransition, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createBranchSchema, updateBranchSchema } from '@/lib/validation/branch.schema'
import { createBranchAction, updateBranchAction } from '../actions'
import { getBranchesAction } from '../actions'
import { BranchType } from '@/lib/generated/prisma'
import type { BranchDetail, BranchListItem } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'

type BranchFormProps = {
  branch?: BranchDetail
}

export function BranchForm({ branch }: BranchFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [availableBranches, setAvailableBranches] = useState<BranchListItem[]>([])
  const [selectedType, setSelectedType] = useState<BranchType>(branch?.type || BranchType.BRANCH)

  const isEditMode = !!branch

  const schema = isEditMode ? updateBranchSchema : createBranchSchema

  const defaultValues = isEditMode
    ? {
        name: branch.name,
        code: branch.code,
        type: branch.type,
        parentId: branch.parentId || '',
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        isActive: branch.isActive,
      }
    : {
        name: '',
        code: '',
        type: BranchType.BRANCH,
        parentId: '',
        address: '',
        phone: '',
        email: '',
        isActive: true,
      }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // Watch form changes
  const watchedValues = watch()
  const watchedType = watchedValues.type

  useEffect(() => {
    if (watchedType) {
      setSelectedType(watchedType as BranchType)
    }
  }, [watchedType])

  // Track if form has changed in edit mode
  const hasFormChanged = useMemo(() => {
    if (!isEditMode) return true // Always allow create

    const current = {
      name: watchedValues.name,
      code: watchedValues.code,
      type: watchedValues.type,
      parentId: watchedValues.parentId || '',
      address: watchedValues.address || '',
      phone: watchedValues.phone || '',
      email: watchedValues.email || '',
      isActive: watchedValues.isActive,
    }

    const initial = {
      name: defaultValues.name,
      code: defaultValues.code,
      type: defaultValues.type,
      parentId: defaultValues.parentId || '',
      address: defaultValues.address || '',
      phone: defaultValues.phone || '',
      email: defaultValues.email || '',
      isActive: defaultValues.isActive,
    }

    return JSON.stringify(current) !== JSON.stringify(initial)
  }, [watchedValues, isEditMode, defaultValues])

  // Fetch available branches for parent selection
  useEffect(() => {
    const fetchBranches = async () => {
      const branches = await getBranchesAction({ isActive: true })
      // Filter based on type hierarchy rules
      let filtered = branches
      if (selectedType === BranchType.BRANCH) {
        // Branch must have HQ parent
        filtered = branches.filter(b => b.type === BranchType.HEADQUARTERS)
      } else if (selectedType === BranchType.SUB_BRANCH) {
        // Sub-branch must have Branch parent
        filtered = branches.filter(b => b.type === BranchType.BRANCH)
      }
      // Exclude self in edit mode
      if (isEditMode) {
        filtered = filtered.filter(b => b.id !== branch.id)
      }
      setAvailableBranches(filtered)

      // In edit mode, ensure parentId is set after branches are loaded
      if (isEditMode && branch.parentId) {
        setValue('parentId', branch.parentId)
      }
    }

    if (selectedType !== BranchType.HEADQUARTERS) {
      fetchBranches()
    } else {
      setAvailableBranches([])
      setValue('parentId', '')
    }
  }, [selectedType, isEditMode, branch, setValue])

  const onSubmit = (data: any) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const result = isEditMode
        ? await updateBranchAction(branch.id, data)
        : await createBranchAction(data)

      if (!result.success) {
        setError(result.error || 'Operation failed')
      } else {
        setSuccess(result.message || 'Branch saved successfully')
        if (!isEditMode) {
          setTimeout(() => {
            router.push('/branches')
          }, 1500)
        }
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Branch' : 'Create New Branch'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update branch information' : 'Add a new branch to the organization'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && <Alert variant="destructive">{error}</Alert>}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-900">{success}</Alert>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Branch Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Branch Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="HQ, JKT, BDG-01"
                disabled={isPending}
                {...register('code')}
              />
              <p className="text-muted-foreground text-xs">
                Uppercase letters, numbers, hyphens, and underscores only
              </p>
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message as string}</p>
              )}
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Headquarters, Jakarta Branch"
                disabled={isPending}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message as string}</p>
              )}
            </div>

            {/* Branch Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Branch Type</Label>
              <select
                id="type"
                className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                disabled={isPending}
                {...register('type')}
              >
                <option value={BranchType.HEADQUARTERS}>Headquarters</option>
                <option value={BranchType.BRANCH}>Branch</option>
                <option value={BranchType.SUB_BRANCH}>Sub-Branch</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message as string}</p>
              )}
            </div>

            {/* Parent Branch */}
            {selectedType !== BranchType.HEADQUARTERS && (
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Branch</Label>
                <select
                  id="parentId"
                  className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  disabled={isPending || availableBranches.length === 0}
                  {...register('parentId')}
                >
                  <option value="">Select parent branch</option>
                  {availableBranches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
                <p className="text-muted-foreground text-xs">
                  {selectedType === BranchType.BRANCH && 'Must select a Headquarters'}
                  {selectedType === BranchType.SUB_BRANCH && 'Must select a Branch'}
                </p>
                {errors.parentId && (
                  <p className="text-sm text-red-500">{errors.parentId.message as string}</p>
                )}
              </div>
            )}

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                type="text"
                placeholder="Full address"
                disabled={isPending}
                {...register('address')}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message as string}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+62-21-1234567"
                disabled={isPending}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message as string}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="branch@example.com"
                disabled={isPending}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message as string}</p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              disabled={isPending}
              defaultChecked={isEditMode ? branch.isActive : true}
              onCheckedChange={checked => setValue('isActive', checked as boolean)}
            />
            <Label htmlFor="isActive" className="cursor-pointer text-sm font-normal">
              Active branch
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isPending || (isEditMode && !hasFormChanged)}>
              {isPending ? 'Saving...' : isEditMode ? 'Update Branch' : 'Create Branch'}
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
