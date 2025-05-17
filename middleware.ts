import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Extract user ID from URL (it's always the segment after /dashboard/)
    const pathParts = req.nextUrl.pathname.split('/');
    const dashboardIndex = pathParts.indexOf('dashboard');
    const urlUserId = pathParts[dashboardIndex + 1];

    // Check if user is accessing their own dashboard
    if (urlUserId && urlUserId !== session.user.id) {
      return NextResponse.redirect(new URL(`/dashboard/${session.user.id}`, req.url));
    }
  }

  // Update password page requires authentication
  if (req.nextUrl.pathname === '/update-password' && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect to dashboard if already authenticated
  if (session && (
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/register' ||
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname === '/reset-password'
  )) {
    return NextResponse.redirect(new URL(`/dashboard/${session.user.id}`, req.url));
  }

  // If accessing admin routes, verify admin status
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/login', '/register', '/reset-password', '/update-password', '/dashboard/:path*', '/admin/:path*'],
}; 