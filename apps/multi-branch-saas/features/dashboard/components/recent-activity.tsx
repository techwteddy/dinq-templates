import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Plus, Edit, Trash2, LogIn, LogOut } from 'lucide-react'
import { AuditAction } from '@/lib/generated/prisma'
import { getRecentActivityAction } from '../actions/dashboard.actions'
import { formatDistanceToNow } from 'date-fns'

function getActionIcon(action: AuditAction) {
  switch (action) {
    case AuditAction.CREATE:
      return Plus
    case AuditAction.UPDATE:
      return Edit
    case AuditAction.DELETE:
      return Trash2
    case AuditAction.LOGIN:
      return LogIn
    case AuditAction.LOGOUT:
      return LogOut
    default:
      return Activity
  }
}

function getActionColor(action: AuditAction) {
  switch (action) {
    case AuditAction.CREATE:
      return 'text-green-500'
    case AuditAction.UPDATE:
      return 'text-blue-500'
    case AuditAction.DELETE:
      return 'text-red-500'
    case AuditAction.LOGIN:
      return 'text-purple-500'
    case AuditAction.LOGOUT:
      return 'text-gray-500'
    default:
      return 'text-muted-foreground'
  }
}

function getActionText(action: AuditAction, resource: string) {
  const actionVerb = action.toLowerCase()
  return `${actionVerb} ${resource}`
}

export async function RecentActivity() {
  const activities = await getRecentActivityAction(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => {
              const Icon = getActionIcon(activity.action)
              const color = getActionColor(activity.action)
              const text = getActionText(activity.action, activity.resource)

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`bg-muted mt-0.5 rounded-full p-2 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-none font-medium capitalize">{text}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
