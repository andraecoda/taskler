'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PremiumProductImage } from '@/components/premium/ProductImage';
import { PremiumTierBadge } from '@/components/premium/TierBadge';
import { PremiumButton } from '@/components/premium/Button';
import { Reveal } from '@/components/kobo/Reveal';
import { SectionHeading } from '@/components/premium/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { fetchBonusItems } from '@/features/bonus/api';
import { BONUS_CATEGORY_GROUPS } from '@/features/bonus/constants';
import { GOAL_OPTIONS } from '@/features/kobo/goal-options';
import type { Item } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';

/** One representative item per storefront group, so the home page teases the full catalog without duplicating /bonus. */
function pickFeatured(items: Item[]): Item[] {
  const byCategory = new Map<string, Item>();
  for (const item of items) {
    if (!byCategory.has(item.category)) byCategory.set(item.category, item);
  }
  return BONUS_CATEGORY_GROUPS.map((group) =>
    group.categories.map((cat) => byCategory.get(cat.label)).find((item): item is Item => Boolean(item)),
  ).filter((item): item is Item => Boolean(item));
}

export function GoalProductsSection() {
  const itemsQuery = useQuery({ queryKey: ['bonus-items'], queryFn: fetchBonusItems });
  const featured = itemsQuery.data ? pickFeatured(itemsQuery.data) : [];

  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="Task completion goal"
            title="Complete tasks toward something real."
            description="Set a goal for what your task earnings become — cash out to your bank, buy yourself something, or send it as a gift. Here's a taste of what's on the shelf."
          />
        </Reveal>

        <Reveal>
          <div className="mb-10 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {GOAL_OPTIONS.map((option) => (
              <div key={option.key} className="flex items-start gap-3 rounded-pd-lg border border-hairline bg-surface-2 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pd-accent-soft text-pd-accent">
                  <option.icon className="h-[18px] w-[18px]" aria-hidden />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-pd-text">{option.title}</div>
                  <div className="text-[12.5px] text-pd-text-muted">{option.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {itemsQuery.isLoading ? (
          <div className="flex justify-center py-14">
            <Spinner className="h-6 w-6 text-pd-accent" />
          </div>
        ) : (
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {featured.map((item) => (
                <div key={item.id} className="rounded-pd-lg border border-hairline bg-surface p-4">
                  <PremiumProductImage item={item} className="mb-3" />
                  <div className="mb-1 truncate text-[13.5px] font-semibold text-pd-text">{item.name}</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold text-pd-text">{formatNaira(item.price)}</div>
                    {item.minPackageTier && <PremiumTierBadge tier={item.minPackageTier} />}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <PremiumButton href="/bonus" variant="secondary">
              See the full bonus store <ArrowRight className="h-4 w-4" aria-hidden />
            </PremiumButton>
            <Link href="/register" className="text-[13.5px] font-semibold text-pd-text hover:text-pd-accent">
              Sign up to set your goal →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
