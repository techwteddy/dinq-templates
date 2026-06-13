#!/bin/bash

# GitHub Projects Setup Script
# This script creates labels and issues for the project

echo "🚀 Setting up GitHub Projects..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed or not in PATH"
    echo "Please install it from: https://cli.github.com/"
    echo "Or run these commands manually in PowerShell/CMD"
    exit 1
fi

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo "❌ Not logged in to GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"
echo ""

# Create labels
echo "📋 Creating labels..."

gh label create p0-critical --color d73a4a --description "Critical priority - must be done ASAP" 2>/dev/null || echo "  ℹ️  p0-critical already exists"
gh label create p1-high --color ff9800 --description "High priority - important features" 2>/dev/null || echo "  ℹ️  p1-high already exists"
gh label create p2-medium --color ffd700 --description "Medium priority - nice to have" 2>/dev/null || echo "  ℹ️  p2-medium already exists"

gh label create feature --color 28a745 --description "New feature or enhancement" 2>/dev/null || echo "  ℹ️  feature already exists"
gh label create bug --color d73a4a --description "Bug fix" 2>/dev/null || echo "  ℹ️  bug already exists"
gh label create docs --color 0366d6 --description "Documentation update" 2>/dev/null || echo "  ℹ️  docs already exists"
gh label create security --color b60205 --description "Security-related" 2>/dev/null || echo "  ℹ️  security already exists"
gh label create enhancement --color 6f42c1 --description "Enhancement to existing feature" 2>/dev/null || echo "  ℹ️  enhancement already exists"

gh label create blocked --color d73a4a --description "Task is blocked" 2>/dev/null || echo "  ℹ️  blocked already exists"
gh label create needs-review --color ff9800 --description "Needs code review" 2>/dev/null || echo "  ℹ️  needs-review already exists"

echo "✅ Labels created"
echo ""

# Create issues for completed P0 tasks (closed)
echo "📝 Creating issues for completed tasks..."

gh issue create \
  --title "[P0] GitHub Repository Setup" \
  --label "p0-critical,feature,docs" \
  --body "**Status:** ✅ COMPLETED

## Description
Initialize Git repository, create GitHub remote, setup branch protection, and push initial codebase.

## Tasks Completed
- [x] Initialize git repository locally
- [x] Create .gitignore (exclude .env, node_modules, .next, .claude)
- [x] Create GitHub repository (private)
- [x] Add remote origin
- [x] Initial commit with all files
- [x] Push to master branch
- [x] Create development branch

## Acceptance Criteria
- ✅ Repository created on GitHub
- ✅ All code pushed to master branch
- ✅ .env files excluded from git
- ✅ Development branch created

**Completed:** 2025-11-10" 2>/dev/null && echo "  ✅ Issue #1 created: GitHub Repository Setup"

# Close the issue immediately
gh issue close 1 --comment "✅ Task completed before issue creation" 2>/dev/null

gh issue create \
  --title "[P0] Password Hashing Implementation" \
  --label "p0-critical,security,feature" \
  --body "**Status:** ✅ COMPLETED

## Description
Implement bcrypt password hashing for security. Previously passwords were stored in plain text.

## Tasks Completed
- [x] Install bcrypt: pnpm add bcrypt @types/bcrypt
- [x] Create password utility functions (hash, compare, validate)
- [x] Update register action to validate password strength
- [x] Update user creation to validate password strength
- [x] Update seed.ts to create Supabase Auth users
- [x] Test password hashing

## Files Modified
- \`lib/utils/password.ts\` (new)
- \`features/auth/actions/register.ts\`
- \`features/users/actions/create-user.ts\`
- \`prisma/seed.ts\`

## Security Impact
**HIGH** - Passwords now hashed with bcrypt via Supabase Auth

## Default Admin Credentials
- Email: admin@repairshop.com
- Password: Admin123!

**Completed:** 2025-11-10" 2>/dev/null && echo "  ✅ Issue #2 created: Password Hashing Implementation"

# Close the issue immediately
gh issue close 2 --comment "✅ Task completed before issue creation" 2>/dev/null

echo ""
echo "📝 Creating issues for pending tasks..."

gh issue create \
  --title "[P1] GitHub Projects Integration" \
  --label "p1-high,feature,docs" \
  --body "## Description
Setup GitHub Projects board for task management and sync with workflow.md.

## Tasks
- [ ] Create GitHub Project (Kanban board)
- [ ] Setup columns (Backlog, Todo, In Progress, Done)
- [ ] Create labels (P0, P1, P2, bug, feature, docs)
- [ ] Migrate tasks from workflow.md to GitHub Issues
- [ ] Link Issues to Project board
- [ ] Setup automation (move to \"In Progress\" when assigned)

## Files
- \`.github/workflows/sync-workflow.yml\` (optional automation)
- \`docs/github-projects-setup.md\`

## Acceptance Criteria
- [ ] GitHub Project board created
- [ ] All P0 tasks as Issues
- [ ] Issues linked to project
- [ ] Labels applied correctly

**Estimated Time:** 1 hour" 2>/dev/null && echo "  ✅ Issue #3 created: GitHub Projects Integration"

gh issue create \
  --title "[P1] Audit Logging System" \
  --label "p1-high,feature,security" \
  --body "## Description
Implement audit logging for all CRUD operations. Track who did what, when, and from where.

## Tasks
- [ ] Create AuditLog table in Prisma schema
- [ ] Create audit log service
- [ ] Add logging to all Server Actions
- [ ] Create audit log viewer UI (admin only)
- [ ] Add filters (user, action, date range)
- [ ] Add export functionality

## Files
- \`prisma/schema.prisma\` (add AuditLog model)
- \`features/audit/services/audit.service.ts\`
- \`features/audit/actions/get-audit-logs.ts\`
- \`features/audit/components/audit-log-table.tsx\`
- \`app/(dashboard)/audit-logs/page.tsx\`

## Schema
\`\`\`prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  action      String   // CREATE, UPDATE, DELETE
  resource    String   // users, branches, etc
  resourceId  String
  changes     Json?    // Before/after values
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}
\`\`\`

## Acceptance Criteria
- [ ] All CRUD operations logged
- [ ] Audit logs visible to admins
- [ ] Can filter by user, action, date
- [ ] Changes tracked (before/after)

**Estimated Time:** 4 hours" 2>/dev/null && echo "  ✅ Issue #4 created: Audit Logging System"

gh issue create \
  --title "[P2] File Upload with Supabase Storage" \
  --label "p2-medium,feature" \
  --body "## Description
Upload user avatars and branch logos using Supabase Storage.

## Tasks
- [ ] Setup Supabase Storage buckets
- [ ] Create storage utility functions
- [ ] Implement avatar upload for users
- [ ] Implement logo upload for branches
- [ ] Create file upload component
- [ ] Add image optimization
- [ ] Handle file deletion on user/branch delete

## Files
- \`lib/supabase/storage.ts\`
- \`features/users/actions/upload-avatar.ts\`
- \`features/branches/actions/upload-logo.ts\`
- \`components/shared/file-upload.tsx\`

## Acceptance Criteria
- [ ] Users can upload avatars
- [ ] Branches can upload logos
- [ ] Images are optimized and resized
- [ ] Old files are cleaned up properly

**Estimated Time:** 3 hours" 2>/dev/null && echo "  ✅ Issue #5 created: File Upload with Supabase Storage"

gh issue create \
  --title "[P2] Real-time Updates with Supabase" \
  --label "p2-medium,feature,enhancement" \
  --body "## Description
Implement real-time updates for collaborative features using Supabase Realtime.

## Features
- [ ] Real-time user list updates
- [ ] Real-time branch updates
- [ ] Real-time notifications
- [ ] Online/offline status indicators
- [ ] Toast notifications for real-time events

## Tasks
- [ ] Setup Supabase Realtime subscriptions
- [ ] Create real-time hooks
- [ ] Implement user presence
- [ ] Add notification system
- [ ] Handle reconnection logic

## Acceptance Criteria
- [ ] User list updates in real-time
- [ ] Branch changes reflect immediately
- [ ] Users see who's online
- [ ] Notifications work reliably

**Estimated Time:** 4 hours" 2>/dev/null && echo "  ✅ Issue #6 created: Real-time Updates with Supabase"

echo ""
echo "✅ All issues created!"
echo ""
echo "📊 Next steps:"
echo "1. Go to: https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/projects"
echo "2. Click 'New project'"
echo "3. Choose 'Board' template"
echo "4. Name it 'Development Roadmap'"
echo "5. Add all issues to the project board"
echo ""
echo "Or run: gh project create --owner aguswirajati --title 'Development Roadmap' --format board"
echo ""
