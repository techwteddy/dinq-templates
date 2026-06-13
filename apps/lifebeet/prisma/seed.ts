import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create a tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Organization',
    },
  })
  console.log(`Created tenant: ${tenant.name}`)

  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'demo@lifebeet.com',
      name: 'Demo User',
      tenantId: tenant.id,
    },
  })
  console.log(`Created user: ${user.email}`)

  // Create categories
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: { name: 'Food', type: 'expense', tenantId: tenant.id },
    }),
    prisma.category.create({
      data: { name: 'Transport', type: 'expense', tenantId: tenant.id },
    }),
    prisma.category.create({
      data: { name: 'Utilities', type: 'expense', tenantId: tenant.id },
    }),
    prisma.category.create({
      data: { name: 'Entertainment', type: 'expense', tenantId: tenant.id },
    }),
  ])
  console.log(`Created ${expenseCategories.length} expense categories`)

  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: { name: 'Salary', type: 'income', tenantId: tenant.id },
    }),
    prisma.category.create({
      data: { name: 'Freelance', type: 'income', tenantId: tenant.id },
    }),
    prisma.category.create({
      data: { name: 'Investment', type: 'income', tenantId: tenant.id },
    }),
  ])
  console.log(`Created ${incomeCategories.length} income categories`)

  // Create exchange rate
  const exchangeRate = await prisma.exchangeRate.create({
    data: {
      tenantId: tenant.id,
      fromCurrency: 'USD',
      toCurrency: 'PYG',
      rate: 7300,
      date: new Date(),
    },
  })
  console.log(`Created exchange rate: 1 USD = ${exchangeRate.rate} PYG`)

  // Create sample expenses
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        tenantId: tenant.id,
        categoryId: expenseCategories[0].id,
        description: 'Supermarket shopping',
        amount: 500000,
        currency: 'PYG',
        date: new Date(),
      },
    }),
    prisma.expense.create({
      data: {
        tenantId: tenant.id,
        categoryId: expenseCategories[1].id,
        description: 'Taxi ride',
        amount: 50000,
        currency: 'PYG',
        date: new Date(),
      },
    }),
  ])
  console.log(`Created ${expenses.length} expenses`)

  // Create sample income
  const incomes = await Promise.all([
    prisma.income.create({
      data: {
        tenantId: tenant.id,
        categoryId: incomeCategories[0].id,
        description: 'Monthly salary',
        amount: 5000000,
        currency: 'PYG',
        date: new Date(),
      },
    }),
  ])
  console.log(`Created ${incomes.length} income entries`)

  // Create fixed expenses
  const fixedExpenses = await Promise.all([
    prisma.fixedExpense.create({
      data: {
        tenantId: tenant.id,
        categoryId: expenseCategories[2].id,
        description: 'Rent',
        amount: 1500000,
        currency: 'PYG',
        frequency: 'monthly',
        startDate: new Date(),
      },
    }),
    prisma.fixedExpense.create({
      data: {
        tenantId: tenant.id,
        categoryId: expenseCategories[2].id,
        description: 'Internet',
        amount: 200000,
        currency: 'PYG',
        frequency: 'monthly',
        startDate: new Date(),
      },
    }),
  ])
  console.log(`Created ${fixedExpenses.length} fixed expenses`)

  // Create purchases
  const purchases = await Promise.all([
    prisma.purchase.create({
      data: {
        tenantId: tenant.id,
        description: 'Weekly groceries',
        amount: 350000,
        currency: 'PYG',
        store: 'SuperMercado',
        date: new Date(),
      },
    }),
    prisma.purchase.create({
      data: {
        tenantId: tenant.id,
        description: 'Coffee',
        amount: 15000,
        currency: 'PYG',
        store: 'Cafe Central',
        date: new Date(),
      },
    }),
  ])
  console.log(`Created ${purchases.length} purchases`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
