import { Lock } from 'lucide-react';
import { PACKAGE_TIER_LABEL, type PackageTier } from '@/features/kobo/constants';

export function TierBadge({ tier, className = '' }: { tier: PackageTier; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-kobo-mono text-[10.5px] uppercase tracking-[.04em] text-gold ${className}`}
    >
      <Lock className="h-2.5 w-2.5" aria-hidden />
      {PACKAGE_TIER_LABEL[tier]}
    </span>
  );
}
