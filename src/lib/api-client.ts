import { ApiRequestError } from './api-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

interface ApiResponseShape {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: unknown;
  meta?: Record<string, unknown>;
}

async function parseAndUnwrap<T>(res: Response): Promise<T> {
  const payload = (await res.json()) as ApiResponseShape;
  if (!res.ok || !payload.success) {
    throw new ApiRequestError(payload.message || 'Request failed', res.status, payload.errors, payload.meta);
  }
  return payload.data as T;
}

/** Unauthenticated request straight to the backend (register, verify-email, etc.). */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  return parseAndUnwrap<T>(res);
}

/**
 * Authenticated request straight to the backend, using an in-memory access token. A FormData
 * body (file upload) skips the default JSON content-type so the browser can set its own
 * multipart boundary instead.
 */
export async function apiAuthenticatedRequest<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return parseAndUnwrap<T>(res);
}
