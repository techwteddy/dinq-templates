import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { Category, ExchangeRate, User } from '@prisma/client'

export default async function SettingsPage() {
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

  // Fetch categories and exchange rates
  const [categories, exchangeRates, users] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    }),
    prisma.exchangeRate.findMany({
      where: { tenantId },
      orderBy: { date: 'desc' },
      take: 10,
    }),
    prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  const incomeCategories = categories.filter(cat => cat.type === 'income')

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Tenant Information */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Tenant Information</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tenant Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={dbUser.tenant.name}
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tenant ID</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={dbUser.tenant.id}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Users</h2>
              <button className="btn btn-sm btn-primary">Invite User</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: User) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.name || 'N/A'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Expense Categories */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Expense Categories</h2>
                <button className="btn btn-sm btn-primary">Add</button>
              </div>
              <div className="space-y-2">
                {expenseCategories.map((category: Category) => (
                  <div key={category.id} className="badge badge-error badge-lg">
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Income Categories */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Income Categories</h2>
                <button className="btn btn-sm btn-primary">Add</button>
              </div>
              <div className="space-y-2">
                {incomeCategories.map((category: Category) => (
                  <div key={category.id} className="badge badge-success badge-lg">
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rates */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Exchange Rates</h2>
              <button className="btn btn-sm btn-primary">Add Rate</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRates.map((rate: ExchangeRate) => (
                    <tr key={rate.id}>
                      <td>{new Date(rate.date).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-outline">{rate.fromCurrency}</span>
                      </td>
                      <td>
                        <span className="badge badge-outline">{rate.toCurrency}</span>
                      </td>
                      <td className="font-semibold">{rate.rate.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
