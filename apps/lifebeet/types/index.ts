import { Expense, Income, Category, FixedExpense, VariableExpense, Purchase } from '@prisma/client'

export type ExpenseWithCategory = Expense & {
  category: Category
}

export type IncomeWithCategory = Income & {
  category: Category
}

export type FixedExpenseWithCategory = FixedExpense & {
  category: Category
}

export type VariableExpenseWithCategory = VariableExpense & {
  category: Category
}
