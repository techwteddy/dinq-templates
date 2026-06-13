# 📖 API Documentation

Comprehensive API documentation for the Branch Management Boilerplate.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Server Actions](#server-actions)
  - [Auth Actions](#auth-actions)
  - [User Actions](#user-actions)
  - [Branch Actions](#branch-actions)
  - [Audit Actions](#audit-actions)
  - [Admin Actions](#admin-actions)
- [Database Services](#database-services)
  - [User Service](#user-service)
  - [Branch Service](#branch-service)
  - [Audit Service](#audit-service)
- [File Upload API](#file-upload-api)
- [Real-time Subscriptions](#real-time-subscriptions)
- [Types & Schemas](#types--schemas)
- [Error Handling](#error-handling)
- [RBAC & Permissions](#rbac--permissions)

---

## Overview

### Architecture

This API follows a modular, layered architecture:

```
┌─────────────────────────────────────┐
│     Client Components (React)       │
│  - Forms, Dialogs, Interactive UI   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Server Actions (actions/)      │
│  - Input validation (Zod)           │
│  - Permission checks (RBAC)         │
│  - Business logic                   │
│  - Audit logging                    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│    Database Services (services/)    │
│  - Prisma queries                   │
│  - Data transformations             │
│  - Soft delete patterns             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│       Database (PostgreSQL)         │
│  - Supabase hosted                  │
│  - Row-Level Security (RLS)         │
└─────────────────────────────────────┘
```

### Key Concepts

- **Server Actions**: Next.js server functions marked with `'use server'` directive
- **Action Result**: Standardized return type for all actions (`{ success, error?, data?, message? }`)
- **Soft Delete**: All records are soft-deleted (marked with `deletedAt`, not removed)
- **Audit Trail**: All CRUD operations are logged with user and timestamp
- **RBAC**: Role-based access control enforced at action and service level
- **Branch Scoping**: Users can only access data within their branch hierarchy

---

## Authentication

### Supabase Auth

Authentication is handled by Supabase Auth with JWT tokens stored in HTTP-only cookies.

#### Auth Flow

```typescript
// 1. User submits login form
const result = await login({ email, password })

// 2. Server action validates credentials
// 3. Supabase Auth creates session
// 4. Session stored in HTTP-only cookie
// 5. Redirect to dashboard
```

#### Session Management

```typescript
// Get current user session
const supabase = await createClient()
const {
  data: { session },
} = await supabase.auth.getSession()

// Refresh session (automatic)
// Sessions auto-refresh before expiry

// Logout
await logout() // Clears session cookie
```

---

## Server Actions

All server actions follow this pattern:

```typescript
export async function actionName(data: InputType): Promise<ActionResult> {
  try {
    // 1. Check permissions
    const hasPermission = await checkPermission(resource, operation, scope)
    if (!hasPermission) {
      return { success: false, error: 'Unauthorized' }
    }

    // 2. Validate input
    const validation = schema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: 'Invalid input', errors: validation.error }
    }

    // 3. Perform operation
    const result = await serviceFunction(validation.data)

    // 4. Log audit trail
    await logOperation(resource, id, data)

    // 5. Revalidate cache
    revalidatePath('/path')

    return { success: true, message: 'Success' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

### Auth Actions

Located in: `features/auth/actions/`

#### `login(data)`

Authenticates user with email and password.

**Input:**

```typescript
{
  email: string // Valid email address
  password: string // Minimum 8 characters
}
```

**Output:**

```typescript
{
  success: boolean
  error?: string
  // Redirects to dashboard on success
}
```

**Example:**

```typescript
import { login } from '@/features/auth/actions'

const result = await login({
  email: 'admin@repairshop.com',
  password: 'Admin123!',
})
```

**Validation:**

- Email must be valid format
- Password minimum 8 characters
- Account must exist and be active

**Side Effects:**

- Creates Supabase Auth session
- Sets HTTP-only cookie
- Redirects to dashboard (`/`)

---

#### `register(data)`

Registers new user with email and password (requires invitation or admin permission).

**Input:**

```typescript
{
  email: string
  password: string
  fullName: string
  phone?: string
  branchId: string
  roleIds: string[]
}
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Requires `users:create` permission with `BRANCH` scope

---

#### `logout()`

Logs out current user and clears session.

**Input:** None

**Output:**

```typescript
{
  success: boolean
  // Redirects to login page
}
```

**Side Effects:**

- Destroys Supabase Auth session
- Clears HTTP-only cookie
- Redirects to login page (`/login`)

---

#### `getCurrentUser()`

Gets currently authenticated user with profile and roles.

**Input:** None

**Output:**

```typescript
{
  id: string
  email: string
  profile: {
    id: string
    fullName: string
    phone: string | null
    avatar: string | null
    status: UserStatus
    branchId: string
    branch: BranchDetail
    userRoles: UserRole[]
  }
}
```

**Example:**

```typescript
const user = await getCurrentUser()
console.log(user.profile.fullName) // "Admin User"
console.log(user.profile.userRoles[0].role.name) // "Super Admin"
```

**Caching:** User data is cached per request

---

#### `checkPermission(resource, operation, scope)`

Checks if current user has specific permission.

**Input:**

```typescript
{
  resource: string // e.g., 'users', 'branches', 'audit_logs'
  operation: string // 'create', 'read', 'update', 'delete'
  scope: PermissionScope // 'SYSTEM', 'BRANCH', 'OWN'
}
```

**Output:**

```typescript
boolean // true if user has permission
```

**Example:**

```typescript
import { checkPermission } from '@/features/auth/actions'
import { PermissionScope } from '@/lib/generated/prisma'

const canCreateUser = await checkPermission('users', 'create', PermissionScope.BRANCH)
```

---

#### `checkRole(roleType)`

Checks if current user has specific role type.

**Input:**

```typescript
roleType: RoleType // 'SUPER_ADMIN', 'GENERAL_MANAGER', 'BRANCH_MANAGER', etc.
```

**Output:**

```typescript
boolean // true if user has role
```

**Example:**

```typescript
import { checkRole } from '@/features/auth/actions'

const isSuperAdmin = await checkRole('SUPER_ADMIN')
```

---

### User Actions

Located in: `features/users/actions/`

#### `getUsers(filters)`

Gets paginated list of users with optional filters.

**Input:**

```typescript
{
  search?: string          // Search by email or full name
  branchId?: string        // Filter by branch
  status?: UserStatus      // 'ACTIVE' | 'INACTIVE'
  roleType?: RoleType      // Filter by role
  page?: number            // Default: 1
  limit?: number           // Default: 10
}
```

**Output:**

```typescript
{
  success: boolean
  data?: {
    data: UserListItem[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  error?: string
}
```

**Permissions:**

- Requires `users:read` permission
- Only returns users in accessible branches

**Example:**

```typescript
const result = await getUsers({
  search: 'john',
  status: 'ACTIVE',
  page: 1,
  limit: 20,
})
```

---

#### `getUserById(userId)`

Gets detailed user information by ID.

**Input:**

```typescript
userId: string // User ID (UUID)
```

**Output:**

```typescript
{
  success: boolean
  data?: UserDetail
  error?: string
}
```

**Permissions:**

- Requires `users:read` permission
- User must be in accessible branch

---

#### `createUser(data)`

Creates new user with Supabase Auth account and database profile.

**Input:**

```typescript
{
  email: string
  password: string      // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  fullName: string
  phone?: string
  branchId: string      // Must be accessible branch
  roleIds: string[]     // Array of role IDs
  status?: UserStatus   // Default: ACTIVE
}
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
  errors?: Record<string, string[]>  // Validation errors
}
```

**Permissions:**

- Requires `users:create` permission with `BRANCH` scope
- Can only create users in accessible branches
- Cannot assign roles of equal/higher level than own role

**Validation:**

- Email must be unique
- Password must meet strength requirements
- All role IDs must exist
- Branch must be accessible

**Side Effects:**

- Creates Supabase Auth user
- Creates database user profile
- Assigns roles
- Logs audit trail
- Revalidates `/users` path

**Error Handling:**

- If database creation fails, Supabase Auth user is automatically deleted (rollback)

---

#### `updateUser(userId, data)`

Updates existing user information.

**Input:**

```typescript
{
  userId: string
  data: {
    email?: string
    fullName?: string
    phone?: string
    branchId?: string
    roleIds?: string[]
    status?: UserStatus
    avatar?: string
  }
}
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Requires `users:update` permission
- Can update users in accessible branches
- Cannot change to inaccessible branch

**Side Effects:**

- Soft deletes old roles if `roleIds` provided
- Creates new role assignments
- Logs audit trail
- Revalidates paths

---

#### `deleteUser(userId)`

Soft deletes user (marks as deleted, doesn't remove from database).

**Input:**

```typescript
userId: string // User ID to delete
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Requires `users:delete` permission
- Can delete users in accessible branches

**Side Effects:**

- Sets `deletedAt` and `deletedBy` fields
- Preserves audit trail
- User no longer appears in queries (filtered by `withoutDeleted()`)
- Logs audit trail

---

#### `uploadAvatar(formData)`

Uploads user avatar image to Supabase Storage.

**Input:**

```typescript
FormData {
  userId: string
  file: File  // Image file (JPEG, PNG, GIF, WebP)
}
```

**Output:**

```typescript
{
  success: boolean
  url?: string          // Public URL of uploaded image
  error?: string
}
```

**Validation:**

- File type: JPEG, PNG, GIF, WebP only
- Max size: 5MB
- User must be in accessible branch

**Storage:**

- Bucket: `avatars`
- Path: `{userId}/avatar.{ext}`
- Upsert: true (replaces existing)

**Side Effects:**

- Updates user profile `avatar` field
- Deletes old avatar if exists
- Logs audit trail

---

#### `getRoles()`

Gets all available roles for user assignment.

**Input:** None

**Output:**

```typescript
{
  success: boolean
  data?: Role[]
  error?: string
}
```

**Returns:**

```typescript
{
  id: string
  name: string
  type: RoleType
  level: number
  description: string
}
;[]
```

**Filtering:**

- Only returns roles user is authorized to assign (lower level than own role)

---

### Branch Actions

Located in: `features/branches/actions/`

#### `getBranches(filters)`

Gets list of branches with optional filters.

**Input:**

```typescript
{
  search?: string          // Search by name or code
  type?: BranchType        // 'HQ' | 'BRANCH' | 'SUB_BRANCH'
  isActive?: boolean       // Filter active/inactive
  parentId?: string        // Filter by parent branch
}
```

**Output:**

```typescript
{
  success: boolean
  data?: BranchListItem[]
  error?: string
}
```

**Permissions:**

- Requires `branches:read` permission
- Only returns accessible branches

---

#### `getBranchHierarchy()`

Gets branches in hierarchical tree structure.

**Input:** None

**Output:**

```typescript
{
  success: boolean
  data?: BranchHierarchyItem[]
  error?: string
}
```

**Structure:**

```typescript
{
  id: string
  name: string
  code: string
  type: BranchType
  isActive: boolean
  _count: {
    profiles: number
  }
  children: BranchHierarchyItem[]  // Nested children
}[]
```

**Example Response:**

```json
[
  {
    "id": "uuid-1",
    "name": "Headquarters",
    "code": "HQ",
    "type": "HQ",
    "isActive": true,
    "_count": { "profiles": 5 },
    "children": [
      {
        "id": "uuid-2",
        "name": "Malang Branch",
        "code": "MLG",
        "type": "BRANCH",
        "isActive": true,
        "_count": { "profiles": 12 },
        "children": [
          {
            "id": "uuid-3",
            "name": "Malang Sub-Branch 1",
            "code": "MLG-SUB1",
            "type": "SUB_BRANCH",
            "isActive": true,
            "_count": { "profiles": 3 },
            "children": []
          }
        ]
      }
    ]
  }
]
```

---

#### `getBranchById(branchId)`

Gets detailed branch information.

**Input:**

```typescript
branchId: string
```

**Output:**

```typescript
{
  success: boolean
  data?: BranchDetail
  error?: string
}
```

---

#### `createBranch(data)`

Creates new branch in the hierarchy.

**Input:**

```typescript
{
  name: string
  code: string          // Unique branch code
  type: BranchType      // 'HQ', 'BRANCH', or 'SUB_BRANCH'
  parentId?: string     // Required for BRANCH and SUB_BRANCH
  address?: string
  phone?: string
  isActive?: boolean    // Default: true
}
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Requires `branches:create` permission
- Parent branch must be accessible

**Validation:**

- Only one HQ allowed per system
- Branch code must be unique
- BRANCH must have HQ parent
- SUB_BRANCH must have BRANCH parent
- Maximum hierarchy depth: 5 levels (configurable)

**Side Effects:**

- Creates branch
- Logs audit trail
- Revalidates paths

---

#### `updateBranch(branchId, data)`

Updates existing branch.

**Input:**

```typescript
{
  branchId: string
  data: {
    name?: string
    code?: string
    address?: string
    phone?: string
    isActive?: boolean
    logo?: string
  }
}
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Requires `branches:update` permission
- Branch must be accessible

**Validation:**

- Cannot change branch type or parent
- Branch code must remain unique

---

#### `deleteBranch(branchId)`

Soft deletes branch.

**Input:**

```typescript
branchId: string
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Requires `branches:delete` permission
- Cannot delete HQ branch
- Cannot delete branch with active users
- Cannot delete branch with children

**Side Effects:**

- Sets `deletedAt` and `deletedBy` fields
- Logs audit trail

---

#### `uploadLogo(formData)`

Uploads branch logo to Supabase Storage.

**Input:**

```typescript
FormData {
  branchId: string
  file: File  // Image file (JPEG, PNG, GIF, WebP, SVG)
}
```

**Output:**

```typescript
{
  success: boolean
  url?: string
  error?: string
}
```

**Validation:**

- File type: JPEG, PNG, GIF, WebP, SVG
- Max size: 5MB
- Branch must be accessible

**Storage:**

- Bucket: `logos`
- Path: `{branchId}/logo.{ext}`

---

### Audit Actions

Located in: `features/audit/actions/`

#### `getAuditLogs(filters)`

Gets audit logs with filters and pagination.

**Input:**

```typescript
{
  tableName?: string      // Filter by table (users, branches, etc.)
  operation?: string      // 'CREATE' | 'UPDATE' | 'DELETE'
  userId?: string         // Filter by user who performed action
  startDate?: Date        // Filter from date
  endDate?: Date          // Filter to date
  page?: number           // Default: 1
  limit?: number          // Default: 50
}
```

**Output:**

```typescript
{
  success: boolean
  data?: {
    data: AuditLog[]
    pagination: PaginationInfo
  }
  error?: string
}
```

**Permissions:**

- Requires `audit_logs:read` permission
- Super Admin can see all logs
- Others see only logs for accessible branches

**Example:**

```typescript
const result = await getAuditLogs({
  tableName: 'users',
  operation: 'CREATE',
  page: 1,
  limit: 20,
})
```

---

### Admin Actions

Located in: `features/admin/actions/`

#### Role Management: `getRolePermissions(roleId)`

Gets all permissions for a role.

**Input:**

```typescript
roleId: string
```

**Output:**

```typescript
{
  success: boolean
  data?: RolePermission[]
  error?: string
}
```

---

#### Role Management: `updateRolePermissions(roleId, permissionIds)`

Updates permissions for a role.

**Input:**

```typescript
{
  roleId: string
  permissionIds: string[]  // Array of permission IDs to assign
}
```

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Super Admin only

---

#### Dev Tools: `seedSampleData()`

Seeds database with sample users and branches for testing.

**Input:** None

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Super Admin only

**Creates:**

- 10 test users across different roles
- 3 branches (Malang, Jogja, Sub-Jogja)
- Default password: `test1234`

**Warning:** Only use in development/testing environments

---

#### Dev Tools: `resetDatabase()`

Resets database, removing all data except Super Admin and HQ branch.

**Input:** None

**Output:**

```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Permissions:**

- Super Admin only

**Preserves:**

- Super Admin user
- HQ branch
- System roles and permissions

**Deletes:**

- All test users
- All test branches
- All audit logs (except system logs)

---

## Database Services

Services provide direct database access using Prisma ORM. They handle:

- Prisma queries
- Data transformations
- Branch scoping
- Soft delete filtering

---

### User Service

Located in: `features/users/services/user.service.ts`

#### `getUsers(filters)`

**Purpose:** Fetch paginated list of users

**Input:**

```typescript
{
  search?: string
  branchId?: string
  status?: UserStatus
  roleType?: RoleType
  page?: number
  limit?: number
}
```

**Output:**

```typescript
{
  data: UserListItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

**Implementation Notes:**

- Automatically filters soft-deleted records
- Applies branch scoping based on current user
- Case-insensitive search
- Joins with profile, branch, and roles

---

#### `getUserById(userId)`

**Purpose:** Get single user with full details

**Output:** `UserDetail | null`

---

#### `createUser(data, supabaseUserId?)`

**Purpose:** Create new user in database

**Note:** Usually called from action after Supabase Auth user is created

---

#### `updateUser(userId, data)`

**Purpose:** Update user profile and optionally roles

**Special Handling:**

- Role updates: Soft deletes old roles, creates new ones
- Re-fetches user after update to include new roles

---

#### `deleteUser(userId)`

**Purpose:** Soft delete user

**Implementation:** Uses `softDelete()` helper

---

### Branch Service

Located in: `features/branches/services/branch.service.ts`

#### `getBranches(filters)`

**Purpose:** Get flat list of branches

**Ordering:** Type (HQ → BRANCH → SUB_BRANCH), then name

---

#### `getBranchesHierarchy()`

**Purpose:** Get branches in tree structure

**Algorithm:**

```typescript
function buildHierarchy(parentId: null | string) {
  // 1. Find all branches with given parent
  // 2. For each branch, recursively build children
  // 3. Return tree structure
}
```

**Performance:** O(n) where n = number of branches

---

#### `getBranchById(branchId)`

**Purpose:** Get single branch with details

**Includes:**

- Parent branch info
- Children count
- Users count

---

#### `createBranch(data)`

**Purpose:** Create new branch

**Validation:**

- Check HQ uniqueness
- Validate parent exists
- Check hierarchy depth

---

#### `updateBranch(branchId, data)`

**Purpose:** Update branch details

---

#### `deleteBranch(branchId)`

**Purpose:** Soft delete branch

**Pre-checks:**

- Not HQ
- No children
- No active users

---

### Audit Service

Located in: `features/audit/services/audit.service.ts`

#### `logCreate(tableName, recordId, data)`

Logs CREATE operation.

**Input:**

```typescript
{
  tableName: string // 'users', 'branches', etc.
  recordId: string // ID of created record
  data: Record<string, any> // Created data (excluding sensitive fields)
}
```

---

#### `logUpdate(tableName, recordId, oldData, newData)`

Logs UPDATE operation with before/after data.

**Input:**

```typescript
{
  tableName: string
  recordId: string
  oldData: Record<string, any>
  newData: Record<string, any>
}
```

---

#### `logDelete(tableName, recordId)`

Logs DELETE operation.

---

#### `getAuditLogs(filters)`

Retrieves audit logs with filtering.

**Automatic Filtering:**

- Sensitive fields removed (passwords, tokens)
- Branch scoping applied
- Soft deletes excluded

---

## File Upload API

Located in: `lib/supabase/storage.ts`

### Core Functions

#### `uploadFile(bucket, path, file)`

Generic file upload to any bucket.

**Input:**

```typescript
{
  bucket: string // 'avatars' or 'logos'
  path: string // File path in bucket
  file: File // File object
}
```

**Output:**

```typescript
{
  success: boolean
  url?: string      // Public URL
  path?: string     // Storage path
  error?: string
}
```

**Features:**

- Upsert: Replaces existing file
- Auto content-type detection
- Public URL generation

---

#### `deleteFile(bucket, path)`

Deletes file from bucket.

---

#### `uploadAvatar(userId, file)`

**Validation:**

- Allowed types: JPEG, PNG, GIF, WebP
- Max size: 5MB

**Path:** `{userId}/avatar.{ext}`

---

#### `uploadLogo(branchId, file)`

**Validation:**

- Allowed types: JPEG, PNG, GIF, WebP, SVG
- Max size: 5MB

**Path:** `{branchId}/logo.{ext}`

---

### Storage Buckets

#### avatars

- **Public:** Yes
- **Max size:** 5MB per file
- **Allowed types:** image/jpeg, image/png, image/webp, image/gif
- **RLS Policies:**
  - Anyone can read
  - Authenticated users can upload
  - Users can update/delete own files

#### logos

- **Public:** Yes
- **Max size:** 5MB per file
- **Allowed types:** image/jpeg, image/png, image/webp, image/gif, image/svg+xml
- **RLS Policies:**
  - Anyone can read
  - Authenticated users can upload
  - Users can update/delete own files

---

## Real-time Subscriptions

Located in: `lib/hooks/`

### `useRealtimeUsers(onUpdate?)`

Subscribes to real-time changes in users table.

**Usage:**

```typescript
'use client'

import { useRealtimeUsers } from '@/lib/hooks'

export function UserTable() {
  const { lastUpdate } = useRealtimeUsers(() => {
    // Called when user data changes
    refetch()
  })

  // Component re-fetches when lastUpdate changes
  useEffect(() => {
    fetchUsers()
  }, [lastUpdate])
}
```

**Events:**

- `INSERT`: New user created → Toast: "New user added"
- `UPDATE`: User modified → Toast: "User updated"
- `DELETE`: User removed → Toast: "User removed"

**Subscription:**

- Channel: `users-changes`
- Table: `users`
- Events: All (`*`)

**Cleanup:** Automatically unsubscribes on component unmount

---

### `useRealtimeBranches(onUpdate?)`

Subscribes to real-time changes in branches table.

**Usage:**

```typescript
'use client'

import { useRealtimeBranches } from '@/lib/hooks'

export function BranchHierarchy() {
  const { lastUpdate } = useRealtimeBranches(() => {
    refetchBranches()
  })
}
```

**Events:**

- `INSERT`: Branch created
- `UPDATE`: Branch modified
- `DELETE`: Branch removed

---

## Types & Schemas

### Common Types

```typescript
// Action result type
type ActionResult<T = undefined> = {
  success: boolean
  message?: string
  error?: string
  errors?: Record<string, string[]>
  data?: T
}

// Pagination info
type PaginationInfo = {
  total: number
  page: number
  limit: number
  totalPages: number
}

// User statuses
enum UserStatus {
  ACTIVE = 'ACTIVE'
  INACTIVE = 'INACTIVE'
}

// Role types
enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN'
  GENERAL_MANAGER = 'GENERAL_MANAGER'
  BRANCH_MANAGER = 'BRANCH_MANAGER'
  STAFF_ADMIN = 'STAFF_ADMIN'
  TECHNICIAN = 'TECHNICIAN'
  USER = 'USER'
}

// Branch types
enum BranchType {
  HQ = 'HQ'
  BRANCH = 'BRANCH'
  SUB_BRANCH = 'SUB_BRANCH'
}

// Permission scopes
enum PermissionScope {
  SYSTEM = 'SYSTEM'    // All data in system
  BRANCH = 'BRANCH'    // Own branch + descendants
  OWN = 'OWN'          // Only own records
}
```

---

## Error Handling

### Error Patterns

All actions follow consistent error handling:

```typescript
try {
  // Operation
  return { success: true, message: 'Success' }
} catch (error) {
  console.error('Error:', error)

  if (error instanceof Error) {
    return { success: false, error: error.message }
  }

  return { success: false, error: 'An unexpected error occurred' }
}
```

### Common Error Codes

| Error                   | Cause                    | Solution                        |
| ----------------------- | ------------------------ | ------------------------------- |
| `Unauthorized`          | Missing permission       | Check user role and permissions |
| `Invalid input`         | Validation failed        | Check validation schema         |
| `Not found`             | Record doesn't exist     | Verify ID is correct            |
| `Already exists`        | Duplicate unique field   | Use different value             |
| `Branch not accessible` | User can't access branch | Check branch hierarchy          |

---

## RBAC & Permissions

### Permission Structure

```
resource:operation:scope

Examples:
- users:create:BRANCH
- branches:read:SYSTEM
- audit_logs:read:OWN
```

### Resources

- `users`
- `branches`
- `roles`
- `permissions`
- `audit_logs`

### Operations

- `create` - Create new records
- `read` - View records
- `update` - Modify records
- `delete` - Remove records

### Scopes

- `SYSTEM` - Access all records
- `BRANCH` - Access records in own branch + descendants
- `OWN` - Access only own records

### Role Hierarchy

```
Level 1: SUPER_ADMIN (highest)
Level 2: GENERAL_MANAGER
Level 3: BRANCH_MANAGER
Level 4: STAFF_ADMIN
Level 5: TECHNICIAN
Level 6: USER (lowest)
```

**Rules:**

- Higher level = more permissions
- Users can manage lower-level users
- Cannot assign equal/higher level roles

### Branch Hierarchy

```
HQ (Level 1)
└── BRANCH (Level 2)
    └── SUB_BRANCH (Level 3)
        └── SUB_SUB_BRANCH (Level 4)
            └── ... (up to MAX_BRANCH_DEPTH)
```

**Access Rules:**

- Users can access own branch + all descendants
- Cannot access parent branches (unless explicitly granted)
- Super Admin can access all branches

---

## Best Practices

### 1. Always Validate Input

```typescript
const validation = schema.safeParse(data)
if (!validation.success) {
  return { success: false, error: 'Invalid input', errors: validation.error }
}
```

### 2. Check Permissions First

```typescript
const hasPermission = await checkPermission(resource, operation, scope)
if (!hasPermission) {
  return { success: false, error: 'Unauthorized' }
}
```

### 3. Use Soft Delete

```typescript
// ✅ DO: Soft delete
await softDelete(prisma.user, userId, currentUser.profile.id)

// ❌ DON'T: Hard delete
await prisma.user.delete({ where: { id: userId } })
```

### 4. Log Audit Trail

```typescript
// After successful operation
await logCreate('users', userId, data)
```

### 5. Revalidate Cache

```typescript
// After mutation
revalidatePath('/users')
```

### 6. Handle Errors Gracefully

```typescript
try {
  // Operation
} catch (error) {
  // Cleanup if needed
  await rollback()

  // Return user-friendly error
  return { success: false, error: error.message }
}
```

---

## Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Code Style Guide](./CODE_STYLE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Prisma Schema](../prisma/schema.prisma)

---

**Last Updated:** 2025-11-25
**Maintained By:** Development Team
