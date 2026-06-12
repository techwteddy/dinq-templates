# Supabase Setup Guide for LASU STESSA Resource Hub

This guide will help you set up Supabase properly so the resource hub works correctly with database and file storage.

## Prerequisites

- Supabase account (create at https://supabase.com)
- Project deployed to Vercel OR local development environment
- Node.js and pnpm installed locally

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Give it a name: "LASU-STESSA-Hub"
4. Choose a region closest to your location
5. Create a strong database password
6. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Credentials

Once the project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Environment Variables

### For Local Development:
Create a `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### For Vercel Deployment:
1. Go to your Vercel project settings
2. Click **Environment Variables**
3. Add all three variables above:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Run Database Migrations

From your project directory, run:

```bash
pnpm run migrate
```

This will:
- Create the courses table
- Create the resources table (with file upload support)
- Create the news table
- Create the resources storage bucket
- Insert sample data

If you get an error, make sure your environment variables are set correctly.

## Step 5: Set Up Storage Bucket

The migration script creates a storage bucket automatically, but you can also set it up manually:

1. In Supabase Dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name it: `resources`
4. Make it **Public** (uncheck "Private bucket")
5. Leave other settings as default
6. Click **Create bucket**

### Configure Bucket Policies

1. Click on the `resources` bucket
2. Go to **Policies**
3. Click **New Policy** → **For full customization**
4. Choose `CREATE` and add this policy:
   ```
   SELECT, INSERT, UPDATE, DELETE on storage.objects
   where bucket_id = 'resources'
   and auth.role() = 'authenticated'
   ```
5. Save the policy

## Step 6: Test the Connection

Start your development server:

```bash
pnpm dev
```

Then:
1. Navigate to http://localhost:3000
2. You should see the homepage load
3. Go to `/admin/login`
4. Login with:
   - Email: `stessaedu@gmail.com`
   - Password: `admin123stessa`
5. Try creating a course and uploading a file

## Troubleshooting

### Error: "Supabase URL: Not set"
- Check your `.env.local` file
- Make sure you're using the correct Project URL (should start with `https://`)
- Restart your dev server after adding env vars

### File Upload Not Working
- Make sure the `resources` bucket exists and is public
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set
- Try uploading a small file first to test

### Courses/Resources Not Loading
- Make sure the migration has run successfully
- Check the Supabase dashboard to verify tables exist
- Look at browser console for specific error messages

### "Error: Invalid API key"
- Your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is incorrect
- Double-check it matches exactly in Supabase Settings → API

## Database Schema

### courses table
- `id` (UUID, primary key)
- `title` (text)
- `code` (text, unique)
- `department` (text)
- `description` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### resources table
- `id` (UUID, primary key)
- `title` (text)
- `course_id` (UUID, foreign key to courses)
- `type` (text: pdf, video, document, link, file, image, audio, other)
- `url` (text)
- `description` (text)
- `file_name` (text, optional)
- `file_size` (integer, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### news table
- `id` (UUID, primary key)
- `title` (text)
- `content` (text)
- `date` (date)
- `author` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Next Steps

After setup, you can:
1. Deploy to Vercel with environment variables
2. Share the public URL with other admins
3. All changes will sync in real-time across devices
4. Users can upload any file type to resources

For more information, see:
- README.md - Full project guide
- DEPLOYMENT.md - Production deployment
- QUICKSTART.md - Quick start guide
