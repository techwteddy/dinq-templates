# Lifebeet Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js 15 Frontend (SSR + CSR)             │  │
│  │  ┌────────────┬────────────┬────────────────────┐    │  │
│  │  │ Auth Pages │ Dashboard  │ Management Pages   │    │  │
│  │  │ - Login    │ - Overview │ - Expenses         │    │  │
│  │  │ - Signup   │ - Stats    │ - Income           │    │  │
│  │  │            │            │ - Purchases        │    │  │
│  │  │            │            │ - Settings         │    │  │
│  │  └────────────┴────────────┴────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Middleware Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Authentication Check                               │  │
│  │  • Session Refresh (Supabase)                        │  │
│  │  • Route Protection                                   │  │
│  │  • Redirect Logic                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Supabase Auth   │          │  Server Actions  │
│  ┌────────────┐  │          │  ┌────────────┐  │
│  │ Sign Up    │  │          │  │ Prisma ORM │  │
│  │ Sign In    │  │          │  │  Queries   │  │
│  │ Sign Out   │  │          │  └────────────┘  │
│  │ Session    │  │          └────────┬─────────┘
│  └────────────┘  │                   │
└──────────────────┘                   │
                                       ▼
                        ┌──────────────────────────┐
                        │   Supabase PostgreSQL    │
                        │  ┌────────────────────┐  │
                        │  │ Multi-Tenant Data  │  │
                        │  │ • Tenants          │  │
                        │  │ • Users            │  │
                        │  │ • Categories       │  │
                        │  │ • Expenses         │  │
                        │  │ • Income           │  │
                        │  │ • Purchases        │  │
                        │  │ • Exchange Rates   │  │
                        │  │ • Comparisons      │  │
                        │  └────────────────────┘  │
                        │  Row Level Security (RLS)│
                        └──────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User → Login Form → Supabase Auth → Session Cookie → Protected Routes
```

### Data Fetching Flow (Server-Side)
```
1. User Request → Middleware (Auth Check)
2. Server Component → Supabase Session
3. Get User → Prisma Query (with tenantId)
4. Database → Filtered Data (RLS)
5. Server Component → Rendered HTML
6. Browser → Display
```

### Multi-Tenant Isolation
```
User Login
    ↓
Get User Email
    ↓
Find User in Database → Get tenantId
    ↓
All Queries Include: WHERE tenantId = user.tenantId
    ↓
RLS Enforces: Only see own tenant's data
```

## Technology Stack

### Frontend Layer
```
┌─────────────────────────────────────────┐
│  Next.js 15 (React 19)                  │
│  ├─ App Router                          │
│  ├─ Server Components (Default)        │
│  ├─ Client Components (Forms, UI)      │
│  └─ Middleware (Auth Protection)       │
└─────────────────────────────────────────┘
         │
         ├─ Styling: Tailwind CSS v3
         ├─ Components: DaisyUI
         └─ TypeScript: Type Safety
```

### Backend Layer
```
┌─────────────────────────────────────────┐
│  Supabase                               │
│  ├─ Authentication (JWT)                │
│  ├─ PostgreSQL Database                 │
│  └─ Row Level Security                  │
└─────────────────────────────────────────┘
         │
         ├─ ORM: Prisma
         ├─ Schema Management: Prisma Migrate
         └─ Type Generation: Prisma Client
```

## Database Schema Relationships

```
Tenant (Organization)
  ├── 1:N → Users
  ├── 1:N → Categories
  │            ├── 1:N → Expenses
  │            ├── 1:N → Income
  │            ├── 1:N → FixedExpenses
  │            └── 1:N → VariableExpenses
  ├── 1:N → Purchases
  ├── 1:N → ExchangeRates
  └── 1:N → Comparisons
```

## Page Hierarchy

```
/ (Root)
├── auth/
│   ├── login
│   └── signup
└── (protected)
    ├── dashboard       ← Default landing page
    ├── expenses
    │   ├── All expenses
    │   ├── Fixed expenses
    │   └── Variable expenses
    ├── income
    ├── purchases
    └── settings
        ├── Tenant info
        ├── Users
        ├── Categories
        └── Exchange rates
```

## Security Layers

```
1. Network Layer
   └─ HTTPS/TLS

2. Application Layer
   ├─ Next.js Middleware (Route Protection)
   └─ Supabase Auth (JWT Tokens)

3. API Layer
   └─ Server Components (No public API exposure)

4. Database Layer
   ├─ Row Level Security (Tenant Isolation)
   ├─ Prisma Type Safety
   └─ PostgreSQL Constraints
```

## Currency Conversion Flow

```
User Transaction (Amount + Currency)
        ↓
Check if conversion needed
        ↓
    ┌───Yes───┐         No → Store as-is
    ↓         ↓
Get Latest   Store
Exchange     Original
Rate         Amount
    ↓
Convert
Amount
    ↓
Store Both:
- Original (amount + currency)
- Converted (display)
```

## Component Architecture

```
App Layout (Root)
├── Navigation Component
│   ├── Menu Items
│   └── Theme Toggle (DaisyUI)
└── Page Content
    ├── Server Component (Data Fetching)
    │   └── Prisma Queries with tenantId
    └── Client Components (Interactivity)
        ├── Forms
        ├── Modals
        └── Interactive Tables
```

## Development Workflow

```
1. Code Changes
   ↓
2. TypeScript Compilation
   ↓
3. Prisma Type Generation
   ↓
4. Next.js Build (Turbopack)
   ↓
5. Server-Side Rendering
   ↓
6. Client Hydration
```

## Deployment Architecture

```
Source Code (GitHub)
    ↓
CI/CD (GitHub Actions)
    ├─ Install Dependencies
    ├─ Generate Prisma Client
    ├─ TypeScript Check
    └─ Build Next.js
         ↓
Deploy to Vercel
    ├─ Edge Functions (Middleware)
    ├─ Serverless Functions (API)
    └─ Static Assets (CDN)
         ↓
Production Environment
    ├─ Vercel Hosting
    └─ Supabase Database
```

## Key Features Implementation

### Multi-Tenancy
```
Every query includes:
WHERE tenantId = currentUser.tenantId

Database enforces with RLS:
CREATE POLICY "tenant_isolation"
  ON table_name
  USING (
    tenantId IN (
      SELECT tenantId FROM users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

### Authentication
```
Supabase Auth → JWT Token → HTTP-Only Cookie → Middleware Check
```

### Dark Mode
```
HTML attribute: data-theme="light|dark"
DaisyUI: Automatic theme switching
User Preference: Stored in browser
```

### Server-Side Rendering
```
All pages use Server Components by default
→ Data fetched on server
→ HTML rendered on server
→ Fast initial page load
→ SEO friendly
```

## Performance Optimizations

1. **Server Components**: Reduce client-side JavaScript
2. **Edge Middleware**: Fast authentication checks
3. **Database Indexing**: tenantId, userId indexes
4. **Caching**: Static generation where possible
5. **Image Optimization**: Next.js built-in
6. **Code Splitting**: Automatic by Next.js
7. **Turbopack**: Fast development builds

## Monitoring & Observability

```
Application Logs
    ↓
Vercel Analytics
    ↓
Supabase Dashboard
    ├─ Auth Metrics
    ├─ Database Performance
    └─ API Usage
```

---

This architecture provides:
- ✅ Scalability (Multi-tenant)
- ✅ Security (RLS + Auth)
- ✅ Performance (SSR + Edge)
- ✅ Developer Experience (TypeScript + Prisma)
- ✅ Maintainability (Clear separation of concerns)
