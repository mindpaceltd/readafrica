
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
    if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') {
        if (isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (role === 'publisher') {
            return NextResponse.redirect(new URL('/publisher/books', request.url))
        }
        return NextResponse.redirect(new URL('/my-books', request.url))
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Protect publisher routes
    if (pathname.startsWith('/publisher') && role !== 'publisher' && !isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url))
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
