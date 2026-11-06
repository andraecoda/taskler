import { Package as PackageIcon } from 'lucide-react';
import { BONUS_CATEGORY_ICON } from '@/features/bonus/constants';

/**
 * Renders the product photo once an admin sets Item.imageUrl (backend/.../items/entities/item.entity.ts).
 * Until then, falls back to a category-icon tile so every card still reads as a product slot.
 */
export function PremiumProductImage({
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
        className={`aspect-square w-full rounded-pd-md object-cover ${className}`}
      />
    );
  }

  const Icon = BONUS_CATEGORY_ICON[item.category] ?? PackageIcon;

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-pd-md bg-surface-2 ${className}`}
    >
      <Icon className="h-8 w-8 text-pd-text-faint" aria-hidden />
    </div>
  );
}
