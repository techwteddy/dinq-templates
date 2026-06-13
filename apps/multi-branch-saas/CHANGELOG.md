# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-26

### Initial Release

**Next.js Multi-Branch Boilerplate v1.0.0** - Production-ready boilerplate for building multi-branch SaaS applications with enterprise-grade features.

### Added

#### 🔐 Authentication & Authorization
- Supabase Auth integration with email/password authentication
- Row-Level Security (RLS) policies at database level
- Enterprise RBAC with 96 granular permissions across 4 scopes (CREATE, READ, UPDATE, DELETE)
- 6 role levels with inheritance (Super Admin, General Manager, Branch Manager, Staff Admin, Technician, User)
- Permission checking utilities for UI and server actions
- Dynamic permission-based UI rendering

#### 🌳 Multi-Branch Hierarchy
- Hierarchical organization structure (HQ → Branch → Sub-branch)
- Unlimited depth support for branch nesting
- Cascade permissions (managers see their branch + all children)
- Branch-scoped data access and filtering
- Branch logo upload with Supabase Storage
- Hierarchical tree visualization with collapsible UI
- Soft delete protection (prevent deletion of branches with active data)

#### 📊 Audit Trail System
- Complete audit trail on 8 core tables (users, profiles, branches, roles, permissions, role_permissions, user_roles, audit_logs)
- Soft delete pattern (data never truly deleted, only marked)
- Audit fields on all tables (createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)
- Audit log table for sensitive operations
- Prisma helpers for audit operations (createAuditData, updateAuditData, softDelete)
- Compliance-ready tracking (SOC 2, HIPAA, GDPR capabilities)

#### 🔄 Real-time Collaboration
- Supabase Realtime integration with WebSocket connections
- Real-time hooks (useRealtimeUsers, useRealtimeBranches)
- Live data synchronization across all connected clients
- Toast notifications on CREATE/UPDATE/DELETE operations
- Automatic re-fetch to sync local state
- Optimistic updates for immediate UI feedback
- Automatic cleanup on component unmount

#### 📁 File Upload & Storage
- Supabase Storage integration
- User avatar upload (max 2MB, JPG/PNG/WebP)
- Branch logo upload (max 2MB, JPG/PNG/WebP/SVG)
- Client-side and server-side validation
- RLS policies for secure storage access
- Replace functionality for updating files
- Storage cleanup on user/branch deletion

#### 📧 Email Notification System
- Resend integration for transactional emails
- React Email for component-based templates
- 4 professional email templates:
  - Welcome Email (on user creation)
  - Password Reset Email (forgot password flow)
  - Role Changed Email (role assignment updates with added/removed badges)
  - Account Status Changed Email (activation/suspension)
- Non-blocking email sends (failures don't break operations)
- Smart change detection (only send if data actually changed)
- Customizable support email in templates

#### 🧪 Testing Infrastructure
- Playwright E2E testing with 16 test cases across 3 suites:
  - Audit Logging (7 tests)
  - File Upload (5 tests)
  - Real-time Updates (4 tests)
- Vitest unit testing with React Testing Library
- Multi-browser support (Chromium, Firefox, WebKit)
- Parallel execution, video recording, screenshot capture
- Test fixtures for auth and database state
- Coverage reports with --coverage flag
- CI/CD ready configuration

#### 🛠️ Admin Developer Tools
- Developer control panel at `/admin/dev-tools` (Super Admin only)
- Permission Matrix for RBAC configuration
- Sample data seeding with 10 test users and 3 branches
- Database reset functionality (preserves Super Admin)
- Type-to-confirm for destructive actions
- Audit logging on all dev tool operations

#### 🎨 UI/UX Features
- Next.js 16 with App Router and Server Components
- React 19 with latest features
- Tailwind CSS 4 for styling
- shadcn/ui component library (Radix UI-based)
- Dark/light theme toggle with system preference support
- Responsive design for mobile and desktop
- Professional gradient themes
- Toast notifications with Sonner
- Loading states and error boundaries

#### 📚 Documentation
- Comprehensive README (900+ lines, 12 sections)
- Architecture documentation (system design, patterns)
- API reference (all server actions and services)
- Security guide (headers, RLS, RBAC)
- Deployment guide (Vercel + Supabase)
- Code style guide (conventions, patterns)
- Audit trail implementation guide
- Contributing guidelines
- MIT License

#### 🚀 Developer Experience
- TypeScript 5 with strict mode
- ESLint 9 with Next.js config
- Prettier with Tailwind plugin
- Husky git hooks for pre-commit checks
- lint-staged for staged file linting
- Prisma 6 ORM with PostgreSQL
- Environment variable template (.env.example)
- Scripts for development, testing, building

#### 📦 Project Structure
- Feature-based architecture (domain-driven design)
- Modular feature folders (auth, users, branches, audit, admin, dashboard)
- Shared utilities and configurations in lib/
- Reusable UI components in components/
- E2E tests in tests/
- Comprehensive documentation in docs/

### Technical Stack

**Frontend:**
- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4, shadcn/ui, Lucide React
- React Hook Form, Zod 4, TanStack Query
- next-themes for dark/light mode

**Backend:**
- Prisma 6 with PostgreSQL
- Supabase (Auth, Storage, Realtime)
- bcrypt for password hashing
- Row-Level Security (RLS)

**Email & Communication:**
- Resend for email delivery
- React Email for templates
- Sonner for toast notifications

**Testing & DevOps:**
- Playwright (E2E), Vitest (Unit)
- ESLint 9, Prettier
- Husky, lint-staged
- GitHub Actions ready

### Use Cases

This boilerplate is perfect for:
- Retail chain management (HQ + branches + stores)
- Healthcare networks (hospitals + clinics)
- Education systems (campuses + departments)
- Enterprise SaaS platforms
- Logistics & delivery networks
- Construction project management

### Migration Notes

This is the initial release. No migration required.

### Contributors

- **Agus Wirajati** ([@aguswirajati](https://github.com/aguswirajati)) - Creator
- **Claude Code** - AI pair programmer

---

## Future Releases

### [Unreleased]

#### Planned for v1.1.0
- API rate limiting improvements
- Advanced audit log filtering
- Email digest notifications
- Multi-tenancy support (optional mode)
- Advanced reporting dashboard
- Data export (CSV, Excel, PDF)
- Two-factor authentication (2FA)
- API key management
- Webhook system

#### Future Considerations
- GraphQL API option
- Mobile app (React Native)
- Advanced caching strategies
- Internationalization (i18n)
- Custom branding per branch
- Integration marketplace

---

**Legend:**
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

---

For full documentation, see [README.md](README.md) and [docs/](docs/)
