import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatNaira } from '@/lib/currency';

interface TaskCardProps {
  icon: LucideIcon;
  label: string;
  platform: string;
  price: number;
  footer?: ReactNode;
  hoverLift?: boolean;
  className?: string;
}

export function PremiumTaskCard({
  icon: Icon,
  label,
  platform,
  price,
  footer,
  hoverLift = false,
  className = '',
}: TaskCardProps) {
  return (
    <div
      className={`rounded-pd-lg border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,.03)] ${
        hoverLift
          ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,.25)] motion-reduce:hover:translate-y-0'
          : ''
      } ${className}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pd-accent-soft text-pd-accent">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </div>
        <div className="text-[15px] font-semibold text-pd-text">{formatNaira(price)}</div>
      </div>
      <h4 className="mb-1.5 font-pd-display text-[16px] font-semibold text-pd-text">{label}</h4>
      <div className="mb-4 text-[12px] uppercase tracking-[.06em] text-pd-text-faint">{platform}</div>
      {footer && <div className="border-t border-hairline pt-3.5">{footer}</div>}
    </div>
  );
}
