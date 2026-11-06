'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { ProgressBar, ProgressMeta } from '@/components/dashboard/ProgressBar';
import { KoboButton } from '@/components/kobo/KoboButton';
import { WalletRuleList } from '@/components/kobo/WalletRuleList';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import type { Item, WalletSummary, WalletTransaction } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';
import { getErrorMessage } from '@/lib/error-message';
import { useAuth } from '@/lib/auth-context';

const TX_LABELS: Record<WalletTransaction['type'], string> = {
  earning: 'Task earning',
  withdrawal: 'Withdrawal',
  referral: 'Referral commission',
  redemption: 'Item redemption',
};

export default function WalletPage() {
  const { fetchWithAuth } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const walletQuery = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetchWithAuth<WalletSummary>('/wallet'),
  });
  const transactionsQuery = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => fetchWithAuth<WalletTransaction[]>('/wallet/transactions'),
  });
  const itemsQuery = useQuery({
    queryKey: ['items'],
    queryFn: () => fetchWithAuth<Item[]>('/items'),
  });

  const invalidateWallet = () => {
    queryClient.invalidateQueries({ queryKey: ['wallet'] });
  };

  const withdrawMutation = useMutation({
    mutationFn: () =>
      fetchWithAuth('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount: wallet?.maxWithdrawable ?? 0 }),
      }),
    onSuccess: () => {
      setError(null);
      setSuccess('Withdrawal requested — funds move on the next scheduled payout Thursday.');
      invalidateWallet();
    },
    onError: (err) => {
      setSuccess(null);
      setError(getErrorMessage(err));
    },
  });

  const redeemMutation = useMutation({
    mutationFn: (itemId: string) =>
      fetchWithAuth(`/items/${itemId}/redeem`, {
        method: 'POST',
        body: JSON.stringify({ recipient: 'self' }),
      }),
    onSuccess: () => {
      setError(null);
      setSuccess('Item redeemed.');
      invalidateWallet();
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
    },
    onError: (err) => {
      setSuccess(null);
      setError(getErrorMessage(err));
    },
  });

  const wallet = walletQuery.data;

  return (
    <div>
      <DashboardTopBar title="Wallet" subtitle="Every naira, itemized and ruled." />

      {error && (
        <div className="mb-5">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
      {success && (
        <div className="mb-5">
          <Alert variant="success">{success}</Alert>
        </div>
      )}

      {walletQuery.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-money" />
        </div>
      ) : wallet ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-kobo-md bg-paper p-6 text-text-paper">
              <div className="font-kobo-mono text-[12px] uppercase tracking-[.08em] text-text-paper-muted">
                Total earnings balance
              </div>
              <div className="mt-1.5 font-display text-[40px] font-extrabold">
                {formatNaira(wallet.balance)}
              </div>
              <div className="mt-3.5 text-[13.5px] text-text-paper-muted">
                Max withdrawable at any time (50%)
              </div>
              <div className="my-2.5 h-2 overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-money-deep" style={{ width: '50%' }} />
              </div>
              <div className="flex justify-between font-kobo-mono text-[12px] text-text-paper-muted">
                <span>{formatNaira(wallet.maxWithdrawable)} available to request</span>
                <span>50% cap</span>
              </div>
            </div>

            <div className="rounded-kobo-md border border-white/[.09] bg-ink-2 p-6">
              <div className="mb-1.5 text-[13.5px] text-text-dark-muted">Progress to withdrawal eligibility</div>
              <div className="font-display text-[22px] font-bold text-text-dark">
                {formatNaira(wallet.balance)}{' '}
                <span className="text-[13px] font-normal text-text-dark-muted">
                  / {formatNaira(wallet.minWithdrawalBalance)}
                </span>
              </div>
              <ProgressBar percent={(wallet.balance / wallet.minWithdrawalBalance) * 100} tone="gold" />
              <ProgressMeta
                left={`${Math.min(100, Math.round((wallet.balance / wallet.minWithdrawalBalance) * 100))}% of minimum reached`}
                right={
                  wallet.eligibleForWithdrawal
                    ? 'Eligible'
                    : `${formatNaira(wallet.minWithdrawalBalance - wallet.balance)} to go`
                }
              />
              <KoboButton
                variant="ghost"
                size="sm"
                disabled={!wallet.eligibleForWithdrawal || withdrawMutation.isPending}
                onClick={() => withdrawMutation.mutate()}
                className="mt-3.5 w-full justify-center"
              >
                {wallet.eligibleForWithdrawal ? 'Request withdrawal' : 'Request withdrawal — locked'}
              </KoboButton>
            </div>
          </div>

          <h2 className="mb-4 mt-8 font-display text-[17px] font-semibold text-text-dark">Payout rules</h2>
          <div className="rounded-kobo-md border border-white/[.09] bg-ink-2 p-6">
            <WalletRuleList
              rules={[
                {
                  title: 'Bi-weekly payouts',
                  description: 'withdrawals are processed twice a month, every other Thursday.',
                },
                {
                  title: `${formatNaira(wallet.minWithdrawalBalance)} minimum balance`,
                  description: 'your wallet must reach this before a withdrawal can be requested.',
                },
                {
                  title: '50% withdrawal cap',
                  description: 'you can withdraw up to half of your total earnings balance at any point.',
                },
                {
                  title: '60% coverage rule',
                  description:
                    'items (for yourself or as a gift) can only be redeemed if their cost is covered by up to 60% of your available balance.',
                },
              ]}
            />
          </div>

          <h2 className="mb-1 mt-8 font-display text-[17px] font-semibold text-text-dark">Redeem an item</h2>
          <p className="mb-4 text-[13.5px] text-text-dark-muted">
            Based on your {formatNaira(wallet.balance)} balance, up to {formatNaira(wallet.maxItemSpend)} (60%)
            can go toward an item.
          </p>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {itemsQuery.data?.map((item) => {
              const covered = item.price <= wallet.maxItemSpend;
              return (
                <div key={item.id} className="rounded-kobo-md border border-white/10 bg-ink-2 p-4">
                  <div className="mb-1 text-[13.5px] font-semibold text-text-dark">{item.name}</div>
                  <div className="mb-2.5 font-kobo-mono text-[13px] text-gold">{formatNaira(item.price)}</div>
                  {covered ? (
                    <>
                      <div className="mb-2 font-kobo-mono text-[11px] text-money">Covered ✓</div>
                      <KoboButton
                        variant="ghost"
                        size="sm"
                        disabled={redeemMutation.isPending}
                        onClick={() => redeemMutation.mutate(item.id)}
                        className="w-full justify-center"
                      >
                        Redeem
                      </KoboButton>
                    </>
                  ) : (
                    <div className="font-kobo-mono text-[11px] text-stamp">
                      Needs {formatNaira(item.price - wallet.maxItemSpend)} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <h2 className="mb-4 mt-8 font-display text-[17px] font-semibold text-text-dark">Recent activity</h2>
          <div className="overflow-x-auto rounded-kobo-md border border-white/[.09] bg-ink-2 p-6">
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-white/10 pb-2.5 text-left font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
                    Activity
                  </th>
                  <th className="border-b border-white/10 pb-2.5 text-left font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
                    Date
                  </th>
                  <th className="border-b border-white/10 pb-2.5 text-right font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionsQuery.data?.map((tx) => (
                  <tr key={tx.id}>
                    <td className="border-b border-white/5 py-3 text-[13.5px] text-text-dark">
                      {TX_LABELS[tx.type]}
                    </td>
                    <td className="border-b border-white/5 py-3 font-kobo-mono text-[12px] text-text-dark-muted">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td
                      className={`border-b border-white/5 py-3 text-right font-kobo-mono text-[13.5px] ${
                        tx.type === 'withdrawal' || tx.type === 'redemption' ? 'text-stamp' : 'text-money'
                      }`}
                    >
                      {tx.type === 'withdrawal' || tx.type === 'redemption' ? '-' : '+'}
                      {formatNaira(tx.amount)}
                    </td>
                  </tr>
                ))}
                {transactionsQuery.data?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-[13.5px] text-text-dark-muted">
                      No activity yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
