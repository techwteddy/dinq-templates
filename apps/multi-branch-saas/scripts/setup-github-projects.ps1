# GitHub Projects Setup Script (PowerShell)
# Run this in PowerShell or Windows Terminal

Write-Host "🚀 Setting up GitHub Projects..." -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is installed
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed" -ForegroundColor Red
    Write-Host "Please install it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "Or use the manual web interface method (see docs/github-projects-setup.md)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI is ready" -ForegroundColor Green
Write-Host ""

# Create labels
Write-Host "📋 Creating labels..." -ForegroundColor Cyan

$labels = @(
    @{name="p0-critical"; color="d73a4a"; description="Critical priority - must be done ASAP"},
    @{name="p1-high"; color="ff9800"; description="High priority - important features"},
    @{name="p2-medium"; color="ffd700"; description="Medium priority - nice to have"},
    @{name="feature"; color="28a745"; description="New feature or enhancement"},
    @{name="bug"; color="d73a4a"; description="Bug fix"},
    @{name="docs"; color="0366d6"; description="Documentation update"},
    @{name="security"; color="b60205"; description="Security-related"},
    @{name="enhancement"; color="6f42c1"; description="Enhancement to existing feature"},
    @{name="blocked"; color="d73a4a"; description="Task is blocked"},
    @{name="needs-review"; color="ff9800"; description="Needs code review"}
)

foreach ($label in $labels) {
    gh label create $label.name --color $label.color --description $label.description 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Created: $($label.name)" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  $($label.name) already exists" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "📝 Creating issues for completed tasks..." -ForegroundColor Cyan

# Issue #1 - GitHub Repository Setup (Completed)
gh issue create `
  --title "[P0] GitHub Repository Setup" `
  --label "p0-critical,feature,docs" `
  --body @"
**Status:** ✅ COMPLETED

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

**Completed:** 2025-11-10
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Issue #1 created: GitHub Repository Setup" -ForegroundColor Green
    gh issue close 1 --comment "✅ Task completed before issue creation" 2>$null
}

# Issue #2 - Password Hashing (Completed)
gh issue create `
  --title "[P0] Password Hashing Implementation" `
  --label "p0-critical,security,feature" `
  --body @"
**Status:** ✅ COMPLETED

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
- ``lib/utils/password.ts`` (new)
- ``features/auth/actions/register.ts``
- ``features/users/actions/create-user.ts``
- ``prisma/seed.ts``

## Security Impact
**HIGH** - Passwords now hashed with bcrypt via Supabase Auth

## Default Admin Credentials
- Email: admin@repairshop.com
- Password: Admin123!

**Completed:** 2025-11-10
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Issue #2 created: Password Hashing Implementation" -ForegroundColor Green
    gh issue close 2 --comment "✅ Task completed before issue creation" 2>$null
}

Write-Host ""
Write-Host "📝 Creating issues for pending tasks..." -ForegroundColor Cyan

# Issue #3 - GitHub Projects Integration (Current)
gh issue create `
  --title "[P1] GitHub Projects Integration" `
  --label "p1-high,feature,docs" `
  --body @"
## Description
Setup GitHub Projects board for task management and sync with workflow.md.

## Tasks
- [ ] Create GitHub Project (Kanban board)
- [ ] Setup columns (Backlog, Todo, In Progress, Done)
- [ ] Create labels (P0, P1, P2, bug, feature, docs)
- [ ] Migrate tasks from workflow.md to GitHub Issues
- [ ] Link Issues to Project board
- [ ] Setup automation (move to "In Progress" when assigned)

## Files
- ``.github/workflows/sync-workflow.yml`` (optional automation)
- ``docs/github-projects-setup.md``

## Acceptance Criteria
- [ ] GitHub Project board created
- [ ] All P0 tasks as Issues
- [ ] Issues linked to project
- [ ] Labels applied correctly

**Estimated Time:** 1 hour
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Issue #3 created: GitHub Projects Integration" -ForegroundColor Green
}

# Issue #4 - Audit Logging System
gh issue create `
  --title "[P1] Audit Logging System" `
  --label "p1-high,feature,security" `
  --body @"
## Description
Implement audit logging for all CRUD operations. Track who did what, when, and from where.

## Tasks
- [ ] Create AuditLog table in Prisma schema
- [ ] Create audit log service
- [ ] Add logging to all Server Actions
- [ ] Create audit log viewer UI (admin only)
- [ ] Add filters (user, action, date range)
- [ ] Add export functionality

## Files
- ``prisma/schema.prisma`` (add AuditLog model)
- ``features/audit/services/audit.service.ts``
- ``features/audit/actions/get-audit-logs.ts``
- ``features/audit/components/audit-log-table.tsx``
- ``app/(dashboard)/audit-logs/page.tsx``

## Acceptance Criteria
- [ ] All CRUD operations logged
- [ ] Audit logs visible to admins
- [ ] Can filter by user, action, date
- [ ] Changes tracked (before/after)

**Estimated Time:** 4 hours
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Issue #4 created: Audit Logging System" -ForegroundColor Green
}

# Issue #5 - File Upload
gh issue create `
  --title "[P2] File Upload with Supabase Storage" `
  --label "p2-medium,feature" `
  --body @"
## Description
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
- ``lib/supabase/storage.ts``
- ``features/users/actions/upload-avatar.ts``
- ``features/branches/actions/upload-logo.ts``
- ``components/shared/file-upload.tsx``

## Acceptance Criteria
- [ ] Users can upload avatars
- [ ] Branches can upload logos
- [ ] Images are optimized and resized
- [ ] Old files are cleaned up properly

**Estimated Time:** 3 hours
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Issue #5 created: File Upload with Supabase Storage" -ForegroundColor Green
}

# Issue #6 - Real-time Updates
gh issue create `
  --title "[P2] Real-time Updates with Supabase" `
  --label "p2-medium,feature,enhancement" `
  --body @"
## Description
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

**Estimated Time:** 4 hours
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Issue #6 created: Real-time Updates with Supabase" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ All issues created!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/projects" -ForegroundColor White
Write-Host "2. Click 'New project'" -ForegroundColor White
Write-Host "3. Choose 'Board' template" -ForegroundColor White
Write-Host "4. Name it 'Development Roadmap'" -ForegroundColor White
Write-Host "5. Add all issues to the project board" -ForegroundColor White
Write-Host ""
Write-Host "View all issues: https://github.com/aguswirajati/nextjs-multi-branch-boilerplate/issues" -ForegroundColor Yellow
Write-Host ""
