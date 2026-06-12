# Admin Authentication System

## Overview
The LASU STESSA Hub now features a separate admin authentication system with email validation, multiple admin support, and onboarding flow.

## Admin Login/Signup

### Email Requirements
- **Primary**: `@lasu.edu.ng` domain (LASU faculty/staff)
- **Fallback**: `stessaedu@gmail.com` (for testing/backup access)

### Pages
- **Admin Login**: `/admin/login` - Black background for visibility, email validation
- **Admin Signup**: `/admin/sign-up` - Create new admin account with full name
- **Admin Success**: `/admin/sign-up-success` - Confirmation page after signup

### Features
- Email verification requirement (users must confirm email before full access)
- Password strength requirements (minimum 8 characters)
- Dark theme for admin interface
- Smooth animations and loading states
- Admin link appears in navigation when not authenticated

## Admin Onboarding

### Onboarding Flow
Located in `/components/admin-onboarding-flow.tsx`

The onboarding displays 6 steps:
1. Welcome to LASU Admin Portal
2. Manage Faculty
3. Create Events
4. Manage Courses
5. File Management
6. Final message: "We are LASU We are Great!"

### Features
- Shows only on first admin login (tracked via localStorage)
- Can be skipped at any time
- Progress bar shows current step
- Step indicators at bottom
- Persists onboarding_shown flag in localStorage

## Admin Dashboard

### Location
`/admin/dashboard`

### Features
- Admin access verification
- Session management
- Onboarding display on first visit
- Quick stats section (Faculty, Courses, Events, Active Users)
- Content Management modules linking to:
  - Faculty Management (`/admin/faculty`)
  - Events Management (`/admin/events`)
  - Courses Management (`/admin/courses`)
  - Resources Management
  - News Management
  - FAQ Management

## Security & Validation

### Email Validation
```typescript
const validateEmail = (email: string): boolean => {
  return email.endsWith('@lasu.edu.ng') || email === 'stessaedu@gmail.com';
};
```

### Multiple Admin Support
- All admins have identical permissions
- Each admin uses their own account
- All admins can perform the same CRUD operations
- Identified by their email address in the dashboard

## Database Integration

### User Metadata
Admins are created with metadata:
```typescript
user_type: 'admin'
full_name: // admin's full name
```

### Storage
- Onboarding state: localStorage key `admin_onboarding_shown`
- Session: Managed by Supabase Auth

## UI/UX Improvements

### Dark Theme
- Admin pages use dark slate background (`bg-slate-950`, `bg-slate-900`)
- Improved contrast and visibility
- Professional appearance for admin tools

### Menu Visibility
- Mobile menu button now has black background (`bg-black`)
- White hamburger icon for contrast
- Clearly visible on all screen sizes

### Login Page
- Black background card (`bg-black`)
- Gray input fields (`bg-gray-900`, `border-gray-600`)
- White text for visibility
- Accent color for buttons and highlights

## File Upload System
All admin management pages support drag-and-drop file uploads for:
- Faculty images
- Event media (images/videos)
- Course materials
- Profile pictures

## Navigation Updates
- Added "Admin Login" button to navigation
- Shows in mobile menu when not authenticated
- Links to `/admin/login`
- Separate from student login flow
