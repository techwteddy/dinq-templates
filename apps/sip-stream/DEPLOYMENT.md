# Deployment Guide

SipStream is configured to work on both Vercel and Netlify. Follow the instructions below for your preferred platform.

## Prerequisites

1. **Supabase Project**: Make sure you have your Supabase project set up with the following tables:

   - `games` table
   - `game_history` table
   - Authentication enabled

2. **Environment Variables**: You'll need these for both platforms:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Vercel Deployment (Recommended)

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `sip-stream` repository

### Step 2: Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### Step 3: Environment Variables

1. Go to Project Settings → Environment Variables
2. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your app
3. Your app will be available at `https://your-project.vercel.app`

## Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Choose your `sip-stream` repository

### Step 2: Configure Build Settings

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Node version**: 18 (set in `netlify.toml`)

### Step 3: Environment Variables

1. Go to Site Settings → Environment Variables
2. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your app
3. Your app will be available at `https://your-site.netlify.app`

## Database Setup

### Create Tables in Supabase

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create games table
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('kings-cup', 'never-have-i-ever', 'custom-deck')),
  players TEXT[] NOT NULL,
  current_drinks INTEGER DEFAULT 0 NOT NULL,
  current_player_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create game_history table
CREATE TABLE game_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  player TEXT NOT NULL,
  details JSONB
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Games are viewable by everyone" ON games FOR SELECT USING (true);
CREATE POLICY "Games can be created by authenticated users" ON games FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Games can be updated by authenticated users" ON games FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "History is viewable by everyone" ON game_history FOR SELECT USING (true);
CREATE POLICY "History can be created by authenticated users" ON game_history FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE game_history;
```

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all environment variables are set correctly
2. **Authentication Issues**: Verify Supabase URL and anon key are correct
3. **Real-time Not Working**: Ensure realtime is enabled in Supabase dashboard
4. **Database Errors**: Make sure tables are created with correct schema

### Platform-Specific Issues

#### Vercel

- If you get build errors, check the build logs in Vercel dashboard
- Ensure `output: 'standalone'` is set in `next.config.ts`

#### Netlify

- If routing doesn't work, check that `_redirects` file is in `public/` folder
- Verify `netlify.toml` configuration is correct

## Custom Domain

Both platforms support custom domains:

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Netlify

1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS as instructed

## Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Netlify**: Built-in analytics and form handling
- **Supabase**: Database monitoring and logs in dashboard
