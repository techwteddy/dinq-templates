'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { seedSampleDataAction, checkSampleDataDeployedAction } from '../actions'
import { CheckCircle2 } from 'lucide-react'

export function DataSeeding() {
  const [seeding, setSeeding] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if sample data is already deployed
    const checkDeploymentStatus = async () => {
      try {
        const result = await checkSampleDataDeployedAction()
        setIsDeployed(result.deployed)
      } catch (error) {
        console.error('Failed to check sample data status:', error)
      } finally {
        setChecking(false)
      }
    }

    checkDeploymentStatus()
  }, [])

  const handleSeedData = async () => {
    if (!confirm('Deploy sample test data? This will add users and branches to the database.')) {
      return
    }

    setSeeding(true)
    try {
      const result = await seedSampleDataAction()

      if (!result.success) {
        toast.error(result.error || 'Failed to seed data')
        return
      }

      toast.success(result.message || 'Sample data seeded successfully')
      toast.info('Test password for all users: test1234')
      setIsDeployed(true) // Update status after successful deployment
    } catch (error) {
      toast.error('Failed to seed data')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌱 Seed Sample Data</CardTitle>
        <CardDescription>Deploy complete test dataset for development and testing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">This will create:</h4>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>1 General Manager:</strong> gm@test.com
            </li>
            <li>
              <strong>Branches:</strong> Malang (MLG), Jogja (JOG), Sub Jogja (SJOG)
            </li>
            <li>
              <strong>Branch Managers:</strong> bm_mlg@test.com, bm_jog@test.com
            </li>
            <li>
              <strong>Staff Admins:</strong> sa_mlg@test.com, sa_jog@test.com, sa_sjog@test.com
            </li>
            <li>
              <strong>Technicians:</strong> tech_mlg@test.com, tech_jog@test.com
            </li>
            <li>
              <strong>Regular Users:</strong> user_mlg@test.com, user_jog@test.com
            </li>
          </ul>
        </div>

        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm">
            <strong>Password for all test users:</strong>{' '}
            <code className="rounded bg-yellow-100 px-2 py-1">test1234</code>
          </p>
        </div>

        {isDeployed ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-semibold text-green-900">Sample data has been deployed</p>
            </div>
            <p className="mt-2 text-xs text-green-700">
              Sample data is already in the database. Please reset the database first if you want to
              re-deploy to avoid data duplication.
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              ℹ️ This will <strong>ADD</strong> data to the existing database. It won't delete
              anything.
            </p>
          </div>
        )}

        <Button
          onClick={handleSeedData}
          disabled={seeding || isDeployed || checking}
          className="w-full"
          size="lg"
        >
          {checking ? 'Checking status...' : seeding ? 'Seeding Data...' : '🌱 Deploy Sample Data'}
        </Button>
      </CardContent>
    </Card>
  )
}
