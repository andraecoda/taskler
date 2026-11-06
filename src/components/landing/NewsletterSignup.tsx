'use client';

import { FormEvent, useState } from 'react';
import { PremiumButton } from '@/components/premium/Button';
import { PremiumInput } from '@/components/premium/Input';
import { subscribeNewsletter } from '@/features/marketing/api';
import { newsletterSchema } from '@/features/marketing/schemas';
import { getErrorMessage } from '@/lib/error-message';

export function NewsletterSignup({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setState('error');
      setMessage(parsed.error.issues[0]?.message ?? 'Enter a valid email address');
      return;
    }

    setState('loading');
    setMessage(null);
    try {
      const result = await subscribeNewsletter(parsed.data.email);
      setState('success');
      setMessage(result.message);
      setEmail('');
    } catch (err) {
      setState('error');
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_auto]" noValidate>
        <PremiumInput
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hasError={state === 'error'}
        />
        <PremiumButton type="submit" isLoading={state === 'loading'}>
          Subscribe
        </PremiumButton>
      </form>
      {state === 'success' && <p className="mt-2 text-[13px] text-pd-accent">{message}</p>}
      {state === 'error' && <p className="mt-2 text-[13px] text-red-600">{message}</p>}
    </div>
  );
}
