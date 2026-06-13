'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionMatrix } from './permission-matrix'
import { RoleManagement } from './role-management'
import { DataSeeding } from './data-seeding'
import { DatabaseReset } from './database-reset'

export function DevToolsDashboard() {
  return (
    <Tabs defaultValue="permissions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        <TabsTrigger value="roles">Role Management</TabsTrigger>
        <TabsTrigger value="seeding">Data Seeding</TabsTrigger>
        <TabsTrigger value="reset">Database Reset</TabsTrigger>
      </TabsList>

      <TabsContent value="permissions" className="space-y-4">
        <PermissionMatrix />
      </TabsContent>

      <TabsContent value="roles" className="space-y-4">
        <RoleManagement />
      </TabsContent>

      <TabsContent value="seeding" className="space-y-4">
        <DataSeeding />
      </TabsContent>

      <TabsContent value="reset" className="space-y-4">
        <DatabaseReset />
      </TabsContent>
    </Tabs>
  )
}
