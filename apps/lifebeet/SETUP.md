# Lifebeet Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- npm or yarn

## Installation Steps

### 1. Clone the repository

```bash
git clone <repository-url>
cd lifebeet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
# Database URL from Supabase Project Settings > Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration from Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma db push
```

This will create all the necessary tables in your Supabase database:
- tenants
- users
- categories
- expenses
- incomes
- fixed_expenses
- variable_expenses
- purchases
- comparisons
- exchange_rates

### 7. (Optional) Seed the database

Create sample data for testing:

```bash
npx prisma db seed
```

### 8. Set up Supabase Authentication

In your Supabase dashboard:

1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates if needed

### 9. Set up Row Level Security (RLS)

Run the following SQL in Supabase SQL Editor to enable RLS:

```sql
-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE variable_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for multi-tenant access
-- Users can only see their own tenant's data

-- Tenants policy
CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  USING (id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Users policy
CREATE POLICY "Users can view users in their tenant"
  ON users FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Categories policy
CREATE POLICY "Users can view categories in their tenant"
  ON categories FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Expenses policy
CREATE POLICY "Users can manage expenses in their tenant"
  ON expenses FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Income policy
CREATE POLICY "Users can manage income in their tenant"
  ON incomes FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Fixed expenses policy
CREATE POLICY "Users can manage fixed expenses in their tenant"
  ON fixed_expenses FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Variable expenses policy
CREATE POLICY "Users can manage variable expenses in their tenant"
  ON variable_expenses FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Purchases policy
CREATE POLICY "Users can manage purchases in their tenant"
  ON purchases FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Comparisons policy
CREATE POLICY "Users can manage comparisons in their tenant"
  ON comparisons FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));

-- Exchange rates policy
CREATE POLICY "Users can manage exchange rates in their tenant"
  ON exchange_rates FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE email = auth.jwt() ->> 'email'
  ));
```

### 10. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 11. Build for production

```bash
npm run build
npm start
```

## Features

- **Multi-tenant architecture**: Each organization has its own isolated data
- **User authentication**: Powered by Supabase Auth
- **Expense tracking**: Track regular, fixed, and variable expenses
- **Income management**: Record and categorize income sources
- **Purchase tracking**: Keep track of purchases by store
- **Currency conversion**: Automatic conversion between USD and PYG (Paraguayan Guaraní)
- **Exchange rate management**: Maintain historical exchange rates
- **Dark mode**: Built-in theme switcher
- **Server-side rendering**: Fast page loads with Next.js SSR
- **Row Level Security**: Tenant data is completely isolated

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Supabase**: Backend as a Service (Auth + PostgreSQL)
- **Prisma ORM**: Type-safe database access
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind component library
- **Server-Side Rendering**: Enabled by default for all pages

## Project Structure

```
lifebeet/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── expenses/
│   ├── income/
│   ├── purchases/
│   ├── settings/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── Navigation.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── currency.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts
└── package.json
```

## Troubleshooting

### Database connection issues

Make sure your `DATABASE_URL` is correct and your Supabase project is running.

### Authentication not working

1. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
2. Verify email authentication is enabled in Supabase Dashboard
3. Check browser console for error messages

### Build errors

Run `npx prisma generate` to ensure the Prisma Client is up to date.

### RLS errors

Make sure you've run all the RLS policies in your Supabase SQL editor.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
