import type { ReactNode } from 'react';

export function DashboardTopBar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3.5">
      <div>
        <h1 className="font-display text-[24px] font-bold text-text-dark sm:text-[26px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14.5px] text-text-dark-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
