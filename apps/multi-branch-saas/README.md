# 🏢 Next.js Multi-Branch Boilerplate

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Production-ready Next.js 16 boilerplate for building multi-branch SaaS applications.** Enterprise-grade RBAC, audit logging, real-time collaboration, and hierarchical organization management—all in one powerful starter template.

**Launch your multi-location business faster.** Skip months of foundational work and start building features that matter.

---

## 📊 At a Glance

| Category               | Features                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **🔐 Auth & Security** | Supabase Auth • Row-Level Security • RBAC (96 permissions) • Password Reset • Email Notifications          |
| **🏗️ Architecture**    | Multi-branch Hierarchy • Soft Delete Pattern • Audit Trail (8 tables) • Server Components • Server Actions |
| **⚡ Real-time**       | Live Data Sync • WebSocket Updates • Collaborative Editing • Toast Notifications                           |
| **📁 File Management** | Avatar Upload • Logo Upload • Supabase Storage • Image Optimization                                        |
| **🧪 Testing**         | Playwright E2E (16 tests) • Vitest Unit Tests • Coverage Reports • CI/CD Ready                             |
| **🎨 UI/UX**           | Dark/Light Mode • Responsive Design • shadcn/ui • Tailwind CSS 4 • Professional Themes                     |
| **📧 Email**           | Transactional Emails • React Email Templates • Welcome • Password Reset • Role Changes                     |
| **🛠️ Developer Tools** | Permission Matrix • Sample Data Seeding • Database Reset • TypeScript • ESLint                             |

---

## 🎯 The Problem

Building a multi-location SaaS application requires solving the same foundational challenges every time:

- **Complex RBAC**: Managing permissions across organizational hierarchies (HQ → Branch → Sub-branch) is tedious and error-prone
- **Audit Requirements**: Compliance and business needs demand complete tracking of who did what and when
- **Real-time Collaboration**: Modern users expect instant updates without manual refreshes
- **Security First**: Implementing proper RLS, authentication, and authorization takes weeks
- **Boilerplate Fatigue**: Setting up auth, file uploads, email, testing infrastructure eats 40-60% of early development time

Most teams spend **2-3 months** on these foundations before building actual business features.

---

## ✨ The Solution

**Next.js Multi-Branch Boilerplate** provides everything you need to launch a production-ready multi-location application in days, not months.

### ⏱️ Time Savings Breakdown

| Task                                  | Typical Time | With Boilerplate  | Saved               |
| ------------------------------------- | ------------ | ----------------- | ------------------- |
| Auth setup (Supabase + RLS)           | 1-2 weeks    | 5 minutes         | **~10 days**        |
| RBAC system (6 roles, 96 permissions) | 3-4 weeks    | Pre-configured    | **~21 days**        |
| Audit logging (8 tables, soft delete) | 1-2 weeks    | Built-in          | **~10 days**        |
| Real-time updates infrastructure      | 1 week       | Hooks ready       | **~5 days**         |
| File upload system                    | 3-5 days     | Integrated        | **~4 days**         |
| Email system (templates + sending)    | 1 week       | 4 templates ready | **~5 days**         |
| E2E + Unit testing setup              | 1 week       | Configured        | **~5 days**         |
| **Total saved**                       | **~60 days** | **~30 minutes**   | **Save 2-3 months** |

### 🎁 What You Get

- **Complete authentication flow** with Supabase Auth
- **6 pre-configured roles** (Super Admin → Regular User) with 96 granular permissions
- **Hierarchical branch system** supporting HQ → Branch → Sub-branch organizational structures
- **Complete audit trail** with soft deletes across all entities
- **Real-time collaboration** with WebSocket-powered live updates
- **File upload system** for avatars and logos with Supabase Storage
- **Email notification system** with 4 professional React Email templates
- **E2E test suite** with 16 Playwright tests covering major workflows
- **Developer admin tools** for permission management and data seeding
- **Modern UI** with dark/light themes and responsive design

---

## 🚀 Features Deep Dive

### 1. 🔐 Enterprise Authentication & RBAC

**96 Granular Permissions** organized into 4 scopes:

- **CREATE**: Control who can create new entities (users, branches, tickets, etc.)
- **READ**: Manage data visibility across organizational hierarchy
- **UPDATE**: Fine-tune edit permissions for different user levels
- **DELETE**: Secure deletion rights with soft-delete audit trail

**6 Role Levels** with inheritance:

```
1. SUPER_ADMIN    → Full system access (level 100)
2. GENERAL_MANAGER → Cross-branch management (level 80)
3. BRANCH_MANAGER  → Branch administration (level 60)
4. STAFF_ADMIN     → Branch staff management (level 40)
5. TECHNICIAN      → Field operations (level 20)
6. USER            → Basic access (level 10)
```

**Features**:

- Row-Level Security (RLS) at database layer
- Branch-scoped data access (users only see their branch hierarchy)
- Permission inheritance (higher roles include lower role permissions)
- Dynamic permission checking in UI and server actions
- Email notifications on role changes

---

### 2. 🌳 Multi-Branch Hierarchy Management

**Organizational Structure**:

```
Headquarters (HQ)
├── Branch A (BRANCH)
│   ├── Sub-Branch A1 (SUB_BRANCH)
│   └── Sub-Branch A2 (SUB_BRANCH)
├── Branch B (BRANCH)
│   └── Sub-Branch B1 (SUB_BRANCH)
└── Branch C (BRANCH)
```

**Features**:

- **Unlimited depth** (HQ → Branch → Sub-branch → Sub-sub-branch...)
- **Cascade permissions** (managers see their branch + all children)
- **Location-based filtering** (users, tickets, inventory all branch-scoped)
- **Branch logos** with Supabase Storage integration
- **Hierarchical visualization** with collapsible tree UI
- **Soft delete protection** (can't delete branch with active users/sub-branches)

---

### 3. 📊 Complete Audit Trail System

**ERP-Integration Ready** with who/when/what tracking on **8 core tables**:

| Table              | Audit Fields                                                     |
| ------------------ | ---------------------------------------------------------------- |
| `users`            | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `profiles`         | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `branches`         | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `roles`            | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `permissions`      | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `role_permissions` | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `user_roles`       | createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt |
| `audit_logs`       | userId, action, resource, timestamp, metadata                    |

**Features**:

- **Soft delete pattern** (data never truly deleted, only marked)
- **Complete history** (every create/update/delete tracked with user + timestamp)
- **Audit log table** for sensitive operations (login, permission changes, etc.)
- **Compliance ready** (SOC 2, HIPAA, GDPR tracking capabilities)
- **Restore functionality** (can undo soft deletes)
- **Prisma helpers** (`createAuditData`, `updateAuditData`, `softDelete`)

---

### 4. 🔄 Real-time Collaboration

**Live Data Synchronization** powered by Supabase Realtime:

**Implemented Hooks**:

```typescript
// Users table real-time updates
useRealtimeUsers(onInsert, onUpdate, onDelete)

// Branches table real-time updates
useRealtimeBranches(onInsert, onUpdate, onDelete)
```

**Features**:

- **Instant updates** across all connected clients
- **Toast notifications** on CREATE/UPDATE/DELETE operations
- **Automatic re-fetch** to sync local state
- **Optimistic updates** for immediate UI feedback
- **Multi-user collaboration** (see changes as they happen)
- **WebSocket connection** (no polling overhead)
- **Automatic cleanup** on component unmount

**Example Use Cases**:

- Admin creates user → All users see new entry instantly
- Manager updates branch → Everyone sees changes live
- User gets role changed → Notification appears immediately

---

### 5. 📁 File Upload & Storage

**Supabase Storage Integration** with security and optimization:

**Supported Uploads**:

- **User Avatars**: Profile pictures (max 2MB, JPG/PNG/WebP)
- **Branch Logos**: Organization branding (max 2MB, JPG/PNG/WebP/SVG)

**Features**:

- **Client-side validation** (file type, size)
- **Server-side validation** (double-check security)
- **Automatic image optimization** (resize, compress)
- **Storage buckets** with RLS policies
- **Public URLs** for avatars/logos
- **Replace functionality** (update without breaking references)
- **Storage cleanup** on user/branch deletion

**Security**:

- RLS policies ensure users can only upload to their own profile
- File type whitelist prevents malicious uploads
- Size limits prevent abuse
- Signed URLs for temporary access

---

### 6. 📧 Email Notification System

**Transactional Emails** with React Email + Resend:

**4 Professional Templates**:

1. **Welcome Email** → Sent on user creation
2. **Password Reset Email** → Forgot password flow
3. **Role Changed Email** → Role assignment updates (shows added/removed roles)
4. **Account Status Changed Email** → Account activation/suspension

**Features**:

- **React Email** for template building (component-based)
- **Resend** for reliable delivery (99%+ deliverability)
- **Professional design** with gradient headers, badges, responsive layout
- **Non-blocking sends** (email failures don't break user operations)
- **Smart change detection** (only sends if data actually changed)
- **Customizable support email** in templates
- **HTML + plain text** versions

**Developer Experience**:

```typescript
// Simple API
await sendWelcomeEmail({ to, userName, userEmail })
await sendRoleChangedEmail({ to, userName, oldRoles, newRoles, changedBy })
await sendAccountStatusChangedEmail({ to, userName, newStatus, changedBy })
```

---

### 7. 🧪 Comprehensive Testing Infrastructure

**E2E Testing** with Playwright:

**16 Test Cases** across 3 suites:

- **Audit Logging** (7 tests): Admin access, CRUD logging, filtering, search, pagination
- **File Upload** (5 tests): Validation, avatar upload, logo upload, replace functionality
- **Real-time Updates** (4 tests): Multi-user sync, create/update/delete events, rapid updates

**Unit Testing** with Vitest:

- React Testing Library integration
- Component unit tests
- Utility function tests
- Coverage reports with `--coverage` flag

**Features**:

- **Multi-browser support** (Chromium, Firefox, WebKit)
- **Parallel execution** for faster test runs
- **Video recording** on failures
- **Screenshot capture** for debugging
- **Test fixtures** for auth and database state
- **CI/CD ready** (GitHub Actions compatible)

**Test Commands**:

```bash
npm test              # Run all E2E tests
npm run test:ui       # Interactive UI mode
npm run test:headed   # Watch tests run in browser
npm run test:debug    # Debug mode with pauses

npm run test:unit              # Run unit tests
npm run test:unit:watch        # Watch mode
npm run test:unit:coverage     # Generate coverage report
```

---

### 8. 🛠️ Admin Developer Tools

**Developer Control Panel** at `/admin/dev-tools` (Super Admin only):

**3 Powerful Tools**:

#### Permission Matrix

- Visual grid (roles × permissions)
- Toggle switches for each permission
- Grouped by resource (users, branches, roles, etc.)
- Save changes with audit logging
- Real-time validation

#### Sample Data Seeding

**10 Test Users** with realistic patterns:

```
gm@test.com           → General Manager
bm_mlg@test.com       → Branch Manager (Malang)
bm_jog@test.com       → Branch Manager (Jogja)
sa_mlg@test.com       → Staff Admin (Malang)
tech_mlg@test.com     → Technician (Malang)
tech_jog@test.com     → Technician (Jogja)
user_mlg@test.com     → Regular User (Malang)
user_jog@test.com     → Regular User (Jogja)
```

**3 Test Branches**: Malang (HQ), Jogja (Branch), Jogja Sub (Sub-branch)
**All passwords**: `test1234`

#### Database Reset

- Deletes all test data
- **Preserves Super Admin + HQ branch**
- Type `RESET` to confirm (safety check)
- Logs all deletions in audit trail

**Safety Features**:

- Super Admin access only
- Type-to-confirm for destructive actions
- Audit logging on all operations
- Clear warning messages

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - App Router, Server Components, Server Actions, React 19
- **TypeScript 5** - Type safety and better DX
- **Tailwind CSS 4** - Utility-first styling (latest version)
- **shadcn/ui** - Accessible component library built on Radix UI
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Performant form handling with validation
- **Zod 4** - Schema validation for forms and APIs
- **TanStack Query** - Server state management and caching
- **next-themes** - Dark/light mode with system preference support

### Backend

- **Prisma 6** - Type-safe ORM with PostgreSQL
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File storage with RLS
- **Supabase Realtime** - WebSocket-based live updates
- **bcrypt** - Password hashing (via Supabase)
- **Row-Level Security (RLS)** - Database-level access control

### Email & Communication

- **Resend** - Transactional email delivery
- **React Email** - Component-based email templates
- **Sonner** - Toast notifications

### DevOps & Testing

- **Playwright** - E2E testing framework
- **Vitest** - Unit testing with React Testing Library
- **ESLint 9** - Code linting with Next.js config
- **Prettier** - Code formatting with Tailwind plugin
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files
- **GitHub Actions** - CI/CD ready

### Developer Experience

- **tsx** - TypeScript execution for scripts and seeding
- **Prisma Studio** - Visual database browser
- **dotenv** - Environment variable management
- **TypeScript** strict mode for maximum type safety

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (20 recommended)
- **npm** or **pnpm** (pnpm recommended for speed)
- **PostgreSQL** database (or Supabase project)
- **Git** for version control

### 5-Minute Setup

#### 1️⃣ Clone and Install

```bash
# Clone the repository
git clone https://github.com/aguswirajati/nextjs-multi-branch-boilerplate.git
cd nextjs-multi-branch-boilerplate

# Install dependencies (faster with pnpm)
pnpm install
# or npm install
```

#### 2️⃣ Setup Environment Variables

```bash
# Copy the environment template
cp .env.example .env
```

**Edit `.env` and configure:**

```bash
# Database (Supabase or local PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Supabase (get from https://app.supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# App URL (for email links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Resend - get from https://resend.com/api-keys)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

#### 3️⃣ Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (creates Super Admin + HQ)
npx prisma db seed
```

**Default Super Admin credentials:**

- Email: `admin@repairshop.com`
- Password: `Admin123!`

#### 4️⃣ Run Development Server

```bash
npm run dev
# or pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and login with Super Admin credentials.

#### 5️⃣ Explore Admin Dev Tools (Optional)

1. Login as Super Admin
2. Navigate to `/admin/dev-tools` (orange "Dev Tools" link in nav)
3. **Seed Sample Data** → Click "Generate Sample Data"
4. **Explore Permission Matrix** → See RBAC configuration
5. Test with different user roles (see seeded users in Database Reset tab)

---

## 🔧 Common Setup Issues

### Issue: Database connection fails

**Problem**: `Error: P1001: Can't reach database server`

**Solution**:

```bash
# Check if PostgreSQL is running
psql -U postgres

# Or start Supabase local instance
supabase start

# Update DATABASE_URL in .env to match your setup
```

---

### Issue: Supabase auth errors

**Problem**: `Invalid API key` or auth not working

**Solution**:

1. Verify Supabase credentials in `.env`
2. Ensure you're using **anon key** for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Use **service role key** for `SUPABASE_SERVICE_ROLE_KEY`
4. Check RLS policies are created (see `prisma/migrations`)

---

### Issue: Email not sending

**Problem**: Welcome emails not arriving

**Solution**:

1. Verify `RESEND_API_KEY` in `.env` (get from [resend.com](https://resend.com))
2. Check `RESEND_FROM_EMAIL` is verified domain or use `onboarding@resend.dev` for testing
3. Check console for email errors (emails are non-blocking, won't break user creation)

---

### Issue: Build fails with TypeScript errors

**Problem**: Build errors on `npm run build`

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Try build again
npm run build
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx prisma generate            # Generate Prisma client
npx prisma migrate dev         # Run migrations
npx prisma db seed             # Seed initial data
npx prisma studio              # Open Prisma Studio (GUI)

# Testing
npm test                       # Run E2E tests (Playwright)
npm run test:ui                # E2E tests in UI mode
npm run test:headed            # E2E tests in headed browser
npm run test:debug             # Debug E2E tests

npm run test:unit              # Run unit tests (Vitest)
npm run test:unit:watch        # Unit tests in watch mode
npm run test:unit:ui           # Unit tests in UI mode
npm run test:unit:coverage     # Generate coverage report

# Code Quality
npm run lint                   # Run ESLint
npm run format                 # Format code with Prettier
npm run format:check           # Check code formatting

# Custom Scripts
npm run workflow               # Run custom workflow script
```

---

## 📁 Project Structure

```
nextjs-multi-branch-boilerplate/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register, etc.)
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── admin/                # Admin-only routes
│   │   │   ├── users/            # User management
│   │   │   ├── branches/         # Branch management
│   │   │   ├── audit-logs/       # Audit log viewer
│   │   │   └── dev-tools/        # Developer tools (Super Admin only)
│   │   └── dashboard/            # Dashboard home (stats, activity)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── features/                     # Feature modules (domain-driven design)
│   ├── auth/                     # Authentication
│   │   ├── actions/              # Server actions (login, logout, register)
│   │   ├── components/           # Auth forms and UI
│   │   └── utils/                # Auth helpers
│   ├── users/                    # User management
│   │   ├── actions/              # User CRUD actions
│   │   ├── components/           # User table, forms, detail view
│   │   ├── services/             # User business logic
│   │   └── types/                # User TypeScript types
│   ├── branches/                 # Branch management
│   │   ├── actions/              # Branch CRUD actions
│   │   ├── components/           # Branch hierarchy tree, forms
│   │   ├── services/             # Branch business logic
│   │   └── types/                # Branch TypeScript types
│   ├── audit/                    # Audit logging
│   │   ├── actions/              # Audit log retrieval
│   │   ├── components/           # Audit log table and filters
│   │   └── services/             # Audit log services
│   ├── admin/                    # Admin tools
│   │   ├── actions/              # Dev tools actions
│   │   └── components/           # Permission matrix, data seeding
│   └── dashboard/                # Dashboard widgets
│       ├── actions/              # Dashboard data actions
│       ├── components/           # Stats cards, activity feed
│       └── services/             # Dashboard services
│
├── lib/                          # Shared utilities and configuration
│   ├── supabase/                 # Supabase client (server + client)
│   ├── prisma/                   # Prisma client instance
│   ├── rbac/                     # RBAC utilities (permission checking)
│   ├── email/                    # Email sending and templates
│   │   ├── templates/            # React Email templates
│   │   └── send-email.ts         # Email sending functions
│   ├── validation/               # Zod schemas for forms and APIs
│   ├── utils/                    # Generic utilities
│   │   ├── prisma-helpers.ts     # Audit trail helpers
│   │   └── cn.ts                 # Class name utility
│   ├── hooks/                    # React hooks
│   │   ├── useRealtimeUsers.ts   # Real-time user updates
│   │   └── useRealtimeBranches.ts # Real-time branch updates
│   └── generated/                # Prisma generated types
│
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components (button, input, etc.)
│   ├── layout/                   # Layout components (nav, sidebar)
│   ├── theme/                    # Theme provider and toggle
│   └── providers/                # React context providers
│
├── prisma/                       # Database
│   ├── schema.prisma             # Prisma schema (8 tables + RLS)
│   ├── migrations/               # Database migration history
│   └── seed.ts                   # Seed script (Super Admin + HQ)
│
├── tests/                        # E2E tests
│   ├── helpers/                  # Test utilities (auth helper)
│   ├── audit-logging.spec.ts     # Audit logging tests (7 tests)
│   ├── file-upload.spec.ts       # File upload tests (5 tests)
│   └── realtime-updates.spec.ts  # Real-time tests (4 tests)
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── API.md                    # API reference
│   ├── SECURITY.md               # Security guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── CODE_STYLE.md             # Code conventions
│
├── .env.example                  # Environment variable template
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── playwright.config.ts          # Playwright E2E test config
├── vitest.config.ts              # Vitest unit test config
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## 💼 Use Cases

This boilerplate is perfect for:

### 1. 🏪 Retail Chain Management

**Scenario**: Retail company with HQ, 20 regional branches, and 100+ sub-stores

**How it helps**:

- Branch hierarchy maps to physical locations
- Regional managers see their entire region (cascade permissions)
- Store managers see only their store
- Inventory, sales, staff all branch-scoped
- Real-time updates across locations

---

### 2. 🏥 Healthcare Network

**Scenario**: Hospital network with central admin, regional hospitals, and clinics

**How it helps**:

- RBAC controls who accesses patient data
- Audit trail for HIPAA compliance
- Branch-scoped patient records
- Role-based access (doctors, nurses, admin)
- Email notifications for critical updates

---

### 3. 🎓 Education Management System

**Scenario**: University with main campus, satellite campuses, and departments

**How it helps**:

- Multi-campus organization structure
- Role hierarchy (admin, dean, faculty, student)
- Audit trail for grade changes
- Real-time enrollment updates
- Email notifications for announcements

---

### 4. 🏢 Enterprise SaaS Platform

**Scenario**: B2B SaaS with multiple customer organizations

**How it helps**:

- Each customer = HQ branch
- Customers manage their own sub-branches
- RBAC isolates customer data
- Audit trail for compliance (SOC 2, ISO)
- Real-time collaboration within organization

---

### 5. 🚚 Logistics & Delivery Network

**Scenario**: Delivery company with warehouses, distribution centers, and hubs

**How it helps**:

- Location-based order routing
- Branch-scoped driver assignments
- Real-time delivery status updates
- Hierarchical reporting (hub → region → HQ)
- Email notifications for delivery events

---

### 6. 🏗️ Construction Project Management

**Scenario**: Construction firm with multiple ongoing projects and sites

**How it helps**:

- Project = branch, sites = sub-branches
- Role-based access (project manager, foreman, worker)
- Audit trail for change orders
- Real-time progress updates
- File uploads for blueprints/photos

---

## 📚 Documentation Hub

### Core Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design, patterns, and data flow
- **[API Reference](docs/API.md)** - Complete API documentation for all server actions and services
- **[Security Guide](docs/SECURITY.md)** - Security headers, RLS, RBAC, and best practices

### Deployment & Operations

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment to Vercel + Supabase
- **[Audit Trail Implementation](docs/AUDIT_TRAIL_IMPLEMENTATION_GUIDE.md)** - How audit logging works

### Development

- **[Code Style Guide](docs/CODE_STYLE.md)** - Code formatting, naming conventions, and patterns
- **[Workflow & Progress](docs/workflow.md)** - Development roadmap and completed tasks

### Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/discussions)

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aguswirajati/nextjs-multi-branch-boilerplate)

**Manual Deployment:**

1. **Push to GitHub**:

   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables (all values from `.env`)
   - Click "Deploy"

3. **Setup Supabase Production**:
   - Create production project at [app.supabase.com](https://app.supabase.com)
   - Run migrations: `npx prisma migrate deploy`
   - Update Vercel environment variables with production Supabase credentials

4. **Configure Email**:
   - Get production Resend API key
   - Update `RESEND_FROM_EMAIL` with verified domain
   - Update Vercel environment variables

**See full deployment guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements—all contributions are appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** (follow code style guide)
4. **Run tests** (`npm test` and `npm run test:unit`)
5. **Format code** (`npm run format`)
6. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
7. **Push to branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes (formatting)
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
```

### Development Guidelines

- Write TypeScript with strict type checking
- Add tests for new features
- Update documentation for breaking changes
- Follow existing code patterns and architecture
- Use Prettier for formatting
- Run `npm run lint` before committing

---

## 🗺️ Roadmap

### ✅ Completed (v1.0.0)

- [x] Multi-branch hierarchy system
- [x] Enterprise RBAC (96 permissions)
- [x] Complete audit trail (8 tables)
- [x] Real-time collaboration
- [x] File upload system
- [x] Email notification system
- [x] E2E + Unit testing
- [x] Admin developer tools
- [x] Dark/light theme
- [x] Comprehensive documentation

### 🚧 In Progress

- [ ] API rate limiting improvements
- [ ] Advanced audit log filtering
- [ ] Email digest notifications

### 🔮 Planned (v1.1.0)

- [ ] Multi-tenancy support (optional mode)
- [ ] Advanced reporting dashboard
- [ ] Export data (CSV, Excel, PDF)
- [ ] Two-factor authentication (2FA)
- [ ] API key management
- [ ] Webhook system
- [ ] Mobile-responsive improvements
- [ ] Notification preferences UI

### 💡 Future Considerations

- [ ] GraphQL API option
- [ ] Mobile app (React Native)
- [ ] Advanced caching strategies
- [ ] Internationalization (i18n)
- [ ] Custom branding per branch
- [ ] Integration marketplace

**Want to influence the roadmap?** Open a [discussion](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/discussions) or vote on existing feature requests!

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

**TL;DR**: You can use this boilerplate for personal or commercial projects, modify it, and distribute it freely. Attribution appreciated but not required.

---

## 👥 Credits

### Created by

- **Agus Wirajati** - [@aguswirajati](https://github.com/aguswirajati)
- **Claude Code** - AI pair programmer

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Resend](https://resend.com/) - Email delivery
- [Playwright](https://playwright.dev/) - E2E testing
- [Vitest](https://vitest.dev/) - Unit testing

### Special Thanks

- Vercel team for Next.js
- Supabase team for amazing BaaS platform
- shadcn for the beautiful UI components
- Open source community for all the amazing tools

---

## 🔗 Links

- **Documentation**: [docs/](docs/)
- **GitHub Repository**: [nextjs-multi-branch-boilerplate](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate)
- **Issues**: [Report a bug](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues)
- **Discussions**: [Ask questions](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/discussions)
- **Author**: [@aguswirajati](https://github.com/aguswirajati)

---

<div align="center">

**Built with ❤️ using Next.js 16 • React 19 • TypeScript • Prisma • Supabase • Tailwind CSS**

**⭐ Star this repo if you find it useful!**

[Report Bug](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues) • [Request Feature](https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues) • [Documentation](docs/)

</div>
