import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { clearRefreshTokenCookie } from '@/lib/refresh-cookie';
import { BACKEND_API_URL, REFRESH_TOKEN_COOKIE } from '@/lib/server-config';

/** Revokes the refresh token on the backend (best-effort) and always clears the cookie. */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await fetch(`${BACKEND_API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {
      // Best-effort revocation — the cookie is cleared regardless below.
    });
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearRefreshTokenCookie(response);
  return response;
}
