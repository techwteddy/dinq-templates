# Lifebeet API Documentation

## Overview

Lifebeet uses Next.js App Router with Server Components for SSR. Most data fetching happens on the server side using Prisma ORM.

## Authentication

Authentication is handled by Supabase Auth. All authenticated routes are protected by middleware.

### Public Routes
- `/auth/login` - Login page
- `/auth/signup` - Registration page

### Protected Routes
All other routes require authentication and redirect to `/auth/login` if not authenticated.

## Data Models

### Tenant
Multi-tenant isolation. Each organization has its own tenant.

```typescript
{
  id: string
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### User
Users belong to tenants.

```typescript
{
  id: string
  email: string
  name: string?
  tenantId: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Category
Categories for expenses and income.

```typescript
{
  id: string
  tenantId: string
  name: string
  type: 'expense' | 'income'
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Expense
General expenses.

```typescript
{
  id: string
  tenantId: string
  categoryId: string
  description: string
  amount: number
  currency: 'USD' | 'PYG'
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Income
Income entries.

```typescript
{
  id: string
  tenantId: string
  categoryId: string
  description: string
  amount: number
  currency: 'USD' | 'PYG'
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### FixedExpense
Recurring fixed expenses (rent, subscriptions).

```typescript
{
  id: string
  tenantId: string
  categoryId: string
  description: string
  amount: number
  currency: 'USD' | 'PYG'
  frequency: 'monthly' | 'yearly'
  startDate: DateTime
  endDate: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### VariableExpense
Variable recurring expenses.

```typescript
{
  id: string
  tenantId: string
  categoryId: string
  description: string
  amount: number
  currency: 'USD' | 'PYG'
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Purchase
Store purchases.

```typescript
{
  id: string
  tenantId: string
  description: string
  amount: number
  currency: 'USD' | 'PYG'
  store: string?
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### ExchangeRate
Historical exchange rates for currency conversion.

```typescript
{
  id: string
  tenantId: string
  fromCurrency: 'USD' | 'PYG'
  toCurrency: 'USD' | 'PYG'
  rate: number
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Comparison
Period-based financial comparisons.

```typescript
{
  id: string
  tenantId: string
  name: string
  description: string?
  period: 'monthly' | 'yearly'
  startDate: DateTime
  endDate: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Currency Utilities

### getLatestExchangeRate
```typescript
async function getLatestExchangeRate(
  tenantId: string,
  fromCurrency: 'USD' | 'PYG' = 'USD',
  toCurrency: 'USD' | 'PYG' = 'PYG'
): Promise<number>
```

Gets the latest exchange rate for the specified currencies.

### convertCurrency
```typescript
async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  tenantId: string
): Promise<number>
```

Converts an amount from one currency to another using the latest exchange rate.

### formatCurrency
```typescript
function formatCurrency(amount: number, currency: string): string
```

Formats a number as currency with proper locale formatting.

## Pages

### Dashboard (`/dashboard`)
Shows financial overview:
- Total income
- Total expenses
- Balance
- Recent transactions
- Current exchange rate

**Server Component**: Yes
**Data fetching**: Server-side with Prisma

### Expenses (`/expenses`)
Manage all types of expenses:
- All expenses list
- Fixed expenses (recurring)
- Variable expenses

**Server Component**: Yes
**Data fetching**: Server-side with Prisma

### Income (`/income`)
Track income sources:
- All income list
- Income by month breakdown

**Server Component**: Yes
**Data fetching**: Server-side with Prisma

### Purchases (`/purchases`)
Monitor purchases:
- All purchases list
- Purchases grouped by store

**Server Component**: Yes
**Data fetching**: Server-side with Prisma

### Settings (`/settings`)
Tenant management:
- Tenant information
- User management
- Category management
- Exchange rate management

**Server Component**: Yes
**Data fetching**: Server-side with Prisma

## Security

### Row Level Security (RLS)
All database tables have RLS policies that ensure:
- Users can only access data from their own tenant
- Complete data isolation between tenants
- Secure multi-tenant architecture

### Middleware Protection
The middleware checks authentication on every request and:
- Redirects unauthenticated users to `/auth/login`
- Redirects authenticated users away from auth pages to `/dashboard`
- Refreshes Supabase sessions automatically

## Future API Routes

The following API routes can be added for client-side interactions:

- `POST /api/expenses` - Create expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense
- `POST /api/income` - Create income
- `PUT /api/income/[id]` - Update income
- `DELETE /api/income/[id]` - Delete income
- `POST /api/purchases` - Create purchase
- `PUT /api/purchases/[id]` - Update purchase
- `DELETE /api/purchases/[id]` - Delete purchase
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `POST /api/exchange-rates` - Create exchange rate
- `GET /api/exchange-rates/latest` - Get latest rate

## Development Guidelines

1. **Always use Server Components by default**
2. **Use Client Components only when needed** (forms, interactivity)
3. **Fetch data on the server** to reduce client-side JavaScript
4. **Enforce tenant isolation** in all database queries
5. **Use TypeScript types** from Prisma for type safety
6. **Format currency properly** using the utility functions
7. **Handle errors gracefully** with proper error boundaries
