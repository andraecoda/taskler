'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { KoboLogo } from '@/components/kobo/LogoMark';
import { Spinner } from '@/components/ui/Spinner';
import type { ApiPackage, PackageSubscriptionRequest, WalletSummary } from '@/features/kobo/types';
import { useAuth } from '@/lib/auth-context';

const PACKAGES_PATH = '/dashboard/packages';

function PaymentPendingBanner({ request }: { request: PackageSubscriptionRequest }) {
  const isRejected = request.status === 'rejected';
  return (
    <Link
      href={PACKAGES_PATH}
      className={`mb-6 flex items-center gap-3 rounded-kobo-md border px-4 py-3.5 text-[13.5px] transition-colors ${
        isRejected
          ? 'border-stamp/40 bg-stamp/[.12] text-text-dark hover:border-stamp/60'
          : 'border-gold/40 bg-gold/[.12] text-text-dark hover:border-gold/60'
      }`}
    >
      <Clock className={`h-[18px] w-[18px] shrink-0 ${isRejected ? 'text-stamp' : 'text-gold'}`} aria-hidden />
      {isRejected ? (
        <span>
          Your last payment for {request.package?.name ?? 'a package'} couldn&apos;t be verified — tap to try
          again.
        </span>
      ) : (
        <span>
          Your {request.package?.name ?? ''} package payment is awaiting admin confirmation — you can look
          around, but task completion unlocks once it&apos;s confirmed.
        </span>
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { status, user, fetchWithAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const packagesQuery = useQuery({
    queryKey: ['packages'],
    queryFn: () => fetchWithAuth<ApiPackage[]>('/packages'),
    enabled: status === 'authenticated',
  });
  const walletQuery = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetchWithAuth<WalletSummary>('/wallet'),
    enabled: status === 'authenticated',
  });
  const requestQuery = useQuery({
    queryKey: ['packages', 'subscriptions', 'me'],
    queryFn: () => fetchWithAuth<PackageSubscriptionRequest | null>('/packages/subscriptions/me'),
    enabled: status === 'authenticated',
  });

  const hasNeverSubscribed = !user?.packageId && requestQuery.isSuccess && requestQuery.data === null;

  useEffect(() => {
    if (hasNeverSubscribed && pathname !== PACKAGES_PATH) {
      router.replace(PACKAGES_PATH);
    }
  }, [hasNeverSubscribed, pathname, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-ink">
        <Spinner className="h-6 w-6 text-money" />
      </div>
    );
  }

  const activePackage = packagesQuery.data?.find((p) => p.id === user?.packageId) ?? null;
  const showPendingBanner =
    !user?.packageId && requestQuery.data && requestQuery.data.status !== 'confirmed' && pathname !== PACKAGES_PATH;

  return (
    <div className="flex min-h-screen flex-col bg-ink font-kobo text-text-dark lg:flex-row">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[.08] bg-ink-2 px-5 py-4 lg:hidden">
        <KoboLogo className="text-text-dark" />
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-dark-muted hover:bg-white/5 hover:text-text-dark"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="relative z-10 h-full w-[280px] max-w-[80vw]">
            <Sidebar
              packageTier={activePackage?.tier ?? null}
              packageName={activePackage?.name ?? null}
              packagesLoading={packagesQuery.isLoading}
              walletBalance={walletQuery.data?.balance ?? 0}
              onNavigate={() => setMobileNavOpen(false)}
            />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-text-dark-muted hover:bg-white/5 hover:text-text-dark"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      )}

      <div className="hidden lg:block">
        <Sidebar
          packageTier={activePackage?.tier ?? null}
          packageName={activePackage?.name ?? null}
          packagesLoading={packagesQuery.isLoading}
          walletBalance={walletQuery.data?.balance ?? 0}
        />
      </div>

      <main className="w-full flex-1 px-5 py-8 sm:px-8 sm:py-[34px] lg:max-w-[1080px]">
        {showPendingBanner && requestQuery.data && <PaymentPendingBanner request={requestQuery.data} />}
        {hasNeverSubscribed && pathname !== PACKAGES_PATH ? (
          <div className="flex justify-center py-10">
            <Spinner className="h-6 w-6 text-money" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
