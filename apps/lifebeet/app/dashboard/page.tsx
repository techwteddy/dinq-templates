import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import prisma from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import { redirect } from 'next/navigation'
import type { ExpenseWithCategory, IncomeWithCategory } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's tenant from database
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { tenant: true },
  })

  if (!dbUser) {
    // User not in database yet - would need to be created on signup
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="container mx-auto p-4">
          <div className="alert alert-info">
            <span>Please complete your profile setup.</span>
          </div>
        </div>
      </div>
    )
  }

  const tenantId = dbUser.tenantId

  // Fetch dashboard data
  const [
    totalExpenses,
    totalIncome,
    recentExpenses,
    recentIncome,
    exchangeRate,
  ] = await Promise.all([
    prisma.expense.aggregate({
      where: { tenantId },
      _sum: { amount: true },
    }),
    prisma.income.aggregate({
      where: { tenantId },
      _sum: { amount: true },
    }),
    prisma.expense.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.income.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.exchangeRate.findFirst({
      where: { tenantId, fromCurrency: 'USD', toCurrency: 'PYG' },
      orderBy: { date: 'desc' },
    }),
  ])

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome, {dbUser.name || user.email}</h1>
          <p className="text-gray-600">Tenant: {dbUser.tenant.name}</p>
        </div>

        {/* Stats */}
        <div className="stats shadow w-full mb-6">
          <div className="stat">
            <div className="stat-title">Total Income</div>
            <div className="stat-value text-success">
              {formatCurrency(totalIncome._sum.amount || 0, 'PYG')}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Total Expenses</div>
            <div className="stat-value text-error">
              {formatCurrency(totalExpenses._sum.amount || 0, 'PYG')}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Balance</div>
            <div className="stat-value">
              {formatCurrency(
                (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
                'PYG'
              )}
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        {exchangeRate && (
          <div className="alert alert-info mb-6">
            <span>
              Current Exchange Rate: 1 USD = {exchangeRate.rate} PYG
            </span>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Expenses</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExpenses.map((expense: ExpenseWithCategory) => (
                      <tr key={expense.id}>
                        <td>{expense.description}</td>
                        <td>{expense.category.name}</td>
                        <td>{formatCurrency(expense.amount, expense.currency)}</td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Income */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Income</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentIncome.map((income: IncomeWithCategory) => (
                      <tr key={income.id}>
                        <td>{income.description}</td>
                        <td>{income.category.name}</td>
                        <td>{formatCurrency(income.amount, income.currency)}</td>
                        <td>{new Date(income.date).toLocaleDateString()}</td>
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
