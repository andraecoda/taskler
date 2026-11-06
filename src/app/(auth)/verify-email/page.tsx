'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { resendVerification, verifyEmail } from '@/features/auth/api';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/premium/Card';
import { PremiumButton } from '@/components/premium/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage } from '@/lib/error-message';

type VerifyState =
  | { status: 'pending' }
  | { status: 'success' }
  | { status: 'error'; message: string };

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const justResent = searchParams.get('resent') === '1';
  const attempted = useRef(false);
  const [state, setState] = useState<VerifyState>({ status: 'pending' });

  const resendMutation = useMutation({ mutationFn: () => resendVerification(email!) });

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;

    verifyEmail(token)
      .then(() => setState({ status: 'success' }))
      .catch((error: unknown) => setState({ status: 'error', message: getErrorMessage(error) }));
  }, [token]);

  // Redirected here from login with an unverified account — the backend already sent a
  // fresh verification link, so there's no token to consume yet, just an email to point at.
  if (!token && email) {
    return (
      <Card>
        <h1 className="mb-4 font-pd-display text-xl font-semibold text-pd-text">Verify your email</h1>
        {justResent && (
          <div className="mb-4">
            <Alert variant="info">
              Your account isn&apos;t verified yet. We&apos;ve sent a new verification link to{' '}
              <span className="font-medium text-pd-text">{email}</span>.
            </Alert>
          </div>
        )}
        <p className="mb-4 text-sm text-pd-text-muted">
          Click the link in that email to activate your account, then come back to log in.
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
          onClick={() => resendMutation.mutate()}
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

  if (!token) {
    return (
      <Card>
        <Alert variant="error">This verification link is missing a token. Check the link in your email.</Alert>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-4 font-pd-display text-xl font-semibold text-pd-text">Email verification</h1>
      {state.status === 'pending' && (
        <div className="flex items-center gap-2 text-sm text-pd-text-muted">
          <Spinner className="h-4 w-4" />
          Verifying your email…
        </div>
      )}
      {state.status === 'success' && (
        <>
          <Alert variant="success">Your email has been verified. You can now log in.</Alert>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-pd-accent hover:text-pd-accent/80"
          >
            Go to login
          </Link>
        </>
      )}
      {state.status === 'error' && <Alert variant="error">{state.message}</Alert>}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
