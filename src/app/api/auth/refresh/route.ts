import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '@/lib/refresh-cookie';
import { BACKEND_API_URL, REFRESH_TOKEN_COOKIE } from '@/lib/server-config';

/**
 * Reads the httpOnly refresh-token cookie, exchanges it for a new token pair, fetches the
 * current user with the new access token, rotates the cookie, and returns
 * { user, accessToken, expiresIn } to the client. Used both for silent session restore on
 * app load and whenever the in-memory access token expires.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false, message: 'No active session' }, { status: 401 });
  }

  const refreshRes = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const refreshPayload = await refreshRes.json();

  if (!refreshRes.ok || !refreshPayload.success) {
    const response = NextResponse.json(refreshPayload, { status: refreshRes.status });
    clearRefreshTokenCookie(response);
    return response;
  }

  const tokens = refreshPayload.data;

  const meRes = await fetch(`${BACKEND_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });
  const mePayload = await meRes.json();

  if (!meRes.ok || !mePayload.success) {
    const response = NextResponse.json(mePayload, { status: meRes.status });
    clearRefreshTokenCookie(response);
    return response;
  }

  const response = NextResponse.json({
    success: true,
    message: 'Session restored',
    data: { user: mePayload.data, accessToken: tokens.accessToken, expiresIn: tokens.expiresIn },
  });
  setRefreshTokenCookie(response, tokens.refreshToken);
  return response;
}
