import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import prisma from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import { redirect } from 'next/navigation'
import type { Purchase } from '@prisma/client'

export default async function PurchasesPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { tenant: true },
  })

  if (!dbUser) {
    redirect('/auth/login')
  }

  const tenantId = dbUser.tenantId

  // Fetch purchases
  const purchases = await prisma.purchase.findMany({
    where: { tenantId },
    orderBy: { date: 'desc' },
  })

  const totalPurchases = purchases.reduce((sum: number, purchase: Purchase) => sum + purchase.amount, 0)

  // Group purchases by store
  const purchasesByStore: Record<string, { count: number; total: number }> = {}
  purchases.forEach((purchase: Purchase) => {
    const store = purchase.store || 'Unknown'
    if (!purchasesByStore[store]) {
      purchasesByStore[store] = { count: 0, total: 0 }
    }
    purchasesByStore[store].count++
    purchasesByStore[store].total += purchase.amount
  })

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Purchases</h1>
          <button className="btn btn-primary">Add Purchase</button>
        </div>

        {/* Stats */}
        <div className="stats shadow w-full mb-6">
          <div className="stat">
            <div className="stat-title">Total Purchases</div>
            <div className="stat-value text-primary">
              {formatCurrency(totalPurchases, 'PYG')}
            </div>
            <div className="stat-desc">All time</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Number of Purchases</div>
            <div className="stat-value">{purchases.length}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Stores</div>
            <div className="stat-value">{Object.keys(purchasesByStore).length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchases Table */}
          <div className="card bg-base-100 shadow-xl lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title">All Purchases</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Store</th>
                      <th>Amount</th>
                      <th>Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase: Purchase) => (
                      <tr key={purchase.id}>
                        <td>{new Date(purchase.date).toLocaleDateString()}</td>
                        <td>{purchase.description}</td>
                        <td>
                          <span className="badge badge-outline">
                            {purchase.store || 'N/A'}
                          </span>
                        </td>
                        <td>{formatCurrency(purchase.amount, purchase.currency)}</td>
                        <td>{purchase.currency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Purchases by Store */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">By Store</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Store</th>
                      <th>Count</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(purchasesByStore)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([store, data]) => (
                        <tr key={store}>
                          <td>{store}</td>
                          <td>
                            <span className="badge">{data.count}</span>
                          </td>
                          <td className="font-semibold">
                            {formatCurrency(data.total, 'PYG')}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
