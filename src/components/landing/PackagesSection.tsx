'use client';

import { useQuery } from '@tanstack/react-query';
import { Reveal } from '@/components/kobo/Reveal';
import { PremiumPackageCard } from '@/components/premium/PackageCard';
import { SectionHeading } from '@/components/premium/SectionHeading';
import { fetchBonusItems } from '@/features/bonus/api';
import { categoryAccessForTier } from '@/features/bonus/constants';
import { PACKAGES } from '@/features/kobo/constants';

/**
 * Not present in the original design reference — added to satisfy the requirement that pricing
 * be fully explained without logging in. Styled from the same PackageCard used on the dashboard's
 * Packages view, in a public "no active plan" variant.
 */
export function PackagesSection() {
  const itemsQuery = useQuery({ queryKey: ['bonus-items'], queryFn: fetchBonusItems });

  return (
    <section id="packages" className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="Packages"
            title="Your package sets your rate."
            description="Every package unlocks the same task types and grows what you can redeem in the bonus store. Upgrade any time."
          />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <PremiumPackageCard
                key={pkg.tier}
                pkg={pkg}
                badgeLabel={pkg.tier === 'silver' ? 'Most popular' : undefined}
                cta={{ label: 'Get started', href: '/register' }}
                categories={itemsQuery.data ? categoryAccessForTier(pkg.tier, itemsQuery.data) : undefined}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
