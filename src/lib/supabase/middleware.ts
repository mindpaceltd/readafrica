import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from './middleware-client';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createMiddlewareClient(request, response);

  try {
    // This will refresh the session if it's expired
    await supabase.auth.getUser();
  } catch (e) {
    // The middleware is not able to connect to Supabase
    console.error('Middleware could not connect to Supabase:', e);
  }


  return response
}
