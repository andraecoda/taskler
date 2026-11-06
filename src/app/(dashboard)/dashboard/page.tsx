'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { StatMini } from '@/components/dashboard/StatMini';
import { ProductImage } from '@/components/bonus/ProductImage';
import { TierBadge } from '@/components/bonus/TierBadge';
import { GoalCard } from '@/components/kobo/GoalCard';
import { KoboButton } from '@/components/kobo/KoboButton';
import { Spinner } from '@/components/ui/Spinner';
import type { EarningGoal, User } from '@/features/auth/types';
import { fetchBonusItems } from '@/features/bonus/api';
import { meetsPackageTier } from '@/features/kobo/constants';
import { GOAL_OPTIONS } from '@/features/kobo/goal-options';
import type { WalletSummary, WeeklySummary } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';
import { formatShortDate } from '@/lib/format-date';
import { useAuth } from '@/lib/auth-context';
import { useUserPackageTier } from '@/lib/use-user-package-tier';

const ITEM_GOALS: EarningGoal[] = ['item_purchase', 'gift_item'];

export default function OverviewPage() {
  const { user, fetchWithAuth, setUser } = useAuth();
  const queryClient = useQueryClient();
  const userTier = useUserPackageTier();

  // Which goal category is being configured right now — separate from the user's saved
  // earningGoal so picking "Item purchase"/"Gift an item" can open the product picker before
  // anything is actually saved (a specific item is required for those two categories).
  const [pendingGoal, setPendingGoal] = useState<EarningGoal | null>(user?.earningGoal ?? null);

  const walletQuery = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetchWithAuth<WalletSummary>('/wallet'),
  });
  const weeklyQuery = useQuery({
    queryKey: ['wallet', 'weekly-summary'],
    queryFn: () => fetchWithAuth<WeeklySummary>('/wallet/weekly-summary'),
  });
  const itemsQuery = useQuery({
    queryKey: ['bonus-items'],
    queryFn: fetchBonusItems,
    enabled: pendingGoal !== null && ITEM_GOALS.includes(pendingGoal),
  });

  const goalMutation = useMutation({
    mutationFn: (input: { earningGoal: EarningGoal; itemId?: string }) =>
      fetchWithAuth<User>('/users/me/earning-goal', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });

  const handleSelectGoal = (goal: EarningGoal) => {
    setPendingGoal(goal);
    if (goal === 'funds_withdrawal') {
      goalMutation.mutate({ earningGoal: goal });
    }
  };

  const wallet = walletQuery.data;
  const remainingToMinimum = wallet ? Math.max(0, wallet.minWithdrawalBalance - wallet.balance) : 0;
  const firstName = user?.fullName.split(' ')[0] ?? '';

  return (
    <div>
      <DashboardTopBar
        title={`Good afternoon, ${firstName}`}
        subtitle="Here's where your earnings and goal stand today."
        action={<KoboButton href="/dashboard/tasks">Browse tasks</KoboButton>}
      />

      {walletQuery.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-money" />
        </div>
      ) : wallet ? (
        <div className="mb-6 flex flex-col justify-between gap-5 rounded-kobo-lg bg-paper p-[30px] text-text-paper sm:flex-row sm:items-start">
          <div>
            <div className="font-kobo-mono text-[12px] uppercase tracking-[.08em] text-text-paper-muted">
              Wallet balance
            </div>
            <div className="mt-1.5 font-display text-[40px] font-extrabold">
              {formatNaira(wallet.balance)}
            </div>
            <div className="mt-2 font-kobo-mono text-[12px] text-text-paper-muted">
              {remainingToMinimum > 0
                ? `${formatNaira(remainingToMinimum)} more to reach the ${formatNaira(wallet.minWithdrawalBalance)} withdrawal minimum`
                : 'Eligible to request a withdrawal'}
            </div>
          </div>
          <div className="sm:text-right">
            <div className="font-kobo-mono text-[12px] uppercase tracking-[.08em] text-text-paper-muted">
              Next payout
            </div>
            <div className="mt-1.5 font-display text-[22px] font-bold">
              {formatShortDate(wallet.nextPayoutDate)}
            </div>
            <div className="mt-2 font-kobo-mono text-[12px] text-text-paper-muted">
              Payouts run twice monthly, every other Thursday
            </div>
          </div>
        </div>
      ) : null}

      <h2 className="mb-1 mt-8 font-display text-[17px] font-semibold text-text-dark">Your earning goal</h2>
      <p className="mb-4 text-[13.5px] text-text-dark-muted">
        Pick what you&apos;re working toward — this shapes what you see across CleekTap.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {GOAL_OPTIONS.map((option) => (
          <GoalCard
            key={option.key}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={pendingGoal === option.key}
            onSelect={() => handleSelectGoal(option.key)}
          />
        ))}
      </div>

      {pendingGoal && ITEM_GOALS.includes(pendingGoal) && (
        <div className="mt-5">
          <h3 className="mb-1 font-display text-[15.5px] font-semibold text-text-dark">
            {pendingGoal === 'gift_item' ? 'Pick what you want to gift' : 'Pick what you want to buy'}
          </h3>
          <p className="mb-4 text-[13px] text-text-dark-muted">
            This becomes your goal target — track progress toward it as your wallet grows.
          </p>
          {itemsQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-5 w-5 text-money" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {itemsQuery.data?.map((item) => {
                const selected = user?.earningGoal === pendingGoal && user?.earningGoalItemId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={goalMutation.isPending}
                    onClick={() => goalMutation.mutate({ earningGoal: pendingGoal, itemId: item.id })}
                    className={`rounded-kobo-md border-[1.5px] p-3.5 text-left transition-all duration-150 hover:-translate-y-[3px] disabled:opacity-60 motion-reduce:hover:translate-y-0 ${
                      selected ? 'border-money bg-money/[.08]' : 'border-white/10 bg-ink-2'
                    }`}
                  >
                    <ProductImage item={item} className="mb-2.5" />
                    <div className="truncate text-[13px] font-semibold text-text-dark">{item.name}</div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <div className="font-kobo-mono text-[12px] text-gold">{formatNaira(item.price)}</div>
                      {item.minPackageTier && !meetsPackageTier(userTier, item.minPackageTier) && (
                        <TierBadge tier={item.minPackageTier} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatMini label="Tasks this week" value={weeklyQuery.data ? String(weeklyQuery.data.tasksCompleted) : '—'} />
        <StatMini label="Earned this week" value={weeklyQuery.data ? formatNaira(weeklyQuery.data.earned) : '—'} />
        <StatMini
          label="Referral earnings"
          value={weeklyQuery.data ? formatNaira(weeklyQuery.data.referralEarned) : '—'}
        />
      </div>
    </div>
  );
}
