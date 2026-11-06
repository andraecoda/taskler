'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { BankTransferCard } from '@/components/kobo/BankTransferCard';
import { PackageCard } from '@/components/kobo/PackageCard';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import type { PackageDef, TaskTypeKey } from '@/features/kobo/constants';
import type {
  ApiPackage,
  BankDetails,
  PackageSubscriptionRequest,
  SubscribeResponse,
} from '@/features/kobo/types';
import { getErrorMessage } from '@/lib/error-message';
import { useAuth } from '@/lib/auth-context';

function toPackageDef(pkg: ApiPackage): PackageDef {
  return { tier: pkg.tier, name: pkg.name, price: pkg.price, rates: pkg.rates as Record<TaskTypeKey, number> };
}

const OPEN_STATUSES = ['pending_transfer', 'awaiting_confirmation'];

export default function PackagesPage() {
  const { user, fetchWithAuth } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  const packagesQuery = useQuery({
    queryKey: ['packages'],
    queryFn: () => fetchWithAuth<ApiPackage[]>('/packages'),
  });
  const requestQuery = useQuery({
    queryKey: ['packages', 'subscriptions', 'me'],
    queryFn: () => fetchWithAuth<PackageSubscriptionRequest | null>('/packages/subscriptions/me'),
  });
  const bankDetailsQuery = useQuery({
    queryKey: ['packages', 'bank-details'],
    queryFn: () => fetchWithAuth<BankDetails>('/packages/bank-details'),
  });

  const openRequest =
    requestQuery.data && OPEN_STATUSES.includes(requestQuery.data.status) ? requestQuery.data : null;

  const invalidateRequest = () =>
    queryClient.invalidateQueries({ queryKey: ['packages', 'subscriptions', 'me'] });

  const subscribeMutation = useMutation({
    mutationFn: (pkg: ApiPackage) => {
      setPendingTier(pkg.tier);
      return fetchWithAuth<SubscribeResponse>('/packages/subscribe', {
        method: 'POST',
        body: JSON.stringify({ packageId: pkg.id }),
      });
    },
    onSuccess: () => {
      setError(null);
      setPendingTier(null);
      invalidateRequest();
    },
    onError: (err) => {
      setPendingTier(null);
      setError(getErrorMessage(err));
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: (requestId: string) =>
      fetchWithAuth(`/packages/subscriptions/${requestId}/mark-paid`, { method: 'POST' }),
    onSuccess: () => {
      setError(null);
      invalidateRequest();
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  const isLoading = packagesQuery.isLoading || requestQuery.isLoading;

  return (
    <div>
      <DashboardTopBar title="Packages" subtitle="Your package sets how much you earn per task." />

      {error && (
        <div className="mb-5">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {requestQuery.data?.status === 'rejected' && !openRequest && (
        <div className="mb-5">
          <Alert variant="error">
            Your last payment for {requestQuery.data.package?.name ?? 'a package'} couldn&apos;t be verified
            {requestQuery.data.rejectionReason ? `: ${requestQuery.data.rejectionReason}` : '.'} Try again
            below.
          </Alert>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-money" />
        </div>
      ) : (
        <>
          {openRequest && bankDetailsQuery.data && (
            <div className="mb-6">
              <BankTransferCard
                title={`${openRequest.package?.name ?? 'Package'} package`}
                amount={openRequest.package?.price ?? 0}
                bankDetails={bankDetailsQuery.data}
                awaitingConfirmation={openRequest.status === 'awaiting_confirmation'}
                onMarkPaid={() => markPaidMutation.mutate(openRequest.id)}
                isMarkingPaid={markPaidMutation.isPending}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {packagesQuery.data?.map((pkg) => {
              const isCurrent = pkg.id === user?.packageId;
              const isThisPending = subscribeMutation.isPending && pendingTier === pkg.tier;
              return (
                <PackageCard
                  key={pkg.tier}
                  pkg={toPackageDef(pkg)}
                  current={isCurrent}
                  badgeLabel={isCurrent ? 'Current package' : undefined}
                  cta={
                    isCurrent
                      ? { label: 'Active package', variant: 'primary', disabled: true }
                      : {
                          label: isThisPending ? 'Starting…' : `Switch to ${pkg.name}`,
                          variant: 'ghost',
                          disabled: subscribeMutation.isPending || !!openRequest,
                          onClick: () => subscribeMutation.mutate(pkg),
                        }
                  }
                />
              );
            })}
          </div>
          {openRequest && (
            <p className="mt-3 text-[13px] text-text-dark-muted">
              Resolve the payment above before starting a new package request.
            </p>
          )}
        </>
      )}
    </div>
  );
}
