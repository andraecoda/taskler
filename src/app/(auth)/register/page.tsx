'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser, resendVerification } from '@/features/auth/api';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas';
import { Alert } from '@/components/ui/Alert';
import { PremiumButton } from '@/components/premium/Button';
import { Card } from '@/components/premium/Card';
import { PremiumFormField } from '@/components/premium/FormField';
import { PremiumInput } from '@/components/premium/Input';
import { getErrorMessage } from '@/lib/error-message';

export default function RegisterPage() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const [serverError, setServerError] = useState<string | null>(null);

  const resendMutation = useMutation({ mutationFn: resendVerification });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        referralCode: values.referralCode || undefined,
      });
      setRegisteredEmail(values.email);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  if (registeredEmail) {
    return (
      <Card>
        <h1 className="mb-2 font-pd-display text-xl font-semibold text-pd-text">Check your email</h1>
        <p className="mb-4 text-sm text-pd-text-muted">
          We sent a verification link to <span className="font-medium text-pd-text">{registeredEmail}</span>.
          Click it to activate your account, then come back to log in.
        </p>
        {resendMutation.isSuccess && (
          <div className="mb-4">
            <Alert variant="success">Verification email resent.</Alert>
          </div>
        )}
        {resendMutation.isError && (
          <div className="mb-4">
            <Alert variant="error">{getErrorMessage(resendMutation.error)}</Alert>
          </div>
        )}
        <PremiumButton
          variant="secondary"
          isLoading={resendMutation.isPending}
          onClick={() => resendMutation.mutate(registeredEmail)}
          className="w-full"
        >
          Resend verification email
        </PremiumButton>
        <p className="mt-6 text-center text-sm text-pd-text-muted">
          <Link href="/login" className="font-medium text-pd-accent hover:text-pd-accent/80">
            Back to login
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-1 font-pd-display text-xl font-semibold text-pd-text">Create your account</h1>
      <p className="mb-6 text-sm text-pd-text-muted">Start earning by completing tasks.</p>

      {serverError && (
        <div className="mb-4">
          <Alert variant="error">{serverError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PremiumFormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <PremiumInput id="fullName" autoComplete="name" hasError={!!errors.fullName} {...register('fullName')} />
        </PremiumFormField>

        <PremiumFormField label="Email" htmlFor="email" error={errors.email?.message}>
          <PremiumInput id="email" type="email" autoComplete="email" hasError={!!errors.email} {...register('email')} />
        </PremiumFormField>

        <PremiumFormField
          label="Phone number"
          htmlFor="phone"
          error={errors.phone?.message}
          hint="Include country code, e.g. +2348012345678"
        >
          <PremiumInput id="phone" type="tel" autoComplete="tel" hasError={!!errors.phone} {...register('phone')} />
        </PremiumFormField>

        <PremiumFormField label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <PremiumInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              hasError={!!errors.password}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-pd-text-faint transition-colors hover:text-pd-text-muted"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </PremiumFormField>

        <PremiumFormField
          label="Referral code (optional)"
          htmlFor="referralCode"
          error={errors.referralCode?.message}
        >
          <PremiumInput id="referralCode" hasError={!!errors.referralCode} {...register('referralCode')} />
        </PremiumFormField>

        <PremiumButton type="submit" isLoading={isSubmitting} className="w-full">
          Create account
        </PremiumButton>
      </form>

      <p className="mt-6 text-center text-sm text-pd-text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-pd-accent hover:text-pd-accent/80">
          Log in
        </Link>
      </p>
    </Card>
  );
}
