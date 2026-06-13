# Architecture Documentation

**Project:** Next.js Branch Management Boilerplate
**Version:** 1.0.0
**Last Updated:** 2025-11-25

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architectural Decisions](#architectural-decisions)
3. [Database Schema](#database-schema)
4. [Branch Hierarchy System](#branch-hierarchy-system)
5. [RBAC & Permissions](#rbac--permissions)
6. [Soft Delete Pattern](#soft-delete-pattern)
7. [Branch-Scoped Data](#branch-scoped-data)
8. [Security Layers](#security-layers)
9. [Development Workflow](#development-workflow)

---

## System Overview

Multi-branch SaaS platform with branch hierarchy and RBAC system.

### Core Components

```
┌─────────────────────────────────────┐
│     Next.js App (Frontend)          │
│  - Server Components (default)      │
│  - Client Components (interactive)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Server Actions Layer             │
│  - Input validation (Zod)           │
│  - Business logic orchestration     │
│  - Auth/Permission checking         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Service Layer                    │
│  - Pure business logic              │
│  - Domain rules                     │
│  - Soft delete handling             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Prisma ORM                       │
│  - Type-safe queries                │
│  - Transactions                     │
│  - Audit trail                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Supabase PostgreSQL              │
│  - Row-Level Security (RLS)         │
│  - Auth & User Management           │
│  - Soft delete indexes              │
└─────────────────────────────────────┘
```

---

## Architectural Decisions

### 1. Single Headquarters Model

**Decision:** One company, one headquarters (NOT multi-tenant)

**Rationale:**

- ✅ Simpler architecture (YAGNI principle)
- ✅ Faster queries (no tenant filtering)
- ✅ Easier to reason about hierarchy
- ✅ Can migrate to multi-tenant later if needed

**Implementation:**

```sql
-- Database unique constraint (only one active HQ)
CREATE UNIQUE INDEX "unique_active_headquarters"
  ON "branches"("type")
  WHERE "deleted_at" IS NULL AND "type" = 'HEADQUARTERS';
```

```typescript
// Application validation
const existingHQ = await prisma.branch.findFirst({
  where: withoutDeleted({ type: 'HEADQUARTERS' }),
})
if (existingHQ) {
  throw new Error('Only one headquarters allowed')
}
```

**Key Points:**

- Only ONE active headquarters can exist
- Soft-deleted HQ doesn't block new HQ creation
- Cannot create BRANCH without HQ parent
- Cannot set parentId on HEADQUARTERS type

---

### 2. Soft Delete Over Hard Delete

**Decision:** All deletions are soft deletes (set deletedAt timestamp)

**Rationale:**

- ✅ Data preservation for audit/history
- ✅ Reversible operations
- ✅ Maintains referential integrity
- ✅ Regulatory compliance
- ✅ Enables data recovery

**Implementation:**

```prisma
model Branch {
  deletedBy String?   @map("deleted_by")
  deletedAt DateTime? @map("deleted_at")

  deletedByProfile Profile? @relation("BranchDeletedBy", fields: [deletedBy], references: [id])

  @@index([deletedAt]) // Efficient filtering
}
```

```typescript
// Always filter soft-deleted records
where: withoutDeleted({ isActive: true })

// Soft delete instead of hard delete
await softDelete(prisma.branch, branchId, currentUser.profile.id)
```

---

### 3. onDelete: Restrict for Branch Hierarchy

**Decision:** Use `onDelete: Restrict` on branch parent relation

**Rationale:**

- ✅ Prevents accidental hard deletion of parent branches
- ✅ Forces proper soft delete flow through application
- ✅ Aligns with audit trail requirements
- ✅ Application validates before any delete operation

**Implementation:**

```prisma
model Branch {
  parent   Branch?   @relation("BranchHierarchy", fields: [parentId], references: [id], onDelete: Restrict)
  children Branch[]  @relation("BranchHierarchy")
}
```

**What happens on delete:**

1. Application checks if branch has children
2. If children exist → error (must reassign or delete children first)
3. If no children → soft delete (sets deletedAt)
4. Database FK only triggers on hard delete (which shouldn't happen)

---

### 4. Branch-Scoped Data (Not Multi-Tenant)

**Decision:** Branch scope for data isolation, NOT multi-tenancy

**Rationale:**

- All branches belong to same company/database
- Branch scope used for operational separation
- RBAC controls who sees which branch data
- NOT separate companies/tenants

**Future Pattern (for transactions/financials):**

```prisma
model Transaction {
  id       String
  branchId String   // Branch scope
  amount   Decimal
  deletedAt DateTime?

  branch Branch @relation(...)

  @@index([branchId])
  @@index([deletedAt])
}
```

```typescript
// Query pattern
const transactions = await prisma.transaction.findMany({
  where: withoutDeleted({
    branchId: { in: accessibleBranchIds },
  }),
})
```

---

## Database Schema

### Core Tables

| Table                | Purpose                 | Soft Delete | Audit Trail |
| -------------------- | ----------------------- | ----------- | ----------- |
| **users**            | User accounts (Auth)    | ✅          | ✅          |
| **profiles**         | Extended user data      | ✅          | ✅          |
| **branches**         | Organization hierarchy  | ✅          | ✅          |
| **roles**            | Role definitions        | ✅          | ✅          |
| **permissions**      | Permission definitions  | ✅          | ✅          |
| **user_roles**       | User-Role mapping       | ✅          | ✅          |
| **role_permissions** | Role-Permission mapping | ✅          | ✅          |
| **audit_logs**       | Activity tracking       | ✅          | ✅          |

### Relationships

```
users 1──────* profiles
profiles *──────* roles (via user_roles)
roles *──────* permissions (via role_permissions)
profiles *──────1 branches
branches 1──────* branches (self-referencing hierarchy)
```

### FK Constraint Strategy

| Relation               | onDelete Action | Rationale                         |
| ---------------------- | --------------- | --------------------------------- |
| Branch → Parent        | **Restrict**    | Force soft delete through app     |
| Profile → User         | Cascade         | User deletion removes profile     |
| UserRole → Profile     | Cascade         | Profile deletion removes roles    |
| RolePermission → Role  | Cascade         | Role deletion removes permissions |
| Audit Trail References | No action       | Preserve audit history            |

---

## Branch Hierarchy System

### Hierarchy Structure

```
HEADQUARTERS (HQ) - Level 1
└── BRANCH (Regional/City) - Level 2
    └── SUB_BRANCH (District/Area) - Level 3
```

### Type Rules

| Branch Type  | Can Have Parent? | Parent Type Required | Max Depth |
| ------------ | ---------------- | -------------------- | --------- |
| HEADQUARTERS | ❌ No            | N/A                  | Level 1   |
| BRANCH       | ✅ Yes           | HEADQUARTERS         | Level 2   |
| SUB_BRANCH   | ✅ Yes           | BRANCH               | Level 3   |

### Configuration

```bash
# .env
MAX_BRANCH_DEPTH=5  # Configurable depth limit
```

### Data Access Rules

- **HQ users**: Access all branches
- **Branch users**: Access own branch + sub-branches
- **Sub-branch users**: Access only own sub-branch

### Validation Rules

```typescript
// Cannot create multiple HQ
if (type === 'HEADQUARTERS' && existingHQ) {
  throw new Error('Only one headquarters allowed')
}

// HQ cannot have parent
if (type === 'HEADQUARTERS' && parentId) {
  throw new Error('Headquarters cannot have parent')
}

// BRANCH must have HQ parent
if (type === 'BRANCH' && parent.type !== 'HEADQUARTERS') {
  throw new Error('Branch must have HQ as parent')
}

// Cannot delete branch with children
if (branch.children.length > 0) {
  throw new Error('Delete or reassign children first')
}
```

---

## RBAC & Permissions

### Role Hierarchy

```
Super Admin (level 1)
    ↓
Regional Manager (level 2)
    ↓
Branch Manager (level 3)
    ↓
Admin Staff (level 4)
    ↓
Technician (level 5)
    ↓
User (level 6)
```

### Permission Format

`{resource}:{action}:{scope}`

### Permission Scopes

| Scope    | Access Level             | Example                |
| -------- | ------------------------ | ---------------------- |
| `OWN`    | Own records only         | User edits own profile |
| `BRANCH` | Same branch only         | Manager sees branch    |
| `REGION` | Branch + all descendants | Regional oversight     |
| `ALL`    | Entire organization      | Super admin access     |

### Access Control Query Pattern

```typescript
// Get accessible branch IDs based on role scope
const accessibleBranchIds = await getAccessibleBranchIds()

// Filter queries by accessible branches + soft delete
const users = await prisma.user.findMany({
  where: withoutDeleted({
    profile: {
      branchId: { in: accessibleBranchIds },
    },
  }),
})
```

---

## Soft Delete Pattern

### Helper Functions

```typescript
// Filter deleted records
export function withoutDeleted<T>(where: T): T & { deletedAt: null } {
  return { ...where, deletedAt: null }
}

// Soft delete a record
export async function softDelete(model: any, id: string, userId: string) {
  return model.update({
    where: { id },
    data: {
      deletedBy: userId,
      deletedAt: new Date(),
    },
  })
}

// Check if record is soft-deleted
export function isSoftDeleted(record: { deletedAt: Date | null }) {
  return record.deletedAt !== null
}
```

### Usage Examples

```typescript
// ✅ DO: Always filter soft-deleted
where: withoutDeleted({ type: 'BRANCH' })

// ✅ DO: Use soft delete
await softDelete(prisma.branch, id, userId)

// ❌ DON'T: Hard delete
await prisma.branch.delete({ where: { id } })

// ❌ DON'T: Forget to filter deleted
where: {
  type: 'BRANCH'
} // Missing withoutDeleted()
```

---

## Branch-Scoped Data

### Current Implementation

- User profiles scoped to branches
- RBAC enforces branch access
- Queries filter by accessible branches

### Future Pattern (Transactions/Financials)

```typescript
// Add branchId to transaction tables
model Transaction {
  branchId String
  @@index([branchId])
  @@index([deletedAt])
}

// Query with branch scope
const transactions = await prisma.transaction.findMany({
  where: withoutDeleted({
    branchId: { in: accessibleBranchIds },
  }),
})
```

**NOT Multi-Tenant:**

- All branches in same database
- No tenant isolation
- Shared schema across company
- RBAC handles access control

---

## Security Layers

1. **Next.js Middleware** - Route protection
2. **Server Actions** - Input validation (Zod) & auth check
3. **Service Layer** - Business rules enforcement
4. **RBAC** - Permission checking + branch scope
5. **Prisma** - Type safety + SQL injection protection
6. **Supabase RLS** - Database-level security
7. **Soft Delete** - Data preservation + audit trail

---

## Development Workflow

1. Define types/schemas (Zod + TypeScript)
2. Create/Update Prisma schema
3. Generate migration: `npx prisma migrate dev`
4. Create service layer with soft delete
5. Create Server Actions with validation
6. Add RBAC permission checks
7. Create UI components
8. Test & validate

### Best Practices

```typescript
// ✅ DO: Filter soft-deleted + branch scope
where: withoutDeleted({
  branchId: { in: accessibleBranchIds },
})

// ✅ DO: Populate audit trail
data: {
  ...userData,
  ...createAuditData(currentUser.profile.id),
}

// ✅ DO: Check permissions
await checkPermission('users:read:BRANCH')

// ✅ DO: Validate before delete
if (branch.children.length > 0) throw Error()

// ❌ DON'T: Skip soft delete filter
where: {} // Missing filters!

// ❌ DON'T: Hard delete
await prisma.delete({ where: { id } })
```

---

## Migration Guide

### If Multi-Tenancy Needed Later

1. Add `companyId` column to all tables
2. Update all queries to filter by `companyId`
3. Migrate single HQ → per-company HQ
4. Update unique constraints to be company-scoped
5. Implement tenant-based authentication

---

## References

- [Prisma Schema](../prisma/schema.prisma)
- [RBAC Implementation](../lib/rbac/)
- [Branch Service](../features/branches/services/branch.service.ts)
- [Audit Trail Guide](./AUDIT_TRAIL_IMPLEMENTATION_GUIDE.md)
- [Soft Delete Helpers](../lib/utils/prisma-helpers.ts)

---

**Author:** Claude Code + @aguswirajati
**Status:** Production Ready
**Version:** 1.0.0
