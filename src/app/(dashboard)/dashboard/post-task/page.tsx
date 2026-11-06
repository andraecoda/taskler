'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { BankTransferCard } from '@/components/kobo/BankTransferCard';
import { KoboButton } from '@/components/kobo/KoboButton';
import { Alert } from '@/components/ui/Alert';
import { TASK_TYPE_META, type TaskTypeKey } from '@/features/kobo/constants';
import type { AdvertiserRate, TaskPaymentIntent } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';
import { getErrorMessage } from '@/lib/error-message';
import { useAuth } from '@/lib/auth-context';

const PLATFORMS: Array<{ value: string; label: string }> = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const fieldClasses =
  'rounded-lg border border-white/[.15] bg-ink-3 px-3.5 py-[11px] text-[14px] text-text-dark focus:border-transparent focus:outline focus:outline-2 focus:outline-money';

export default function PostTaskPage() {
  const { fetchWithAuth } = useAuth();
  const [platform, setPlatform] = useState(PLATFORMS[0].value);
  const [taskType, setTaskType] = useState<TaskTypeKey>('like');
  const [target, setTarget] = useState(500);
  const [duration, setDuration] = useState(14);
  const [url, setUrl] = useState('');
  const [paymentIntent, setPaymentIntent] = useState<TaskPaymentIntent | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ratesQuery = useQuery({
    queryKey: ['tasks', 'advertiser-rates'],
    queryFn: () => fetchWithAuth<AdvertiserRate[]>('/tasks/advertiser-rates'),
  });

  const rateByType = useMemo(() => {
    const map = new Map<TaskTypeKey, number>();
    ratesQuery.data?.forEach((rate) => map.set(rate.taskType, rate.unitCost));
    return map;
  }, [ratesQuery.data]);

  const unitCost = rateByType.get(taskType) ?? 0;
  const total = unitCost * Math.max(0, target);

  const createMutation = useMutation({
    mutationFn: async () => {
      const task = await fetchWithAuth<{ id: string }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({ platform, taskType, targetCount: target, durationDays: duration, url }),
      });
      return fetchWithAuth<TaskPaymentIntent>(`/tasks/${task.id}/pay`, { method: 'POST' });
    },
    onSuccess: (intent) => {
      setError(null);
      setPaymentIntent(intent);
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  const markPaidMutation = useMutation({
    mutationFn: () => fetchWithAuth(`/tasks/${paymentIntent!.taskId}/mark-paid`, { method: 'POST' }),
    onSuccess: () => {
      setError(null);
      setAwaitingConfirmation(true);
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  if (paymentIntent) {
    return (
      <div>
        <DashboardTopBar title="Post a task" subtitle="Complete the transfer to publish your task." />
        {error && (
          <div className="mb-5">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        <BankTransferCard
          title={`${PLATFORMS.find((p) => p.value === platform)?.label ?? platform} · ${TASK_TYPE_META[taskType].label}`}
          amount={paymentIntent.amount}
          bankDetails={paymentIntent.bankDetails}
          awaitingConfirmation={awaitingConfirmation}
          onMarkPaid={() => markPaidMutation.mutate()}
          isMarkingPaid={markPaidMutation.isPending}
        />
        <p className="mt-4 text-[13.5px] text-text-dark-muted">
          Your task stays in draft until an admin confirms the transfer — it won&apos;t be visible to
          earners before then.
        </p>
      </div>
    );
  }

  return (
    <div>
      <DashboardTopBar
        title="Post a task"
        subtitle="Your task goes live once an admin confirms your bank transfer."
      />

      <div className="rounded-kobo-md border border-white/[.09] bg-ink-2 p-6">
        {error && (
          <div className="mb-5">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="platform" className="text-[13px] font-semibold text-text-dark-muted">
              Social platform
            </label>
            <select
              id="platform"
              className={fieldClasses}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="taskType" className="text-[13px] font-semibold text-text-dark-muted">
              Task type
            </label>
            <select
              id="taskType"
              className={fieldClasses}
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as TaskTypeKey)}
            >
              {Object.values(TASK_TYPE_META).map((meta) => (
                <option key={meta.key} value={meta.key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="target" className="text-[13px] font-semibold text-text-dark-muted">
              Target count (views / clicks / likes / subscribers / followers)
            </label>
            <input
              id="target"
              type="number"
              min={1}
              className={fieldClasses}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="duration" className="text-[13px] font-semibold text-text-dark-muted">
              Duration (days task should run)
            </label>
            <input
              id="duration"
              type="number"
              min={1}
              className={fieldClasses}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="url" className="text-[13px] font-semibold text-text-dark-muted">
              Full URL to your page, channel, or post
            </label>
            <input
              id="url"
              type="text"
              placeholder="https://youtube.com/@yourchannel"
              className={fieldClasses}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-[22px] rounded-kobo-md bg-paper p-[22px] text-text-paper">
          <div className="flex justify-between border-b border-dashed border-paper-line py-2 font-kobo-mono text-[13.5px]">
            <span>Cost per action</span>
            <span>{formatNaira(unitCost)}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-paper-line py-2 font-kobo-mono text-[13.5px]">
            <span>Target count</span>
            <span>{target.toLocaleString('en-NG')}</span>
          </div>
          <div className="flex justify-between pt-3.5 font-kobo-mono text-[16px] font-bold">
            <span>Estimated total cost</span>
            <span>{formatNaira(total)}</span>
          </div>
        </div>

        <KoboButton
          className="mt-5 w-full justify-center"
          disabled={!url || target < 1 || duration < 1 || createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          {createMutation.isPending ? 'Creating…' : 'Continue to payment'}
        </KoboButton>
        <p className="mt-2.5 text-[13.5px] text-text-dark-muted">
          Your task stays in draft until payment clears — it will not be visible to earners before
          then.
        </p>
      </div>
    </div>
  );
}
