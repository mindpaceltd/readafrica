// src/lib/supabase/middleware-client.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest } from 'next/server'
import type { Database } from '../database.types';

export function createMiddlewareClient(request: NextRequest, response: { cookies: { set: (name: string, value: string, options: CookieOptions) => void }}) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({ name, value, ...options })
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set(name, '', options)
        },
      },
    }
  )
}
