import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import prisma from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import { redirect } from 'next/navigation'
import type { ExpenseWithCategory, FixedExpenseWithCategory, VariableExpenseWithCategory } from '@/types'

export default async function ExpensesPage() {
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

  // Fetch expenses with categories
  const [expenses, categories, fixedExpenses, variableExpenses] = await Promise.all([
    prisma.expense.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
    prisma.category.findMany({
      where: { tenantId, type: 'expense' },
      orderBy: { name: 'asc' },
    }),
    prisma.fixedExpense.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { startDate: 'desc' },
    }),
    prisma.variableExpense.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
  ])

  const totalExpenses = expenses.reduce((sum: number, exp: ExpenseWithCategory) => sum + exp.amount, 0)
  const totalFixed = fixedExpenses.reduce((sum: number, exp: FixedExpenseWithCategory) => sum + exp.amount, 0)
  const totalVariable = variableExpenses.reduce((sum: number, exp: VariableExpenseWithCategory) => sum + exp.amount, 0)

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <button className="btn btn-primary">Add Expense</button>
        </div>

        {/* Stats */}
        <div className="stats shadow w-full mb-6">
          <div className="stat">
            <div className="stat-title">Total Expenses</div>
            <div className="stat-value text-error">
              {formatCurrency(totalExpenses, 'PYG')}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Fixed Expenses</div>
            <div className="stat-value text-warning">
              {formatCurrency(totalFixed, 'PYG')}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Variable Expenses</div>
            <div className="stat-value text-info">
              {formatCurrency(totalVariable, 'PYG')}
            </div>
          </div>
        </div>

        {/* Tabs for different expense types */}
        <div role="tablist" className="tabs tabs-lifted mb-4">
          <input type="radio" name="expense_tabs" role="tab" className="tab" aria-label="All Expenses" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">All Expenses</h2>
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
                      {expenses.map((expense: ExpenseWithCategory) => (
                        <tr key={expense.id}>
                          <td>{new Date(expense.date).toLocaleDateString()}</td>
                          <td>{expense.description}</td>
                          <td>
                            <span className="badge badge-outline">
                              {expense.category.name}
                            </span>
                          </td>
                          <td>{formatCurrency(expense.amount, expense.currency)}</td>
                          <td>{expense.currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <input type="radio" name="expense_tabs" role="tab" className="tab" aria-label="Fixed" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Fixed Expenses</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Frequency</th>
                        <th>Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fixedExpenses.map((expense: FixedExpenseWithCategory) => (
                        <tr key={expense.id}>
                          <td>{expense.description}</td>
                          <td>
                            <span className="badge badge-outline">
                              {expense.category.name}
                            </span>
                          </td>
                          <td>{formatCurrency(expense.amount, expense.currency)}</td>
                          <td>
                            <span className="badge badge-info">{expense.frequency}</span>
                          </td>
                          <td>{new Date(expense.startDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <input type="radio" name="expense_tabs" role="tab" className="tab" aria-label="Variable" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Variable Expenses</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variableExpenses.map((expense: VariableExpenseWithCategory) => (
                        <tr key={expense.id}>
                          <td>{new Date(expense.date).toLocaleDateString()}</td>
                          <td>{expense.description}</td>
                          <td>
                            <span className="badge badge-outline">
                              {expense.category.name}
                            </span>
                          </td>
                          <td>{formatCurrency(expense.amount, expense.currency)}</td>
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
    </div>
  )
}
