'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { getRolePermissionsAction, updateRolePermissionsAction } from '../actions'

type RolePermission = {
  roleId: string
  roleName: string
  roleType: string
  permissions: {
    id: string
    resource: string
    action: string
    scope: string
    enabled: boolean
  }[]
}

export function PermissionMatrix() {
  const [roles, setRoles] = useState<RolePermission[]>([])
  const [originalRoles, setOriginalRoles] = useState<RolePermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRolePermissions()
  }, [])

  const fetchRolePermissions = async () => {
    setLoading(true)
    try {
      const data = await getRolePermissionsAction()
      setRoles(data)
      // Store original state for comparison
      setOriginalRoles(JSON.parse(JSON.stringify(data)))
    } catch (error) {
      toast.error('Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.roleId === roleId
          ? {
              ...role,
              permissions: role.permissions.map(perm =>
                perm.id === permissionId ? { ...perm, enabled: !perm.enabled } : perm
              ),
            }
          : role
      )
    )
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      await updateRolePermissionsAction(roles)
      toast.success('Permissions updated successfully')
      // Update original state after successful save
      setOriginalRoles(JSON.parse(JSON.stringify(roles)))
    } catch (error) {
      toast.error('Failed to update permissions')
    } finally {
      setSaving(false)
    }
  }

  // Check if a permission has been changed
  const isPermissionChanged = (roleId: string, permissionId: string): boolean => {
    const currentRole = roles.find(r => r.roleId === roleId)
    const originalRole = originalRoles.find(r => r.roleId === roleId)

    if (!currentRole || !originalRole) return false

    const currentPerm = currentRole.permissions.find(p => p.id === permissionId)
    const originalPerm = originalRole.permissions.find(p => p.id === permissionId)

    return currentPerm?.enabled !== originalPerm?.enabled
  }

  // Check if there are any unsaved changes
  const hasUnsavedChanges = (): boolean => {
    return JSON.stringify(roles) !== JSON.stringify(originalRoles)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading permissions...</CardContent>
      </Card>
    )
  }

  // Group permissions by resource
  const resources = Array.from(new Set(roles[0]?.permissions.map(p => p.resource) || []))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role & Permission Matrix</CardTitle>
        <CardDescription>
          Assign permissions to roles. Toggle switches to grant/revoke permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {resources.map(resource => (
          <div key={resource} className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">📊 {resource}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-center">Create</th>
                    <th className="p-2 text-center">Read</th>
                    <th className="p-2 text-center">Update</th>
                    <th className="p-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(role => (
                    <tr key={role.roleId} className="border-b">
                      <td className="p-2 font-medium">{role.roleName}</td>
                      {['create', 'read', 'update', 'delete'].map(action => {
                        const perm = role.permissions.find(
                          p => p.resource === resource && p.action === action
                        )
                        const hasChanged = perm && isPermissionChanged(role.roleId, perm.id)
                        return (
                          <td key={action} className="p-2 text-center">
                            {perm && (
                              <div
                                className={`inline-block ${hasChanged ? 'rounded-full ring-2 ring-orange-500' : ''}`}
                              >
                                <Switch
                                  checked={perm.enabled}
                                  onCheckedChange={() => togglePermission(role.roleId, perm.id)}
                                />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <Button
            onClick={saveChanges}
            disabled={saving || !hasUnsavedChanges()}
            className="flex-1"
          >
            {saving ? 'Saving...' : 'Save Permission Changes'}
          </Button>
          {hasUnsavedChanges() && (
            <span className="text-sm font-medium text-orange-600">⚠️ Unsaved changes</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
