'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { KoboButton } from '@/components/kobo/KoboButton';
import { TaskCard } from '@/components/kobo/TaskCard';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { PLATFORM_LABELS, TASK_TYPE_META } from '@/features/kobo/constants';
import type { EarnerRates, Task } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';
import { getErrorMessage } from '@/lib/error-message';
import { useAuth } from '@/lib/auth-context';

const MAX_PROOF_SIZE_BYTES = 5 * 1024 * 1024;

function LiveTaskCard({ task, reward }: { task: Task; reward: number }) {
  const { fetchWithAuth } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const meta = TASK_TYPE_META[task.taskType];

  const submitMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const upload = await fetchWithAuth<{ url: string }>('/uploads/task-proof', {
        method: 'POST',
        body: formData,
      });
      return fetchWithAuth(`/tasks/${task.id}/complete`, {
        method: 'POST',
        body: JSON.stringify({ proofUrl: upload.url }),
      });
    },
    onSuccess: () => {
      setError(null);
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['tasks', 'live'] });
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_PROOF_SIZE_BYTES) {
      setError('Screenshot must be 5MB or smaller.');
      return;
    }
    submitMutation.mutate(file);
  };

  if (submitted) {
    return (
      <TaskCard
        icon={meta.icon}
        label={meta.label}
        platform={PLATFORM_LABELS[task.platform]}
        price={reward}
        footer={<Alert variant="success">Submitted — pending admin review.</Alert>}
      />
    );
  }

  return (
    <TaskCard
      icon={meta.icon}
      label={meta.label}
      platform={PLATFORM_LABELS[task.platform]}
      price={reward}
      footer={
        <div className="flex flex-col gap-2.5">
          {task.poster?.fullName && (
            <div className="text-[12px] text-text-dark-muted">
              Posted by <span className="text-text-dark">{task.poster.fullName}</span>
            </div>
          )}
          <p className="text-[11.5px] text-text-dark-muted">
            Perform the task, then upload a screenshot as proof. An admin reviews it before you&apos;re paid.
          </p>
          {error && <Alert variant="error">{error}</Alert>}
          <div className="flex gap-2">
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[13px] font-medium text-text-dark-muted transition-colors hover:border-white/30 hover:text-text-dark"
            >
              Open link <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <KoboButton
              className="flex-1 justify-center gap-1.5 text-[13px]"
              disabled={submitMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" aria-hidden />
              {submitMutation.isPending ? 'Uploading…' : 'Submit proof'}
            </KoboButton>
          </div>
        </div>
      }
    />
  );
}

export default function TasksPage() {
  const { fetchWithAuth } = useAuth();

  const ratesQuery = useQuery({
    queryKey: ['tasks', 'earner-rates'],
    queryFn: () => fetchWithAuth<EarnerRates>('/tasks'),
    retry: false,
  });

  const liveTasksQuery = useQuery({
    queryKey: ['tasks', 'live'],
    queryFn: () => fetchWithAuth<Task[]>('/tasks/live'),
    enabled: !!ratesQuery.data,
  });

  return (
    <div>
      <DashboardTopBar title="Available tasks" subtitle="Prices shown reflect your active package." />

      {ratesQuery.isLoading && (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-money" />
        </div>
      )}

      {ratesQuery.isError && (
        <div className="rounded-kobo-md border border-white/[.09] bg-ink-2 p-8 text-center">
          <p className="mb-4 text-[14.5px] text-text-dark-muted">{getErrorMessage(ratesQuery.error)}</p>
          <KoboButton href="/dashboard/packages">Choose a package</KoboButton>
        </div>
      )}

      {ratesQuery.data && (
        <>
          <h2 className="mb-3.5 font-display text-[16px] font-semibold text-text-dark">Live tasks</h2>
          {liveTasksQuery.isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner className="h-6 w-6 text-money" />
            </div>
          ) : liveTasksQuery.data && liveTasksQuery.data.length > 0 ? (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {liveTasksQuery.data.map((task) => (
                <LiveTaskCard
                  key={task.id}
                  task={task}
                  reward={ratesQuery.data.currentPackage.rates[task.taskType]}
                />
              ))}
            </div>
          ) : (
            <p className="mb-8 rounded-kobo-md border border-white/[.09] bg-ink-2 p-6 text-[14px] text-text-dark-muted">
              No live tasks right now — check back soon, advertisers post new ones regularly.
            </p>
          )}

          <h2 className="mb-3.5 font-display text-[16px] font-semibold text-text-dark">Your rates by task type</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(TASK_TYPE_META).map((meta) => (
              <TaskCard
                key={meta.key}
                icon={meta.icon}
                label={meta.label}
                platform="Any supported platform"
                price={ratesQuery.data.currentPackage.rates[meta.key]}
                footer={
                  ratesQuery.data.nextPackage && (
                    <div className="text-[12px] text-text-dark-muted">
                      Upgrade to <b className="text-gold">{ratesQuery.data.nextPackage.name}</b> to earn{' '}
                      {formatNaira(ratesQuery.data.nextPackage.rates[meta.key])} instead
                    </div>
                  )
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
