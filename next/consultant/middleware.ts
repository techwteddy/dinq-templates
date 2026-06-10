import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const hostname = request.headers.get('host')

    // Check if the request is coming from the 'www' subdomain
    if (hostname && hostname.startsWith('www.')) {
        const newHost = hostname.replace('www.', '')
        url.host = newHost
        return NextResponse.redirect(url, 301) // 301 is vital for SEO/GEO authority transfer
    }

    return NextResponse.next()
}