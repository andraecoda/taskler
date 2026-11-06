'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/Alert';
import { PremiumButton } from '@/components/premium/Button';
import { Card } from '@/components/premium/Card';
import { PremiumFormField } from '@/components/premium/FormField';
import { PremiumInput } from '@/components/premium/Input';
import { ApiRequestError } from '@/lib/api-types';
import { getErrorMessage } from '@/lib/error-message';
import { useAuth } from '@/lib/auth-context';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.push(searchParams.get('next') ?? '/dashboard');
    } catch (error) {
      if (error instanceof ApiRequestError && error.meta?.code === 'EMAIL_NOT_VERIFIED') {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}&resent=1`);
        return;
      }
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <h1 className="mb-1 font-pd-display text-xl font-semibold text-pd-text">Log in</h1>
      <p className="mb-6 text-sm text-pd-text-muted">Welcome back — enter your details below.</p>

      {serverError && (
        <div className="mb-4">
          <Alert variant="error">{serverError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PremiumFormField label="Email" htmlFor="email" error={errors.email?.message}>
          <PremiumInput id="email" type="email" autoComplete="email" hasError={!!errors.email} {...register('email')} />
        </PremiumFormField>

        <PremiumFormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PremiumInput
            id="password"
            type="password"
            autoComplete="current-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </PremiumFormField>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-pd-accent hover:text-pd-accent/80">
            Forgot password?
          </Link>
        </div>

        <PremiumButton type="submit" isLoading={isSubmitting} className="w-full">
          Log in
        </PremiumButton>
      </form>

      <p className="mt-6 text-center text-sm text-pd-text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-pd-accent hover:text-pd-accent/80">
          Sign up
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
