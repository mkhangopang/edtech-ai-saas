import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login?redirect=/dashboard', req.url))
      }
    }

    // Redirect to dashboard if already logged in
    if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return res
  } catch (error) {
    console.error('Proxy error:', error)
    return res
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}