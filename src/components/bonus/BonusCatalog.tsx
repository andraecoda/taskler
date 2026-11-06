'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Reveal } from '@/components/kobo/Reveal';
import { SectionHeading } from '@/components/premium/SectionHeading';
import { PremiumButton } from '@/components/premium/Button';
import { PremiumProductImage } from '@/components/premium/ProductImage';
import { PremiumTierBadge } from '@/components/premium/TierBadge';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { fetchBonusItems } from '@/features/bonus/api';
import { BONUS_CATEGORY_GROUPS } from '@/features/bonus/constants';
import { meetsPackageTier, type PackageTier } from '@/features/kobo/constants';
import type { Item, WalletSummary } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';
import { getErrorMessage } from '@/lib/error-message';
import { useAuth } from '@/lib/auth-context';
import { useUserPackageTier } from '@/lib/use-user-package-tier';

export function BonusCatalog() {
  const { status, fetchWithAuth } = useAuth();
  const queryClient = useQueryClient();
  const userTier = useUserPackageTier();
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const itemsQuery = useQuery({ queryKey: ['bonus-items'], queryFn: fetchBonusItems });

  const walletQuery = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetchWithAuth<WalletSummary>('/wallet'),
    enabled: status === 'authenticated',
  });

  const redeemMutation = useMutation({
    mutationFn: (itemId: string) =>
      fetchWithAuth(`/items/${itemId}/redeem`, {
        method: 'POST',
        body: JSON.stringify({ recipient: 'self' }),
      }),
    onSuccess: () => {
      setMessage({ tone: 'success', text: 'Item redeemed — check your wallet activity.' });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (err) => setMessage({ tone: 'error', text: getErrorMessage(err) }),
  });

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of itemsQuery.data ?? []) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [itemsQuery.data]);

  const wallet = walletQuery.data;

  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="Redeem your balance"
            title="Turn your wallet into real things."
            description="Every item below can be redeemed straight from your CleekTap wallet, subject to the 60% coverage rule — an item's cost can't exceed 60% of your available balance."
          />
        </Reveal>

        {status === 'authenticated' && wallet && (
          <Reveal>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-pd-lg border border-hairline bg-surface-2 p-5">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[.08em] text-pd-text-faint">
                  Available to spend on items (60% of balance)
                </div>
                <div className="mt-1 font-pd-display text-[24px] font-semibold text-pd-text">
                  {formatNaira(wallet.maxItemSpend)}
                </div>
              </div>
              <PremiumButton href="/dashboard/wallet" variant="secondary" size="sm">
                View full wallet
              </PremiumButton>
            </div>
          </Reveal>
        )}

        {message && (
          <div className="mb-8">
            <Alert variant={message.tone}>{message.text}</Alert>
          </div>
        )}

        {itemsQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-6 w-6 text-pd-accent" />
          </div>
        ) : itemsQuery.isError ? (
          <Alert variant="error">Couldn&apos;t load the catalog right now. Try again shortly.</Alert>
        ) : (
          <div className="flex flex-col gap-16">
            {BONUS_CATEGORY_GROUPS.map((group) => {
              const groupItems = group.categories.flatMap((cat) => itemsByCategory.get(cat.label) ?? []);
              if (groupItems.length === 0) return null;

              return (
                <Reveal key={group.key}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pd-gold/10 text-pd-gold">
                      <group.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-pd-display text-[20px] font-semibold text-pd-text sm:text-[22px]">
                      {group.label}
                    </h3>
                  </div>

                  {group.categories.map((cat) => {
                    const items = itemsByCategory.get(cat.label) ?? [];
                    if (items.length === 0) return null;
                    return (
                      <div key={cat.label} className="mb-8 last:mb-0">
                        <div className="mb-3 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[.06em] text-pd-text-faint">
                          <cat.icon className="h-3.5 w-3.5" aria-hidden />
                          {cat.label}
                        </div>
                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                          {items.map((item) => (
                            <BonusItemCard
                              key={item.id}
                              item={item}
                              status={status}
                              userTier={userTier}
                              maxItemSpend={wallet?.maxItemSpend}
                              pending={redeemMutation.isPending}
                              onRedeem={() => redeemMutation.mutate(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function BonusItemCard({
  item,
  status,
  userTier,
  maxItemSpend,
  pending,
  onRedeem,
}: {
  item: Item;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userTier: PackageTier | null;
  maxItemSpend?: number;
  pending: boolean;
  onRedeem: () => void;
}) {
  const tierLocked = status === 'authenticated' && !meetsPackageTier(userTier, item.minPackageTier);
  const covered = status === 'authenticated' && maxItemSpend !== undefined && item.price <= maxItemSpend;

  return (
    <div className="rounded-pd-lg border border-hairline bg-surface p-4">
      <PremiumProductImage item={item} className="mb-3" />
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="text-[13.5px] font-semibold text-pd-text">{item.name}</div>
        {item.minPackageTier && <PremiumTierBadge tier={item.minPackageTier} className="shrink-0" />}
      </div>
      <div className="mb-2.5 text-[13px] font-semibold text-pd-text">{formatNaira(item.price)}</div>
      {status === 'authenticated' ? (
        tierLocked ? (
          <PremiumButton href="/dashboard/packages" variant="secondary" size="sm" className="w-full justify-center">
            Upgrade to unlock
          </PremiumButton>
        ) : covered ? (
          <PremiumButton
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={onRedeem}
            className="w-full justify-center"
          >
            Redeem
          </PremiumButton>
        ) : maxItemSpend !== undefined ? (
          <div className="text-[11px] font-medium text-red-600">
            Needs {formatNaira(item.price - maxItemSpend)} more
          </div>
        ) : (
          <div className="text-[11px] text-pd-text-faint">Checking balance…</div>
        )
      ) : (
        <PremiumButton href="/register" variant="secondary" size="sm" className="w-full justify-center">
          Sign up to redeem
        </PremiumButton>
      )}
    </div>
  );
}
