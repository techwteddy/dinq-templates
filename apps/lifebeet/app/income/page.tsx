import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import prisma from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import { redirect } from 'next/navigation'
import type { IncomeWithCategory } from '@/types'

export default async function IncomePage() {
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

  // Fetch income with categories
  const [incomes, categories] = await Promise.all([
    prisma.income.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
    prisma.category.findMany({
      where: { tenantId, type: 'income' },
      orderBy: { name: 'asc' },
    }),
  ])

  const totalIncome = incomes.reduce((sum: number, inc: IncomeWithCategory) => sum + inc.amount, 0)

  // Group income by month
  const incomeByMonth: Record<string, number> = {}
  incomes.forEach((income: IncomeWithCategory) => {
    const month = new Date(income.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
    incomeByMonth[month] = (incomeByMonth[month] || 0) + income.amount
  })

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Income</h1>
          <button className="btn btn-primary">Add Income</button>
        </div>

        {/* Stats */}
        <div className="stats shadow w-full mb-6">
          <div className="stat">
            <div className="stat-title">Total Income</div>
            <div className="stat-value text-success">
              {formatCurrency(totalIncome, 'PYG')}
            </div>
            <div className="stat-desc">All time</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Number of Entries</div>
            <div className="stat-value">{incomes.length}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Categories</div>
            <div className="stat-value">{categories.length}</div>
          </div>
        </div>

        {/* Income Table */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">All Income</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income: IncomeWithCategory) => (
                    <tr key={income.id}>
                      <td>{new Date(income.date).toLocaleDateString()}</td>
                      <td>{income.description}</td>
                      <td>
                        <span className="badge badge-success badge-outline">
                          {income.category.name}
                        </span>
                      </td>
                      <td className="font-semibold text-success">
                        {formatCurrency(income.amount, income.currency)}
                      </td>
                      <td>{income.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Income by Month */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Income by Month</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(incomeByMonth).map(([month, total]) => (
                    <tr key={month}>
                      <td>{month}</td>
                      <td className="font-semibold text-success">
                        {formatCurrency(total, 'PYG')}
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
  )
}
