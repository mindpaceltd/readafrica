
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

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
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/'];
    if (publicRoutes.includes(pathname)) {
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

    // Protect user routes for other roles
    if (pathname.startsWith('/my-books') && role !== 'reader' && !isAdmin) {
         return NextResponse.redirect(new URL(`/${role}`, request.url))
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
