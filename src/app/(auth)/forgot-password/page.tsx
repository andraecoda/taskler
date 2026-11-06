'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '@/features/auth/api';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/schemas';
import { Alert } from '@/components/ui/Alert';
import { PremiumButton } from '@/components/premium/Button';
import { Card } from '@/components/premium/Card';
import { PremiumFormField } from '@/components/premium/FormField';
import { PremiumInput } from '@/components/premium/Input';
import { getErrorMessage } from '@/lib/error-message';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setMessage(null);
    try {
      const result = await requestPasswordReset(values.email);
      setMessage(result.message);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <h1 className="mb-1 font-pd-display text-xl font-semibold text-pd-text">Forgot your password?</h1>
      <p className="mb-6 text-sm text-pd-text-muted">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      {message && (
        <div className="mb-4">
          <Alert variant="success">{message}</Alert>
        </div>
      )}
      {serverError && (
        <div className="mb-4">
          <Alert variant="error">{serverError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PremiumFormField label="Email" htmlFor="email" error={errors.email?.message}>
          <PremiumInput id="email" type="email" autoComplete="email" hasError={!!errors.email} {...register('email')} />
        </PremiumFormField>

        <PremiumButton type="submit" isLoading={isSubmitting} className="w-full">
          Send reset link
        </PremiumButton>
      </form>

      <p className="mt-6 text-center text-sm text-pd-text-muted">
        <Link href="/login" className="font-medium text-pd-accent hover:text-pd-accent/80">
          Back to login
        </Link>
      </p>
    </Card>
  );
}
