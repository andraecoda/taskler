import { ApiRequestError } from './api-types';

/** Turns an ApiRequestError (or anything else thrown) into a single user-facing string. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      return error.errors.join(' ');
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
