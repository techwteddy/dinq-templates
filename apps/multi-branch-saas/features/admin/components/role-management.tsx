'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getRolesAction, deleteRoleAction } from '../actions/role.actions'
import { RoleForm } from './role-form'
import { Pencil, Trash2, Plus, Users, Shield } from 'lucide-react'

type Role = {
  id: string
  name: string
  type: string
  level: number
  description: string | null
  userCount: number
  permissionCount: number
  createdAt: Date
  updatedAt: Date
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const data = await getRolesAction()
      setRoles(data as Role[])
    } catch (error) {
      toast.error('Failed to load roles')
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleDelete = async () => {
    if (!deletingRole) return

    setIsDeleting(true)
    try {
      const result = await deleteRoleAction(deletingRole.id)

      if (result.success) {
        toast.success('Role deleted successfully')
        setDeletingRole(null)
        fetchRoles()
      } else {
        toast.error(result.error || 'Failed to delete role')
      }
    } catch (error) {
      toast.error('An error occurred while deleting role')
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    setShowCreateForm(false)
    setEditingRole(null)
    fetchRoles()
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setEditingRole(null)
  }

  // Get badge color based on role level
  const getLevelBadge = (level: number) => {
    if (level === 2) return <Badge variant="destructive">Level {level}</Badge>
    if (level === 3) return <Badge variant="default">Level {level}</Badge>
    if (level === 4) return <Badge variant="secondary">Level {level}</Badge>
    return <Badge variant="outline">Level {level}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading roles...</p>
        </CardContent>
      </Card>
    )
  }

  // Show form if creating or editing
  if (showCreateForm || editingRole) {
    return (
      <RoleForm
        role={editingRole || undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleCancelForm}
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Manage system roles and their hierarchy (SUPER_ADMIN excluded)
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Level</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">Permissions</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground text-center">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted rounded px-2 py-1 text-xs">{role.type}</code>
                      </TableCell>
                      <TableCell className="text-center">{getLevelBadge(role.level)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span>{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Shield className="text-muted-foreground h-4 w-4" />
                          <span>{role.permissionCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {role.description || (
                          <span className="text-muted-foreground italic">No description</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingRole(role)}
                            disabled={role.userCount > 0}
                            title={
                              role.userCount > 0
                                ? `Cannot delete: ${role.userCount} user(s) assigned`
                                : 'Delete role'
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Info */}
          <div className="bg-muted mt-4 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              <strong>Note:</strong> Level determines role hierarchy (2 = highest, 6 = lowest).
              Roles cannot be deleted if users are assigned. Type and level are immutable after
              creation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingRole} onOpenChange={() => setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role{' '}
              <strong className="text-foreground">"{deletingRole?.name}"</strong>?
              <br />
              <br />
              This action cannot be undone. All permissions assigned to this role will also be
              removed.
              <br />
              <br />
              <span className="font-semibold text-red-600">Type DELETE to confirm:</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <input
              type="text"
              placeholder="Type DELETE"
              className="w-full rounded-md border px-3 py-2"
              id="delete-confirm"
              onInput={e => {
                const input = e.currentTarget
                const button = document.getElementById('delete-confirm-button')
                if (button) {
                  ;(button as HTMLButtonElement).disabled = input.value !== 'DELETE'
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              id="delete-confirm-button"
              disabled={true}
              onClick={e => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
