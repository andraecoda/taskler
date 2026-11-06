# Taskler Frontend — Auth + Profile MVP

Next.js (App Router) frontend for the Task-Based Earning & Rewards Platform. This package
covers exactly what `taskler/backend` (Phase 1 — Foundation) supports today:
authentication and a real user profile. There is deliberately no navigation, dashboard
widgets, or pages for packages/tasks/wallet/goals/marketplace/withdrawals/referrals — none
of that exists in the backend yet, and building UI for it now would mean dead links or
fabricated data.

## Architecture

- **Token handling**: the refresh token lives only in an httpOnly/secure/sameSite cookie,
  set by a few Next.js Route Handlers (`src/app/api/auth/{login,refresh,logout}/route.ts`)
  that proxy to the backend. The short-lived access token is kept in memory only
  (`src/lib/auth-context.tsx`) — it is never written to `localStorage`/`sessionStorage`.
  Every other authenticated call (`GET/PATCH /users/me`) goes straight to the backend
  cross-origin, using the in-memory access token, relying on the backend's CORS config.
- **Registration/verification/password-reset** calls go directly to the backend
  (`src/features/auth/api.ts`) since they don't touch the refresh-token cookie — no need to
  proxy them through Next.js.
- **`src/proxy.ts`** (Next.js 16's replacement for `middleware.ts`) redirects based on
  refresh-token-cookie *presence* only — a UX convenience. The backend remains the real
  authorization boundary; a stale/expired cookie just makes the client-side silent-refresh
  fail and `AuthProvider` redirect to `/login` itself.
- **Types** in `src/lib/api-types.ts` and `src/features/auth/types.ts` mirror the backend's
  response envelope and entities field-for-field. They're duplicated, not shared, since
  frontend/backend are separate npm projects by design — keep them in sync manually if the
  backend contract changes.

## Getting started

Requires the backend running locally (see `../backend/README.md`) — set
`NEXT_PUBLIC_API_URL` below to point at it.

```bash
cp .env.local.example .env.local
# edit .env.local if the backend isn't at the default http://localhost:3000/api

npm install
npm run dev
```

If port 3000 is taken (e.g. the backend is on it), Next.js picks the next free port
automatically — check the backend's `CORS_ORIGIN` matches whatever port the frontend
actually starts on.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Run with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Structure

```
src/
  app/
    (auth)/          login, register, verify-email, forgot-password, reset-password
    (dashboard)/     protected layout + the profile page
    api/auth/        login/refresh/logout route handlers (httpOnly cookie management)
  components/ui/     Button, Input, FormField, Card, Alert, Spinner
  features/auth/     api calls, zod schemas, types
  lib/               auth-context, api-client, error-message, server-config
  providers/         TanStack Query + AuthProvider wiring
  proxy.ts           cookie-presence-based route redirects
```

## Verified

Registration → email verification (via the backend's console-logged link) → login →
profile view/edit with persistence → logout → protected-route redirect → forgot/reset
password round-trip, all driven end-to-end in a real headless-Chromium browser session
against the live backend + MySQL. No token ever appears in `localStorage`/`sessionStorage`.
