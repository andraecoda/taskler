// Server-only config used by the /api/auth/* route handlers.
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Must stay in the same ballpark as the backend's REFRESH_TOKEN_TTL_DAYS (see
// backend/.env.example) — this only bounds how long the browser keeps the cookie, the
// backend independently enforces the token's real expiry.
export const REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
