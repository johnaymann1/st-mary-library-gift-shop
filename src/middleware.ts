import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Add performance and security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

    // Add cache control for static assets
    if (
        request.nextUrl.pathname.startsWith('/_next/static') ||
        request.nextUrl.pathname.startsWith('/images')
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        )
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected Routes
    const protectedRoutes = ['/account', '/orders', '/checkout']
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Profile Completion Enforcement
    // If user is logged in, check if they have a phone number
    if (user) {
        const isCompleteProfilePage = request.nextUrl.pathname === '/complete-profile'
        const isSignOut = request.nextUrl.pathname === '/auth/signout' // or action

        // Check metadata first (faster), then maybe DB if needed (but metadata should be synced)
        // We'll rely on metadata 'phone' or 'user_metadata.phone'
        // Note: Supabase Auth 'phone' field is separate from 'user_metadata'
        const hasPhone = user.phone || user.user_metadata?.phone

        if (!hasPhone && !isCompleteProfilePage && !isSignOut) {
            return NextResponse.redirect(new URL('/complete-profile', request.url))
        }

        // If they HAVE a phone but try to go to complete-profile, send them home
        if (hasPhone && isCompleteProfilePage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
