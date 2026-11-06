import { Package as PackageIcon } from 'lucide-react';
import { BONUS_CATEGORY_ICON } from '@/features/bonus/constants';

/**
 * Renders the product photo once an admin sets Item.imageUrl (backend/.../items/entities/item.entity.ts).
 * Until then, falls back to a category-icon tile so every card still reads as a product slot.
 */
export function ProductImage({
  item,
  className = '',
}: {
  item: { imageUrl: string | null; category: string; name: string };
  className?: string;
}) {
  if (item.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-set host, no next/image domain to allowlist yet
      <img
        src={item.imageUrl}
        alt={item.name}
        className={`aspect-square w-full rounded-lg object-cover ${className}`}
      />
    );
  }

  const Icon = BONUS_CATEGORY_ICON[item.category] ?? PackageIcon;

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br from-gold/[.14] via-ink-2 to-money/[.10] ${className}`}
    >
      <Icon className="h-8 w-8 text-gold/80" aria-hidden />
    </div>
  );
}
