
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware-client';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Role-based route protection
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.is_admin || false
    const role = profile?.role

    // If a logged-in user tries to access login/signup, redirect them
    const publicOnlyRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
    if (publicOnlyRoutes.includes(pathname)) {
        if (isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (role === 'publisher') {
            return NextResponse.redirect(new URL('/publisher', request.url))
        }
        // Default to reader dashboard if they have a role but are not admin/publisher
        if (role === 'reader') {
            return NextResponse.redirect(new URL('/my-books', request.url))
        }
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/my-books', request.url))
    }

    // Protect publisher routes
    if (pathname.startsWith('/publisher') && role !== 'publisher' && !isAdmin) {
        return NextResponse.redirect(new URL('/my-books', request.url))
    }

  } else {
    // Protect all sensitive routes if user is not logged in
    const protectedRoutes = ['/admin', '/publisher', '/my-books', '/cart']
    if (protectedRoutes.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/login', request.url))
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
