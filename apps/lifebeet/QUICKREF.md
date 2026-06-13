# Lifebeet Quick Reference

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Setup database (after configuring .env)
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed with sample data

# Development
npm run dev            # Start dev server (http://localhost:3000)
npm run db:studio      # Open Prisma Studio (database GUI)

# Docker (local PostgreSQL)
npm run docker:up      # Start PostgreSQL container
npm run docker:down    # Stop PostgreSQL container

# Production
npm run build          # Build for production
npm start              # Start production server
```

## 🐳 Docker Commands

```bash
# Pull latest image from GitHub Container Registry
docker pull ghcr.io/devpbeat/lifebeet:latest

# Run with Docker
docker run -d \
  --name lifebeet \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/devpbeat/lifebeet:latest

# Run with Docker Compose (production)
docker-compose -f docker-compose.prod.yml up -d

# Build local image
docker build -t lifebeet .

# View logs
docker logs -f lifebeet

# Stop container
docker stop lifebeet

# Remove container
docker rm lifebeet

# Execute commands in container
docker exec lifebeet npx prisma db push
docker exec lifebeet npx prisma db seed
```

## 📁 Project Structure

```
lifebeet/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── expenses/          # Expense management
│   ├── income/            # Income tracking
│   ├── purchases/         # Purchase tracking
│   └── settings/          # Tenant settings
├── components/            # React components
├── lib/                   # Utilities and configs
│   ├── supabase/         # Supabase client/server
│   ├── currency.ts       # Currency utilities
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema and seeds
├── types/                # TypeScript type definitions
└── middleware.ts         # Auth middleware
```

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://..."           # Supabase database URL
NEXT_PUBLIC_SUPABASE_URL="https://..."   # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."      # Supabase anon key
```

## 📊 Key Features

### Multi-Tenant
- Each organization has isolated data
- Tenant ID required for all queries
- Row Level Security enforced

### Currency Support
- **PYG** (Paraguayan Guaraní) - Primary
- **USD** (US Dollar) - Secondary
- Auto-conversion with exchange rates

### Authentication
- Email/password via Supabase
- Protected routes with middleware
- Automatic session refresh

## 🎨 UI/UX

### Theme Toggle
```jsx
// Dark mode controlled by DaisyUI
data-theme="light" or data-theme="dark"
```

### Components
- **Navigation** - Main navigation bar with theme toggle
- **Cards** - DaisyUI card components
- **Tables** - Zebra-striped tables
- **Forms** - Styled with DaisyUI input classes
- **Stats** - Dashboard statistics

## 🗃️ Database Models

```
Tenant (Organization)
├── Users (members)
├── Categories (expense/income)
├── Expenses
├── Income
├── FixedExpenses (recurring)
├── VariableExpenses
├── Purchases
├── ExchangeRates
└── Comparisons
```

## 🔐 Security

### RLS Policies
All tables enforce tenant isolation:
```sql
WHERE tenant_id IN (
  SELECT tenant_id FROM users 
  WHERE email = auth.jwt() ->> 'email'
)
```

### Middleware
- Protects all routes except `/auth/*`
- Redirects unauthenticated users
- Refreshes Supabase sessions

## 📱 Pages

| Route | Description | SSR |
|-------|-------------|-----|
| `/` | Redirects to dashboard | ✅ |
| `/auth/login` | Login page | ❌ |
| `/auth/signup` | Registration | ❌ |
| `/dashboard` | Financial overview | ✅ |
| `/expenses` | Expense management | ✅ |
| `/income` | Income tracking | ✅ |
| `/purchases` | Purchase tracking | ✅ |
| `/settings` | Tenant settings | ✅ |

## 🛠️ Common Tasks

### Add a new expense category
```typescript
await prisma.category.create({
  data: {
    name: 'Category Name',
    type: 'expense',
    tenantId: user.tenantId
  }
})
```

### Convert currency
```typescript
import { convertCurrency, formatCurrency } from '@/lib/currency'

const pygAmount = await convertCurrency(
  100,      // amount
  'USD',    // from
  'PYG',    // to
  tenantId
)

const formatted = formatCurrency(pygAmount, 'PYG')
```

### Create an expense
```typescript
await prisma.expense.create({
  data: {
    tenantId,
    categoryId,
    description: 'Groceries',
    amount: 500000,
    currency: 'PYG',
    date: new Date()
  }
})
```

### Update exchange rate
```typescript
await prisma.exchangeRate.create({
  data: {
    tenantId,
    fromCurrency: 'USD',
    toCurrency: 'PYG',
    rate: 7300,
    date: new Date()
  }
})
```

## 🐛 Troubleshooting

### Build fails
```bash
# Regenerate Prisma client
npm run db:generate

# Check TypeScript
npx tsc --noEmit
```

### Database connection error
```bash
# Check DATABASE_URL in .env
# Verify Supabase project is running
# Test connection with Prisma Studio
npm run db:studio
```

### Authentication not working
```bash
# Verify Supabase keys in .env
# Check Supabase dashboard > Authentication > Providers
# Clear browser cookies and try again
```

### Dark mode not working
```jsx
// Check html tag has data-theme attribute
<html lang="en" data-theme="light">
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com/)

## 💡 Tips

1. Use Server Components by default
2. Always include tenantId in queries
3. Use TypeScript types from Prisma
4. Test multi-tenant isolation
5. Format currency with utility functions
6. Handle errors gracefully
7. Keep components focused and small
8. Use meaningful commit messages
9. Document complex logic
10. Write reusable utilities

---

Need more help? Check:
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [API.md](./API.md) - API documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing guidelines
