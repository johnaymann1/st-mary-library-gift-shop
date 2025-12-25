import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware for handling authentication, security headers, and profile completion
 * This runs on every request before reaching the page/API route
 */
export async function middleware(request: NextRequest) {
    // Initialize response with current request headers
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Add security headers to protect against common vulnerabilities
    response.headers.set('X-Frame-Options', 'DENY') // Prevent clickjacking
    response.headers.set('X-Content-Type-Options', 'nosniff') // Prevent MIME type sniffing
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin') // Control referrer information

    // Cache static assets for better performance
    if (
        request.nextUrl.pathname.startsWith('/_next/static') ||
        request.nextUrl.pathname.startsWith('/images')
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable' // Cache for 1 year
        )
    }

    // Initialize Supabase client with cookie handling for auth persistence
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Read all cookies from the request
                getAll() {
                    return request.cookies.getAll()
                },
                // Update cookies on the request and response
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get the currently authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    /**
     * Protected Routes - require authentication
     * Users must be logged in to access these routes
     */
    const protectedRoutes = ['/account', '/orders', '/checkout']
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Redirect to login if trying to access protected route without authentication
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    /**
     * Profile Completion Enforcement
     * Ensure all logged-in users have a phone number for delivery coordination
     */
    if (user) {
        const isCompleteProfilePage = request.nextUrl.pathname === '/complete-profile'
        const isSignOut = request.nextUrl.pathname === '/auth/signout'

        // Check if user has provided their phone number
        // Phone is stored in user metadata or auth.phone field
        const hasPhone = user.phone || user.user_metadata?.phone

        // Redirect to profile completion if phone is missing
        if (!hasPhone && !isCompleteProfilePage && !isSignOut) {
            return NextResponse.redirect(new URL('/complete-profile', request.url))
        }

        // Redirect to home if profile is already complete
        if (hasPhone && isCompleteProfilePage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

/**
 * Configure which routes this middleware should run on
 * Excludes static files, images, and Next.js internal routes
 */
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
