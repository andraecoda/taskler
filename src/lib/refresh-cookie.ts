import { NextResponse } from 'next/server';
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS } from './server-config';

export function setRefreshTokenCookie(response: NextResponse, refreshToken: string): void {
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearRefreshTokenCookie(response: NextResponse): void {
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}
