import {
  Drumstick,
  Gift,
  Headphones,
  Laptop,
  Radio,
  Shirt,
  ShoppingBasket,
  Signal,
  Smartphone,
  Tablet,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { meetsPackageTier, type PackageTier } from '@/features/kobo/constants';
import type { Item } from '@/features/kobo/types';

/**
 * Groups the flat `Item.category` values returned by GET /items into the 5 storefront sections
 * of the bonus redemption catalog. Leaf category strings must match the backend seed exactly
 * (backend/src/database/seeds/seed.ts ITEM_SEED) — this is the single source of truth for how
 * they're organized on the public storefront.
 */
export interface BonusCategoryGroup {
  key: string;
  label: string;
  icon: LucideIcon;
  categories: Array<{ label: string; icon: LucideIcon }>;
}

export const BONUS_CATEGORY_GROUPS: BonusCategoryGroup[] = [
  {
    key: 'electronics',
    label: 'Consumer Electronics',
    icon: Smartphone,
    categories: [
      { label: 'Phones', icon: Smartphone },
      { label: 'Tablets', icon: Tablet },
      { label: 'Laptops', icon: Laptop },
      { label: 'Smart TV', icon: Tv },
      { label: 'Audio & Music', icon: Headphones },
      { label: 'Phone accessories', icon: Radio },
    ],
  },
  {
    key: 'home-appliances',
    label: 'Home Appliances',
    icon: WashingMachine,
    categories: [{ label: 'Home appliances', icon: WashingMachine }],
  },
  {
    key: 'kitchen-utensils',
    label: 'Kitchen Utensils',
    icon: UtensilsCrossed,
    categories: [{ label: 'Kitchen utensils', icon: UtensilsCrossed }],
  },
  {
    key: 'food-items',
    label: 'Food Items',
    icon: ShoppingBasket,
    categories: [
      { label: 'Christmas package', icon: Gift },
      { label: 'Chicken/Poultry', icon: Drumstick },
    ],
  },
  {
    key: 'clothing',
    label: "Men's & Women's Clothing",
    icon: Shirt,
    categories: [
      { label: "Men's clothing", icon: Shirt },
      { label: "Women's clothing", icon: Shirt },
    ],
  },
  {
    key: 'subscriptions',
    label: 'Subscriptions',
    icon: Wifi,
    categories: [
      { label: 'Airtime', icon: Signal },
      { label: 'Data', icon: Wifi },
      { label: 'TV subscription', icon: Tv },
      { label: 'Electricity', icon: Zap },
    ],
  },
];

/** Leaf category -> icon, for item cards. Falls back to the group icon if a category is unlisted. */
export const BONUS_CATEGORY_ICON: Record<string, LucideIcon> = Object.fromEntries(
  BONUS_CATEGORY_GROUPS.flatMap((group) => group.categories.map((cat) => [cat.label, cat.icon])),
);

export interface CategoryAccessChip {
  key: string;
  label: string;
  icon: LucideIcon;
}

/**
 * What a package tier unlocks in the bonus store, computed from the live catalog rather than
 * hardcoded — a group renders as one chip when every one of its subcategories is unlocked at
 * this tier, otherwise each unlocked subcategory gets its own chip (e.g. Basic only unlocks
 * Audio & Music and Phone accessories out of Consumer Electronics' 6 subcategories).
 */
export function categoryAccessForTier(tier: PackageTier, items: Item[]): CategoryAccessChip[] {
  const availableLeaves = new Set(items.map((item) => item.category));
  const unlockedLeaves = new Set(
    items.filter((item) => meetsPackageTier(tier, item.minPackageTier)).map((item) => item.category),
  );

  const chips: CategoryAccessChip[] = [];
  for (const group of BONUS_CATEGORY_GROUPS) {
    const presentLeaves = group.categories.filter((cat) => availableLeaves.has(cat.label));
    const unlockedInGroup = presentLeaves.filter((cat) => unlockedLeaves.has(cat.label));
    if (unlockedInGroup.length === 0) continue;

    if (unlockedInGroup.length === presentLeaves.length) {
      chips.push({ key: group.key, label: group.label, icon: group.icon });
    } else {
      for (const cat of unlockedInGroup) {
        chips.push({ key: cat.label, label: cat.label, icon: cat.icon });
      }
    }
  }
  return chips;
}
