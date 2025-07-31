
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // If user is logged in
  if (user && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.is_admin || false
    const role = profile?.role

    // Redirect logged-in users away from auth pages
    if (['/login', '/signup', '/forgot-password'].includes(pathname)) {
        let redirectUrl = '/my-books';
        if (isAdmin) redirectUrl = '/admin';
        else if (role === 'publisher') redirectUrl = '/publisher/books';
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Protect publisher routes
    if (pathname.startsWith('/publisher') && role !== 'publisher' && !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }

  } else {
    // Protect routes that require authentication
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
