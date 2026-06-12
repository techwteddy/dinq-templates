# Quick Start Guide

Get the LASU STESSA Resource Hub up and running in minutes!

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Initialize Database

Run the migration script to set up Supabase tables and seed data:

```bash
node scripts/migrate.mjs
```

This will create:
- ✓ Database tables (courses, resources, news, admin_users)
- ✓ Indexes for performance
- ✓ Default sample data
- ✓ Admin user account

## 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Test the Application

### Public Pages
- **Homepage** - View at root `/`
- **Academics** - Browse courses at `/academics`
- **Resources** - Filter resources at `/resources`
- **News** - Read announcements at `/news`

### Admin Panel
- **Login** - Go to `/admin/login`
- **Credentials**:
  - Email: `stessaedu@gmail.com`
  - Password: `admin123stessa`
- **Dashboard** - Manage content at `/admin`

## 5. Create New Content

In the admin dashboard:

1. **Add a Course**:
   - Tab: Courses
   - Fill in: Title, Code, Department, Description
   - Click: Add Course

2. **Add a Resource**:
   - Tab: Resources
   - Select: Course, Type (PDF/Video/Document/Link)
   - Fill in: Title, URL, Description
   - Click: Add Resource

3. **Add News**:
   - Tab: News
   - Fill in: Title, Content, Date
   - Click: Add News

## 6. Test Multi-Device Sync

To verify real-time sync:

1. Open the app on two different devices
2. Add a course on Device 1
3. Refresh on Device 2
4. Verify the course appears immediately

## 7. Deploy to Production

### Option A: Vercel with GitHub

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel settings
4. Deploy!

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel deploy --prod
```

### Environment Variables Required

Set these in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
pnpm install
```

### "Database connection failed"
- Verify Supabase URL and keys in environment
- Check `.env.local` file exists with correct values
- Ensure Supabase project is active

### "Admin login doesn't work"
- Verify email/password: `stessaedu@gmail.com` / `admin123stessa`
- Run migration script: `node scripts/migrate.mjs`
- Clear browser localStorage

### "No courses appear"
- Check if migration ran successfully
- Query Supabase dashboard to verify data
- Run `node scripts/migrate.mjs` again

## File Structure

```
project/
├── app/
│   ├── page.tsx           # Homepage
│   ├── academics/         # Courses page
│   ├── resources/         # Resources page
│   ├── news/              # News page
│   └── admin/             # Admin pages
├── components/
│   ├── navigation.tsx     # Nav bar
│   └── ui/                # UI components
├── lib/
│   └── storage.ts         # Supabase client
├── scripts/
│   └── migrate.mjs        # Database setup
├── app/
│   └── globals.css        # Tailwind styles
└── package.json           # Dependencies
```

## Commands

```bash
# Development
pnpm dev          # Start dev server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Database
node scripts/migrate.mjs    # Initialize database

# Linting
pnpm lint         # Run ESLint
```

## Environment Setup

Create `.env.local` in project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get these from your Supabase project settings.

## Admin Login

**Email**: `stessaedu@gmail.com`  
**Password**: `admin123stessa`

⚠️ **Important**: Change these credentials after first login in production!

## Default Sample Data

The migration script automatically inserts:

**Courses**:
- CS101 - Introduction to Computer Science
- CS201 - Data Structures
- CS301 - Software Engineering

**Resources**:
- Python Basics Tutorial (Video)
- DSA Study Guide (PDF)
- Software Engineering Handbook (Document)

**News**:
- Welcome to STESSA announcement

## Next Steps

- [ ] Read `README.md` for full documentation
- [ ] Check `MIGRATION.md` for technical details
- [ ] Review `DEPLOYMENT.md` before going live
- [ ] Customize admin credentials (in production)
- [ ] Add your own courses and resources
- [ ] Share deployment URL with users!

## Support

For issues or detailed information, see:
- `README.md` - Complete guide
- `DEPLOYMENT.md` - Production deployment
- `MIGRATION.md` - Technical migration details

---

You're all set! Start with `pnpm dev` and begin exploring! 🚀
