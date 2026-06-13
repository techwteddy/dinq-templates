'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { resetDatabaseAction } from '../actions'

export function DatabaseReset() {
  const [resetting, setResetting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleReset = async () => {
    if (confirmText !== 'RESET') {
      toast.error('Please type RESET to confirm')
      return
    }

    setResetting(true)
    try {
      const result = await resetDatabaseAction()
      toast.success(result.message || 'Database reset successfully')
      setConfirmText('')

      // Refresh page after reset
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      toast.error('Failed to reset database')
    } finally {
      setResetting(false)
    }
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">🔄 Reset Database</CardTitle>
        <CardDescription>Delete all test data and return to clean state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">This will:</h4>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li className="text-green-600">
              <strong>Keep:</strong> Super Admin user (admin@repairshop.com)
            </li>
            <li className="text-green-600">
              <strong>Keep:</strong> All roles & permissions
            </li>
            <li className="text-green-600">
              <strong>Keep:</strong> HQ branch
            </li>
            <li className="text-red-600">
              <strong>Delete:</strong> All other users
            </li>
            <li className="text-red-600">
              <strong>Delete:</strong> All other branches
            </li>
            <li className="text-red-600">
              <strong>Delete:</strong> All audit logs
            </li>
            <li className="text-red-600">
              <strong>Delete:</strong> All uploaded files
            </li>
          </ul>
        </div>

        <div className="rounded-md border-2 border-red-300 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">
            ⚠️ DESTRUCTIVE ACTION: This cannot be undone!
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm" className="text-sm font-medium">
            Type <code className="rounded bg-red-100 px-2 py-1 text-red-700">RESET</code> to
            confirm:
          </label>
          <Input
            id="confirm"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="Type RESET here"
            className="font-mono"
          />
        </div>

        <Button
          onClick={handleReset}
          disabled={resetting || confirmText !== 'RESET'}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          {resetting ? 'Resetting Database...' : '🔄 Reset Database'}
        </Button>
      </CardContent>
    </Card>
  )
}
