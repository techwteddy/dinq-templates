# Before You Start - Important Notes

## ⚠️ Required Before Running

### 1. Supabase Project Setup
- [ ] Create a Supabase account at https://supabase.com
- [ ] Create a new project
- [ ] Wait for project to initialize (2-3 minutes)
- [ ] Go to Project Settings > API to get credentials

### 2. Get Your Credentials
Copy these from Supabase dashboard:
```
NEXT_PUBLIC_SUPABASE_URL       → Settings > API > URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  → Settings > API > anon (public) key
SUPABASE_SERVICE_ROLE_KEY      → Settings > API > service_role key
```

### 3. Create .env.local
Copy `.env.example` to `.env.local` and fill in:
```bash
cp .env.example .env.local
# Then edit .env.local with your Supabase credentials
```

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Initialize Database (CRITICAL)
```bash
node scripts/migrate.mjs
```

This creates:
- ✓ All database tables
- ✓ Indexes for performance
- ✓ Sample data (3 courses, 3 resources, 1 news)
- ✓ Admin user account

## ✅ Verification Steps

After running migration, verify in Supabase dashboard:

### Check Tables Exist
1. Go to Supabase dashboard
2. Click "SQL Editor" on left
3. Run: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
4. Should see: courses, resources, news, admin_users

### Check Default Data
1. In SQL Editor, run:
```sql
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM resources;
SELECT COUNT(*) FROM news;
```

Should return: 3, 3, 1

## 🚀 Start Development

```bash
pnpm dev
```

Then open http://localhost:3000

## 🧪 Test Each Page

### Homepage
- Go to http://localhost:3000
- See hero section and feature cards
- ✓ Should load instantly

### Academics
- Click "Explore Courses" or go to /academics
- Should see 3 courses (CS101, CS201, CS301)
- Try searching and filtering
- ✓ All courses should appear

### Resources
- Go to /resources
- Should see 3 resources
- Try filtering by course
- ✓ Resources should appear

### News
- Go to /news
- Should see 1 welcome message
- ✓ News should appear

### Admin Panel
- Go to /admin/login
- Email: `stessaedu@gmail.com`
- Password: `admin123stessa`
- ✓ Should log in successfully
- ✓ Should see admin dashboard
- Try adding a new course
- Refresh academis page
- ✓ New course should appear

## 🔍 Troubleshooting

### "Module not found: @supabase/supabase-js"
```bash
pnpm install
```

### "Cannot connect to Supabase"
1. Check .env.local exists
2. Verify credentials are correct
3. Check Supabase project status (not paused)
4. Try: `pnpm dev --verbose` for more info

### "No courses after migration"
1. Verify migration ran: `node scripts/migrate.mjs`
2. Check Supabase dashboard - do tables exist?
3. Run migration again

### "Admin login fails"
1. Clear browser localStorage: DevTools > Application > Storage > Clear
2. Try again with: stessaedu@gmail.com / admin123stessa
3. Verify admin_users table has a record

### "Courses not syncing between tabs"
1. This is expected - refresh page to see latest
2. For live sync, you'd need Supabase realtime subscriptions (advanced)
3. Current implementation refetches on page load

## 📱 Test Multi-Device Sync

1. Open app on Device A
2. Log in to admin on Device A
3. Add a new course titled "Test Course"
4. Open app on Device B (same browser, refresh)
5. Go to /academics on Device B
6. ✓ Should see new "Test Course"

## 🎯 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Blank page | Check browser console for errors (F12) |
| 404 on /admin | Not logged in - go to /admin/login first |
| Data not saving | Check Supabase status, verify credentials |
| Slow performance | Check Supabase connection, network speed |
| "CORS error" | Supabase URL might be wrong - verify in .env.local |

## 📋 Pre-Deployment Checklist

- [ ] All pages load correctly
- [ ] Admin login works
- [ ] Can add/edit/delete courses
- [ ] Can add/edit/delete resources
- [ ] Can add/edit/delete news
- [ ] No browser console errors
- [ ] Search/filter works on all pages
- [ ] Tested on mobile browser

## 🚀 Ready to Deploy?

1. Read `DEPLOYMENT.md`
2. Push code to GitHub
3. Connect to Vercel
4. Add environment variables
5. Deploy!

## 📚 Documentation Files

- `QUICKSTART.md` - 5-minute setup (THIS IS RECOMMENDED STARTING POINT)
- `README.md` - Complete guide
- `DEPLOYMENT.md` - How to deploy
- `MIGRATION.md` - Technical details
- `FILE_STRUCTURE.md` - Project layout

## 🆘 Need Help?

1. Check the docs in this folder
2. Look at console errors (F12)
3. Verify Supabase credentials
4. Try clearing .env.local and re-adding keys
5. Run migration again: `node scripts/migrate.mjs`

## ✨ You're Ready!

Once you see courses loading on `/academics`, you're good to go! 🎉

Next: Follow `QUICKSTART.md` for step-by-step instructions.

---

**Remember**: 
- ⚠️ Never commit `.env.local` to git
- ⚠️ Never share `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ Change admin password after first login in production
- ✅ Keep backups of your Supabase data
