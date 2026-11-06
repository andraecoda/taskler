'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { resetPassword } from '@/features/auth/api';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/schemas';
import { Alert } from '@/components/ui/Alert';
import { PremiumButton } from '@/components/premium/Button';
import { Card } from '@/components/premium/Card';
import { PremiumFormField } from '@/components/premium/FormField';
import { PremiumInput } from '@/components/premium/Input';
import { getErrorMessage } from '@/lib/error-message';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  if (!token) {
    return (
      <Card>
        <Alert variant="error">This reset link is missing a token. Check the link in your email.</Alert>
      </Card>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      const result = await resetPassword(token, values.newPassword);
      setMessage(result.message);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  if (message) {
    return (
      <Card>
        <Alert variant="success">{message}</Alert>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-pd-accent hover:text-pd-accent/80">
          Go to login
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-1 font-pd-display text-xl font-semibold text-pd-text">Reset your password</h1>
      <p className="mb-6 text-sm text-pd-text-muted">Choose a new password for your account.</p>

      {serverError && (
        <div className="mb-4">
          <Alert variant="error">{serverError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PremiumFormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
          <PremiumInput
            id="newPassword"
            type="password"
            autoComplete="new-password"
            hasError={!!errors.newPassword}
            {...register('newPassword')}
          />
        </PremiumFormField>

        <PremiumButton type="submit" isLoading={isSubmitting} className="w-full">
          Reset password
        </PremiumButton>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
