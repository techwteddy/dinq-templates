# Project Structure - LASU STESSA Resource Hub

```
lasu-stessa-resource-hub/
│
├── 📁 app/
│   ├── page.tsx                          # Homepage with hero section
│   ├── layout.tsx                        # Root layout (Supabase configured)
│   ├── globals.css                       # Tailwind v4 + custom colors
│   ├── 📁 academics/
│   │   └── page.tsx                      # Courses listing page (async)
│   ├── 📁 resources/
│   │   └── page.tsx                      # Resources filtering page (async)
│   ├── 📁 news/
│   │   └── page.tsx                      # News & announcements page (async)
│   └── 📁 admin/
│       ├── page.tsx                      # Admin dashboard (async CRUD)
│       └── 📁 login/
│           └── page.tsx                  # Admin login page
│
├── 📁 components/
│   ├── navigation.tsx                    # Main navigation bar
│   └── 📁 ui/                            # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── ... (other UI components)
│
├── 📁 lib/
│   ├── storage.ts                        # ⭐ Supabase client & functions
│   └── utils.ts                          # Utility functions (cn)
│
├── 📁 scripts/
│   ├── migrate.mjs                       # ⭐ Database initialization
│   └── init-supabase.sql                 # SQL schema (reference)
│
├── 📁 public/
│   ├── icon.svg                          # App icon
│   └── ... (other static assets)
│
├── 📁 styles/
│   └── globals.css                       # Global styles (backup reference)
│
├── 📋 Configuration Files
│   ├── .env.example                      # Environment variables template
│   ├── .gitignore                        # Git ignore rules
│   ├── components.json                   # shadcn/ui config
│   ├── next.config.mjs                   # Next.js config (Turbopack)
│   ├── package.json                      # Dependencies + scripts
│   ├── package-lock.json / pnpm-lock.yaml # Lock file
│   ├── postcss.config.mjs                # PostCSS config
│   ├── tailwind.config.ts                # Tailwind v4 config
│   ├── tsconfig.json                     # TypeScript config
│   └── ⚠️ .env.local (PRIVATE - NOT IN GIT)
│
├── 📚 Documentation
│   ├── README.md                         # ⭐ Start here - Full guide
│   ├── QUICKSTART.md                     # ⭐ 5-minute setup
│   ├── DEPLOYMENT.md                     # ⭐ Production deployment
│   ├── MIGRATION.md                      # Technical migration details
│   ├── SUPABASE_MIGRATION_COMPLETE.md    # Migration summary
│   ├── MIGRATION_SUMMARY.sh              # Bash summary script
│   └── FILE_STRUCTURE.md                 # This file
│
└── 📄 This File
```

## Key Directories Explained

### `/app`
Main application pages and routing. Uses Next.js App Router.

**Pages**:
- `/` - Homepage (public)
- `/academics` - Course listing (public)
- `/resources` - Resources filtering (public)
- `/news` - News announcements (public)
- `/admin/login` - Admin login (public)
- `/admin` - Admin dashboard (protected)

### `/components`
Reusable React components. Includes navigation and shadcn UI components.

**Key files**:
- `navigation.tsx` - Header/nav bar used on all pages
- `ui/*` - Pre-built UI components from shadcn

### `/lib`
Utility functions and libraries. **`storage.ts` is critical** - contains all Supabase integration.

**Functions in storage.ts**:
- Course CRUD: `getCourses()`, `addCourse()`, `updateCourse()`, `deleteCourse()`
- Resource CRUD: `getResources()`, `addResource()`, `updateResource()`, `deleteResource()`
- News CRUD: `getNews()`, `addNews()`, `updateNews()`, `deleteNews()`
- Auth: `verifyAdmin()`, `setAdminSession()`, `isAdminLoggedIn()`

### `/scripts`
Build and setup scripts.

**Files**:
- `migrate.mjs` - Run this to initialize Supabase database
- `init-supabase.sql` - Reference SQL schema

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies (includes @supabase/supabase-js) |
| `.env.example` | Template for environment variables |
| `next.config.mjs` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |
| `.gitignore` | Git ignore rules |

## File Modifications During Migration

### ✅ Modified Files
```
lib/storage.ts              (localStorage → Supabase)
app/academics/page.tsx      (sync → async)
app/resources/page.tsx      (sync → async)
app/news/page.tsx           (sync → async)
app/admin/page.tsx          (complete rewrite - async CRUD)
package.json                (added @supabase/supabase-js)
```

### ✨ New Files Created
```
scripts/migrate.mjs                      (Database initialization)
scripts/init-supabase.sql                (Reference schema)
.env.example                             (Environment template)
README.md                                (Complete guide)
QUICKSTART.md                            (5-minute setup)
DEPLOYMENT.md                            (Production checklist)
MIGRATION.md                             (Technical details)
SUPABASE_MIGRATION_COMPLETE.md           (Migration summary)
MIGRATION_SUMMARY.sh                     (Summary script)
FILE_STRUCTURE.md                        (This file)
```

## Important Files for Deployment

### Must Configure
- `.env.local` - Your Supabase credentials (create from `.env.example`)

### Must Run
- `scripts/migrate.mjs` - Initialize database

### Must Read Before Deploying
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Production deployment steps
- `README.md` - Complete documentation

## Database Structure

Supabase creates these tables:

```
┌─ courses
│  ├─ id (UUID)
│  ├─ title, code, department, description
│  └─ timestamps
│
├─ resources
│  ├─ id (UUID)
│  ├─ title, course_id (FK), type, url, description
│  └─ timestamps
│
├─ news
│  ├─ id (UUID)
│  ├─ title, content, date, author
│  └─ timestamps
│
└─ admin_users
   ├─ id (UUID)
   ├─ email, password_hash
   └─ timestamps
```

See `MIGRATION.md` for complete schema details.

## Data Flow

```
User Browser
     ↓
Next.js Page Component
     ↓
React Hook (useState/useEffect)
     ↓
lib/storage.ts (Supabase Client)
     ↓
Supabase PostgreSQL Database
```

## Environment Variables

### Required for Development
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Required for Admin/Production
```
SUPABASE_SERVICE_ROLE_KEY
```

Get these from your Supabase project dashboard.

## Quick Navigation

### To Get Started
1. Read `QUICKSTART.md`
2. Set up `.env.local`
3. Run `node scripts/migrate.mjs`
4. Run `pnpm dev`

### To Deploy
1. Read `DEPLOYMENT.md`
2. Push to GitHub
3. Connect to Vercel
4. Set environment variables
5. Deploy

### For Help
- `README.md` - Complete documentation
- `MIGRATION.md` - Technical details
- `SUPABASE_MIGRATION_COMPLETE.md` - What changed

---

**Total Files**: ~50+ (including components)  
**Documentation Files**: 8  
**Key Files Modified**: 6  
**Database Tables**: 4  
**Status**: ✅ Production Ready
