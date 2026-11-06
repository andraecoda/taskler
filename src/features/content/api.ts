import { apiRequest } from '@/lib/api-client';
import type { Faq } from './types';

/** GET /faqs is public and returns only published FAQs, pre-sorted by sortOrder. */
export function fetchFaqs(): Promise<Faq[]> {
  return apiRequest<Faq[]>('/faqs');
}
