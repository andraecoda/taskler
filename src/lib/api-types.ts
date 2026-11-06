/**
 * Mirrors backend/src/common/interfaces/api-response.interface.ts — the response
 * envelope every backend endpoint uses. Kept in sync manually since frontend/backend are
 * separate repos by design (no shared-types package).
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  meta?: Record<string, unknown>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly errors?: unknown;
  readonly meta?: Record<string, unknown>;

  constructor(message: string, status: number, errors?: unknown, meta?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.errors = errors;
    this.meta = meta;
  }
}
