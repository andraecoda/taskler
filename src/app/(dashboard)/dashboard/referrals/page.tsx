'use client';

import { useQuery } from '@tanstack/react-query';
import { CopyLinkBox } from '@/components/dashboard/CopyLinkBox';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { ProgressBar, ProgressMeta } from '@/components/dashboard/ProgressBar';
import { StatMini } from '@/components/dashboard/StatMini';
import { Spinner } from '@/components/ui/Spinner';
import type { ReferralsOverview } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';
import { useAuth } from '@/lib/auth-context';

export default function ReferralsPage() {
  const { fetchWithAuth } = useAuth();

  const referralsQuery = useQuery({
    queryKey: ['referrals'],
    queryFn: () => fetchWithAuth<ReferralsOverview>('/referrals'),
  });

  const data = referralsQuery.data;
  const remaining = data ? Math.max(0, data.successfulReferralThreshold - data.referralCount) : 0;
  const progressPercent = data ? (data.referralCount / data.successfulReferralThreshold) * 100 : 0;

  return (
    <div>
      <DashboardTopBar
        title="Referrals"
        subtitle="Earn a cut every time someone you invited completes a task."
      />

      {referralsQuery.isLoading || !data ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-money" />
        </div>
      ) : (
        <>
          <CopyLinkBox value={`kobo.app/r/${data.referralCode}`} />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatMini label="Referral commission rate" value={`${data.commissionRate}%`} />
            <StatMini label="People referred" value={String(data.referralCount)} />
          </div>

          <h2 className="mb-4 mt-8 font-display text-[17px] font-semibold text-text-dark">
            Unlock 15% commission
          </h2>
          <div className="rounded-kobo-md border border-white/[.09] bg-ink-2 p-6">
            <p className="mb-1.5 text-[13.5px] text-text-dark-muted">
              {remaining > 0
                ? `Refer ${remaining} more ${remaining === 1 ? 'person' : 'people'} to move from 10% to 15% commission on every task they complete.`
                : "You've unlocked the 15% commission rate."}
            </p>
            <ProgressBar percent={progressPercent} tone="gold" />
            <ProgressMeta
              left={`${data.referralCount} of ${data.successfulReferralThreshold} referrals`}
              right={remaining > 0 ? `${remaining} to go` : 'Unlocked'}
            />
          </div>

          <h2 className="mb-4 mt-8 font-display text-[17px] font-semibold text-text-dark">Your referrals</h2>
          <div className="overflow-x-auto rounded-kobo-md border border-white/[.09] bg-ink-2 p-6">
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-white/10 pb-2.5 text-left font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
                    Referred user
                  </th>
                  <th className="border-b border-white/10 pb-2.5 text-left font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
                    Tasks completed
                  </th>
                  <th className="border-b border-white/10 pb-2.5 text-right font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
                    Your commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.referredUsers.map((ref) => (
                  <tr key={ref.id}>
                    <td className="border-b border-white/5 py-3 text-[13.5px] text-text-dark">{ref.fullName}</td>
                    <td className="border-b border-white/5 py-3 text-[13.5px] text-text-dark">
                      {ref.tasksCompleted}
                    </td>
                    <td className="border-b border-white/5 py-3 text-right font-kobo-mono text-[13.5px] text-money">
                      +{formatNaira(ref.commissionEarned)}
                    </td>
                  </tr>
                ))}
                {data.referredUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-[13.5px] text-text-dark-muted">
                      No referrals yet — share your link to start earning.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
