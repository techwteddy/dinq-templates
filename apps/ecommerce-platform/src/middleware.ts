import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Admin email whitelist
const ADMIN_EMAILS = ['healmitraayurvedicproducts@gmail.com']

export default clerkMiddleware(async (auth, req) => {
    console.log('═══════════════════════════════════════')
    console.log('🚀 MIDDLEWARE EXECUTING')
    console.log('📍 Path:', req.nextUrl.pathname)

    const { userId, sessionClaims } = await auth()

    console.log('👤 UserId:', userId || 'NOT_LOGGED_IN')

    // Not logged in
    if (!userId) {
        if (isAdminRoute(req)) {
            console.log('❌ No auth - redirecting to sign-in')
            return NextResponse.redirect(new URL('/sign-in?redirect_url=/admin', req.url))
        }
        return NextResponse.next()
    }

    // Logged in - fetch full user to get email
    try {
        console.log('🔍 Fetching user from Clerk API...')
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const userEmail = user.primaryEmailAddress?.emailAddress || ''

        console.log('📧 Email from Clerk API:', userEmail)

        // Check role from metadata
        const role = (user.publicMetadata as any)?.role
        console.log('🎯 Role from metadata:', role || 'NO_ROLE')

        // Check if admin
        const isAdminEmail = ADMIN_EMAILS.includes(userEmail.toLowerCase())
        const isAdmin = role === 'admin' || isAdminEmail

        console.log('✅ Is Admin Email:', isAdminEmail)
        console.log('🎯 FINAL ADMIN STATUS:', isAdmin)
        console.log('═══════════════════════════════════════')

        // Redirect admin to dashboard
        if (req.nextUrl.pathname === '/' && isAdmin) {
            console.log('✅✅✅ REDIRECTING ADMIN TO /admin ✅✅✅')
            return NextResponse.redirect(new URL('/admin', req.url))
        }

        // Protect admin routes
        if (isAdminRoute(req)) {
            console.log('🔒 Admin route accessed')

            if (!isAdmin) {
                console.log('❌ Not admin - redirecting to home')
                return NextResponse.redirect(new URL('/', req.url))
            }

            console.log('✅ Admin access granted')
        }
    } catch (err) {
        console.error('❌ Error fetching user from Clerk:', err)
        // Fallback: if we can't fetch user, but accessing admin route, maybe fail safe?
        // For now, let it proceed to next() or blocking if strict.
        // However, if we can't verify admin, safely blocking admin routes is better.
        if (isAdminRoute(req)) {
            console.log('❌ Verification failed - blocking admin access')
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
