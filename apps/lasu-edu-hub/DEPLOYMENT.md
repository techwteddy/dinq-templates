# Deployment Checklist

Follow these steps to deploy the LASU STESSA Resource Hub to production:

## Pre-Deployment

- [ ] All code changes committed to git
- [ ] Tested locally with `pnpm dev`
- [ ] Built successfully with `pnpm build`
- [ ] No TypeScript errors
- [ ] Admin login works with credentials

## Supabase Setup

- [ ] Supabase project created
- [ ] Database migration executed: `node scripts/migrate.mjs`
- [ ] Tables created successfully:
  - [ ] courses
  - [ ] resources
  - [ ] news
  - [ ] admin_users
- [ ] Default data inserted (3 courses, 3 resources, 1 news item)
- [ ] Admin user created (stessaedu@gmail.com)

## Environment Variables

Ensure these are set in your deployment platform:

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SUPABASE_URL (for backend operations)
- [ ] SUPABASE_JWT_SECRET

## Vercel Deployment

- [ ] Vercel account created
- [ ] Project connected to GitHub repository
- [ ] Environment variables added to Vercel project settings
- [ ] Build and deployment successful
- [ ] Test all pages on production URL:
  - [ ] Homepage loads
  - [ ] Academics page displays courses
  - [ ] Resources page filters correctly
  - [ ] News page shows announcements
  - [ ] Admin login redirects correctly
  - [ ] Admin dashboard functions (CRUD operations)

## Post-Deployment

- [ ] Verify database connectivity from production
- [ ] Test cross-device data sync (add course on one device, check on another)
- [ ] Admin can add/edit/delete content
- [ ] All changes persist after refresh
- [ ] Share deployment URL with users
- [ ] Document admin credentials in secure location

## Monitoring

- [ ] Set up error logging (optional: Sentry integration)
- [ ] Monitor Supabase database usage
- [ ] Track application performance
- [ ] Set up automated backups for Supabase

## Rollback Plan

- [ ] Keep previous deployment version available
- [ ] Document rollback procedures
- [ ] Test rollback in staging environment

---

## Deployment Command

For Vercel CLI deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

For GitHub integration, push to main branch and Vercel will auto-deploy.

---

Once all checklist items are complete, the application is ready for production use!
