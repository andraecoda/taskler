import { NextRequest, NextResponse } from 'next/server';
import { setRefreshTokenCookie } from '@/lib/refresh-cookie';
import { BACKEND_API_URL } from '@/lib/server-config';

/**
 * Proxies login to the backend and moves the refresh token out of the JSON body into an
 * httpOnly cookie — the client never sees it. Only the access token (short-lived, kept
 * in memory client-side) and the user are returned in the response body.
 */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json();

  const backendRes = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await backendRes.json();

  if (!backendRes.ok || !payload.success) {
    return NextResponse.json(payload, { status: backendRes.status });
  }

  const { user, tokens } = payload.data;
  const response = NextResponse.json({
    success: true,
    message: payload.message,
    data: { user, accessToken: tokens.accessToken, expiresIn: tokens.expiresIn },
  });
  setRefreshTokenCookie(response, tokens.refreshToken);
  return response;
}
