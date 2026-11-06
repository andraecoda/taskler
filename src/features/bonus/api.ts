import { apiRequest } from '@/lib/api-client';
import type { Item } from '@/features/kobo/types';

/** GET /items is public — the bonus catalog is browsable without an account. */
export function fetchBonusItems(): Promise<Item[]> {
  return apiRequest<Item[]>('/items');
}
