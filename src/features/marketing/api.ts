import { apiRequest } from '@/lib/api-client';

export function submitContactMessage(input: {
  fullName: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
