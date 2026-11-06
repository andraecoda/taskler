import { Lock } from 'lucide-react';
import { PACKAGE_TIER_LABEL, type PackageTier } from '@/features/kobo/constants';

export function PremiumTierBadge({ tier, className = '' }: { tier: PackageTier; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-pd-gold/30 bg-pd-gold/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[.04em] text-pd-gold ${className}`}
    >
      <Lock className="h-2.5 w-2.5" aria-hidden />
      {PACKAGE_TIER_LABEL[tier]}
    </span>
  );
}
