LASU STESSA Resource Hub

A modern, open-source resource management platform originally built for the LASU STESSA (Science, Technology, Engineering and Skills Services for Africa) program.
It provides a centralized way to manage courses, academic materials, and departmental updates — designed to be easily adaptable by any faculty or institution.

Why This Project Exists

Universities and faculties typically rely on scattered WhatsApp groups, unsecured Google Drive folders, or outdated departmental sites.
This project consolidates everything into a structured, maintainable, open-source system that anyone can deploy or customize.

Key Features
Course Management – Browse and organize courses by department
Resource Library – PDFs, videos, documents, and links mapped to courses
News & Announcements – Central place for departmental updates
Admin Dashboard – Full CRUD control for content managers
Real-time Sync using Supabase
Mobile-first UI powered by Tailwind CSS & shadcn/ui
Tech Stack
Frontend: Next.js 16, React 19, TypeScript
UI: Tailwind CSS v4, shadcn/ui
Backend/Database: Supabase (PostgreSQL)
Auth: Session-based admin authentication
Getting Started
Prerequisites
Node.js 18+
pnpm
Supabase project
Environment Variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
Installation
pnpm install
node scripts/migrate.mjs
pnpm dev

To build:

pnpm build
pnpm start
Deployment

Deploy to Vercel:

vercel deploy

Add your Supabase environment variables in your Vercel dashboard.

Database Schema
courses
course_id
title
code
department
description
resources
resource_id
course_id
title
type
url
description
news
news_id
title
content
date
author
admin_users
admin_id
email
password_hash
Project Structure
app/
  page.tsx
  academics/
  resources/
  news/
  admin/
    login/
components/
  navigation.tsx
  ui/
lib/
  storage.ts
scripts/
  migrate.mjs
Troubleshooting
Database not syncing
Confirm all Supabase environment variables
Run the migration script again
Verify Supabase API access
Admin login failing
Ensure admin account exists in admin_users
Clear browser sessions
Check Supabase logs
Contributing

Contributions are welcome!
See the CONTRIBUTING.md for full guidelines.

License

MIT License.
You are free to use, modify, and distribute this software.

Acknowledgements

Originally built for the LASU STESSA program — now open-sourced to help other institutions and developers.
