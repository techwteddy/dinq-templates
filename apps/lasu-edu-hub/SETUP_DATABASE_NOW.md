# SETUP DATABASE IMMEDIATELY

Your Supabase database tables are missing. Follow these steps now:

## Option 1: Using Supabase SQL Editor (Fastest - 2 minutes)

1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" on the left sidebar
4. Click "New Query"
5. Copy and paste the SQL from: `/scripts/setup-database.sql`
6. Click "Run"
7. Done! Tables are created

## Option 2: Using Migration Script

```bash
pnpm migrate
```

This will automatically set up all tables and insert sample data.

## Option 3: Manual Table Creation via Web Console

Go to Supabase Dashboard > Table Editor > New Table

Create these 3 tables:

### Table 1: courses
- id: uuid (Primary Key, default: gen_random_uuid())
- title: text (Not NULL)
- department: text (Not NULL)
- description: text
- code: text (Not NULL, Unique)
- created_at: timestamp with timezone (default: now())
- updated_at: timestamp with timezone (default: now())

### Table 2: resources
- id: uuid (Primary Key, default: gen_random_uuid())
- title: text (Not NULL)
- course_id: uuid (Foreign Key → courses.id)
- type: text (default: 'file')
- url: text (Not NULL)
- description: text
- file_name: text
- file_size: integer
- created_at: timestamp with timezone (default: now())
- updated_at: timestamp with timezone (default: now())

### Table 3: news
- id: uuid (Primary Key, default: gen_random_uuid())
- title: text (Not NULL)
- content: text (Not NULL)
- date: date (Not NULL)
- author: text (Not NULL)
- created_at: timestamp with timezone (default: now())
- updated_at: timestamp with timezone (default: now())

## What to Do Next

1. ✅ Create the tables (choose one method above)
2. ✅ Run `pnpm dev` to start the development server
3. ✅ Go to http://localhost:3000/admin
4. ✅ Login with: stessaedu@gmail.com / admin123stessa
5. ✅ The admin dashboard should now work without errors
6. ✅ Deploy to Vercel

---

**Status Check:**
- If you still see "PGRST205" errors after creating tables, wait 2-3 minutes for Supabase to refresh its schema cache
- If errors persist, check that your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
