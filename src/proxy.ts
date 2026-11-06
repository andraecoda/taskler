import { NextRequest, NextResponse } from 'next/server';
import { REFRESH_TOKEN_COOKIE } from '@/lib/server-config';

const PROTECTED_PREFIXES = ['/dashboard'];
const AUTH_ONLY_PAGES = ['/login', '/register'];

/**
 * UX convenience only — redirects based on cookie *presence*, not validity. The backend
 * remains the real authorization boundary; a stale/expired cookie just results in the
 * client-side silent-refresh failing and AuthProvider redirecting to /login itself.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE);
  const { pathname } = request.nextUrl;

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ONLY_PAGES.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
