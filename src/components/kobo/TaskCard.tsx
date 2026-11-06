import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatNaira } from '@/lib/currency';

interface TaskCardProps {
  icon: LucideIcon;
  label: string;
  platform: string;
  price: number;
  /** Optional divider-topped slot — landing uses "Start task →", dashboard uses an upsell hint. */
  footer?: ReactNode;
  hoverLift?: boolean;
  className?: string;
}

export function TaskCard({ icon: Icon, label, platform, price, footer, hoverLift = false, className = '' }: TaskCardProps) {
  return (
    <div
      className={`rounded-kobo-md border border-white/10 bg-ink-2 p-5 sm:p-6 ${
        hoverLift ? 'transition-all duration-200 hover:-translate-y-1 hover:border-money motion-reduce:hover:translate-y-0' : ''
      } ${className}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-money/[.14] text-money">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </div>
        <div className="font-kobo-mono text-[15px] font-semibold text-gold">{formatNaira(price)}</div>
      </div>
      <h4 className="mb-1.5 font-display text-[16px] font-semibold text-text-dark">{label}</h4>
      <div className="mb-4 font-kobo-mono text-[11.5px] uppercase tracking-[.08em] text-text-dark-muted">
        {platform}
      </div>
      {footer && <div className="border-t border-white/10 pt-3.5">{footer}</div>}
    </div>
  );
}
