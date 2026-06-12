# Authentication System Documentation

## Overview
A complete email-based authentication system with onboarding flow for LASU STESA Hub. Users must sign up or log in before accessing the main site.

## Features Implemented

### 1. **Authentication Pages**
- **Login Page** (`/app/auth/login/page.tsx`) - Beautiful login form with animations
- **Sign Up Page** (`/app/auth/sign-up/page.tsx`) - Registration with form validation
- **Sign Up Success Page** (`/app/auth/sign-up-success/page.tsx`) - Post-signup confirmation
- **Error Page** (`/app/auth/error/page.tsx`) - Auth error handling

### 2. **Onboarding Flow**
- Multi-step onboarding component (`/components/onboarding-flow.tsx`)
- 4-step welcome tutorial with animations
- Shows only on first signup (persisted in localStorage)
- Finalizing message: "We are LASU We are Great"

### 3. **Supabase Integration**
- Client-side auth setup (`/lib/supabase/client.ts`)
- Server-side auth setup (`/lib/supabase/server.ts`)
- Proxy session handling (`/lib/supabase/proxy.ts`)
- Middleware for route protection (`/middleware.ts`)

### 4. **Session Management**
- Session persistence via Supabase
- Auto token refresh via middleware
- Logout functionality with immediate redirect

### 5. **User Experience**
- Email validation
- Password strength requirements (8+ characters)
- Real-time form validation
- Loading animations with spinner
- Success/error message feedback
- Smooth page transitions

### 6. **Route Protection**
- Protected pages redirect to login if not authenticated
- Main homepage requires authentication
- Auth pages are publicly accessible

## User Flow

1. **First Visit** → Redirected to `/auth/login`
2. **New User** → Click "Create one" → Fill `/auth/sign-up` form
3. **Validation** → Client-side validation on form fields
4. **Account Created** → Redirected to `/auth/sign-up-success`
5. **Onboarding** → Multi-step tutorial (first time only)
6. **Email Confirmation** → User receives confirmation email from Supabase
7. **After Confirmation** → Full access to site features
8. **Return Visits** → Login with email/password

## Technical Architecture

### Authentication Flow
```
User → Sign Up/Login Page → Supabase Auth → Session Created → 
Onboarding (first time) → Main App → Middleware manages token refresh
```

### Database Schema
- `profiles` table - Stores user profile data
- Auto-created via trigger on auth signup
- Stores: email, full_name, user_type, onboarding_shown flag

### State Management
- Supabase provides session state
- localStorage for onboarding flag
- Real-time auth state changes via subscription

## Security Features

1. **Email Verification** - Required before full access
2. **Password Requirements** - Minimum 8 characters
3. **Session Management** - Server-side token refresh
4. **Row Level Security** - Users only access their data
5. **Secure Redirects** - Confirmed email required for session

## File Structure

```
app/
├── auth/
│   ├── login/page.tsx
│   ├── sign-up/page.tsx
│   ├── sign-up-success/page.tsx
│   └── error/page.tsx
├── page.tsx (protected)
└── layout.tsx

lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── proxy.ts
├── auth-context.tsx
└── storage.ts

components/
├── onboarding-flow.tsx
├── protected-layout.tsx
└── navigation.tsx (with logout)

middleware.ts
scripts/
└── auth-setup.sql
```

## Environment Variables

Automatically set by Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

## Testing the System

### Sign Up
1. Go to `/auth/sign-up`
2. Fill form with email, password, full name
3. Submit → Account created
4. View onboarding tutorial
5. Check email for confirmation link

### Log In
1. Go to `/auth/login`
2. Enter credentials
3. Submit → Redirected to homepage
4. Click "Logout" in navigation → Back to login

### Onboarding
- First time: Shows 4-step tutorial
- Return visits: Skipped (flag persisted)
- Can manually skip during tutorial

## Next Steps

To fully enable this system:

1. **Execute Database Migration**
   ```bash
   # Run in Supabase SQL editor or via CLI
   psql -U postgres < scripts/auth-setup.sql
   ```

2. **Test in Preview** - Sign up, confirm email, browse site

3. **Custom Admin Panel** - Currently shows admin login link (can be updated to use Supabase admin role)

4. **Email Templates** - Customize Supabase email confirmation template

5. **Additional Validations** - Add more fields (student ID, department, etc.) as needed

## API Examples

### Sign Up
```typescript
const { error } = await supabase.auth.signUp({
  email: 'student@lasu.edu.ng',
  password: 'SecurePassword123',
  options: {
    emailRedirectTo: `${origin}/auth/sign-up-success`,
    data: { full_name: 'John Doe', user_type: 'student' }
  }
});
```

### Sign In
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: 'student@lasu.edu.ng',
  password: 'SecurePassword123'
});
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```
