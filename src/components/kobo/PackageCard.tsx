import type { ReactNode } from 'react';
import type { CategoryAccessChip } from '@/features/bonus/constants';
import { TASK_TYPE_META, type PackageDef } from '@/features/kobo/constants';
import { formatNaira } from '@/lib/currency';
import { KoboButton } from './KoboButton';

interface PackageCardProps {
  pkg: PackageDef;
  /** Highlights the card as the viewer's active plan (dashboard only). */
  current?: boolean;
  badgeLabel?: string;
  cta: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'ghost' | 'dark';
    disabled?: boolean;
  };
  priceSuffix?: ReactNode;
  /** Bonus store categories this tier unlocks — omit to hide the section entirely. */
  categories?: CategoryAccessChip[];
}

export function PackageCard({ pkg, current = false, badgeLabel, cta, priceSuffix, categories }: PackageCardProps) {
  return (
    <div
      className={`relative rounded-kobo-lg border-[1.5px] bg-ink-2 p-6 sm:p-7 ${
        current ? 'border-money' : 'border-white/10'
      }`}
    >
      {badgeLabel && (
        <span className="absolute -top-[11px] left-6 rounded-full bg-money px-3 py-1 font-kobo-mono text-[10.5px] font-semibold uppercase tracking-[.06em] text-[#0E2117]">
          {badgeLabel}
        </span>
      )}
      <div className="mb-1.5 font-display text-[18px] font-bold text-text-dark">{pkg.name}</div>
      <div className="mb-[18px] font-kobo-mono text-[26px] font-semibold text-gold">
        {formatNaira(pkg.price)}
        {priceSuffix && <span className="ml-1 text-[13px] font-normal text-text-dark-muted">{priceSuffix}</span>}
      </div>
      <ul className="mb-5 flex flex-col gap-2.5">
        {Object.values(TASK_TYPE_META).map((meta) => (
          <li key={meta.key} className="flex justify-between font-kobo-mono text-[13px] text-text-dark-muted">
            <span>{meta.label}</span>
            <b className="font-semibold text-text-dark">{formatNaira(pkg.rates[meta.key])}</b>
          </li>
        ))}
      </ul>
      {categories && categories.length > 0 && (
        <div className="mb-5 border-t border-white/10 pt-4">
          <div className="mb-2.5 font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">
            Bonus store access
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat.key}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-text-dark-muted"
              >
                <cat.icon className="h-3 w-3 text-gold" aria-hidden />
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      )}
      {cta.href ? (
        <KoboButton
          href={cta.href}
          variant={cta.variant ?? 'ghost'}
          size="sm"
          className="w-full justify-center"
        >
          {cta.label}
        </KoboButton>
      ) : (
        <KoboButton
          variant={cta.variant ?? 'ghost'}
          size="sm"
          className="w-full justify-center"
          onClick={cta.onClick}
          disabled={cta.disabled}
        >
          {cta.label}
        </KoboButton>
      )}
    </div>
  );
}
