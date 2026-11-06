'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { updateProfileSchema, type UpdateProfileFormValues } from '@/features/auth/schemas';
import type { UserProfile } from '@/features/auth/types';
import { useAuth } from '@/lib/auth-context';
import { getErrorMessage } from '@/lib/error-message';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending verification',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  BLOCKED: 'Blocked',
  DEACTIVATED: 'Deactivated',
};

function AccountSummary() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Card>
      <h2 className="mb-4 font-display text-lg font-semibold text-text-dark">Account</h2>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Full name</dt>
          <dd className="mt-1 text-sm text-text-dark">{user.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Email</dt>
          <dd className="mt-1 text-sm text-text-dark">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Phone</dt>
          <dd className="mt-1 text-sm text-text-dark">{user.phone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Status</dt>
          <dd className="mt-1 text-sm text-text-dark">{STATUS_LABELS[user.status] ?? user.status}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Roles</dt>
          <dd className="mt-1 text-sm text-text-dark">{user.roles.map((r) => r.name).join(', ')}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Referral code</dt>
          <dd className="mt-1 text-sm text-text-dark">{user.referralCode}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-dark-muted">Member since</dt>
          <dd className="mt-1 text-sm text-text-dark">
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

function ProfileForm() {
  const { user, fetchWithAuth, setUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const profile = user?.profile;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      avatarUrl: profile?.avatarUrl ?? '',
      dateOfBirth: profile?.dateOfBirth ?? '',
      gender: (profile?.gender as UpdateProfileFormValues['gender']) ?? undefined,
      addressLine1: profile?.addressLine1 ?? '',
      city: profile?.city ?? '',
      state: profile?.state ?? '',
      country: profile?.country ?? '',
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: UpdateProfileFormValues) => {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== ''),
      );
      return fetchWithAuth<UserProfile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (updatedProfile) => {
      if (user) {
        setUser({ ...user, profile: updatedProfile });
      }
      setSuccessMessage('Profile updated.');
      setServerError(null);
    },
    onError: (error) => {
      setServerError(getErrorMessage(error));
      setSuccessMessage(null);
    },
  });

  if (!user) return null;

  return (
    <Card>
      <h2 className="mb-4 font-display text-lg font-semibold text-text-dark">Profile</h2>

      {successMessage && (
        <div className="mb-4">
          <Alert variant="success">{successMessage}</Alert>
        </div>
      )}
      {serverError && (
        <div className="mb-4">
          <Alert variant="error">{serverError}</Alert>
        </div>
      )}

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4"
        noValidate
      >
        <FormField label="Avatar URL" htmlFor="avatarUrl" error={errors.avatarUrl?.message}>
          <Input id="avatarUrl" hasError={!!errors.avatarUrl} {...register('avatarUrl')} />
        </FormField>

        <FormField label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
          <Input id="dateOfBirth" type="date" hasError={!!errors.dateOfBirth} {...register('dateOfBirth')} />
        </FormField>

        <FormField label="Gender" htmlFor="gender" error={errors.gender?.message}>
          <select
            id="gender"
            className="block w-full rounded-kobo-md border border-white/10 bg-white/5 px-3 py-2.5 font-kobo text-sm text-text-dark focus:border-money/40 focus:outline-none focus:ring-2 focus:ring-money/40"
            {...register('gender')}
          >
            <option className="bg-ink-2" value="">
              Prefer not to say
            </option>
            <option className="bg-ink-2" value="male">
              Male
            </option>
            <option className="bg-ink-2" value="female">
              Female
            </option>
            <option className="bg-ink-2" value="other">
              Other
            </option>
            <option className="bg-ink-2" value="prefer_not_to_say">
              Prefer not to say
            </option>
          </select>
        </FormField>

        <FormField label="Address" htmlFor="addressLine1" error={errors.addressLine1?.message}>
          <Input id="addressLine1" hasError={!!errors.addressLine1} {...register('addressLine1')} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="City" htmlFor="city" error={errors.city?.message}>
            <Input id="city" hasError={!!errors.city} {...register('city')} />
          </FormField>
          <FormField label="State" htmlFor="state" error={errors.state?.message}>
            <Input id="state" hasError={!!errors.state} {...register('state')} />
          </FormField>
          <FormField label="Country" htmlFor="country" error={errors.country?.message}>
            <Input id="country" hasError={!!errors.country} {...register('country')} />
          </FormField>
        </div>

        <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <AccountSummary />
      <ProfileForm />
    </div>
  );
}
