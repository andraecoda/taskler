import type { CategoryAccessChip } from '@/features/bonus/constants';
import { TASK_TYPE_META, type PackageDef } from '@/features/kobo/constants';
import { formatNaira } from '@/lib/currency';
import { PremiumButton } from './Button';

interface PackageCardProps {
  pkg: PackageDef;
  badgeLabel?: string;
  cta: { label: string; href: string; variant?: 'primary' | 'secondary' };
  categories?: CategoryAccessChip[];
}

export function PremiumPackageCard({ pkg, badgeLabel, cta, categories }: PackageCardProps) {
  const featured = Boolean(badgeLabel);

  return (
    <div
      className={`relative flex h-full flex-col rounded-pd-lg border p-7 ${
        featured
          ? 'border-pd-accent/40 bg-surface shadow-[0_24px_60px_-30px_rgba(47,143,91,.35)]'
          : 'border-hairline bg-surface'
      }`}
    >
      {badgeLabel && (
        <span className="absolute -top-3 left-7 rounded-full bg-pd-accent-solid px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[.06em] text-pd-accent-contrast">
          {badgeLabel}
        </span>
      )}
      <div className="mb-1.5 font-pd-display text-[19px] font-semibold text-pd-text">{pkg.name}</div>
      <div className="mb-6 text-[30px] font-semibold tracking-[-.02em] text-pd-text">{formatNaira(pkg.price)}</div>
      <ul className="mb-6 flex flex-col gap-2.5">
        {Object.values(TASK_TYPE_META).map((meta) => (
          <li key={meta.key} className="flex justify-between text-[13.5px] text-pd-text-muted">
            <span>{meta.label}</span>
            <b className="font-semibold text-pd-text">{formatNaira(pkg.rates[meta.key])}</b>
          </li>
        ))}
      </ul>
      {categories && categories.length > 0 && (
        <div className="mb-6 border-t border-hairline pt-5">
          <div className="mb-2.5 text-[11px] font-medium uppercase tracking-[.06em] text-pd-text-faint">
            Bonus store access
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat.key}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2 py-1 text-[11px] text-pd-text-muted"
              >
                <cat.icon className="h-3 w-3 text-pd-accent" aria-hidden />
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      )}
      <PremiumButton
        href={cta.href}
        variant={cta.variant ?? (featured ? 'primary' : 'secondary')}
        className="mt-auto w-full justify-center"
      >
        {cta.label}
      </PremiumButton>
    </div>
  );
}
