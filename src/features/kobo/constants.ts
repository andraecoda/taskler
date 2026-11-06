import { Heart, MessageSquare, ThumbsUp, Tv, UserPlus, type LucideIcon } from 'lucide-react';
import type { Platform } from './types';

/**
 * The 5 task types priced per §6 of the product spec. Keys match what the backend will use
 * once /packages and /tasks are wired — kept here for now as the single source for landing +
 * dashboard-shell icon/label metadata, ahead of the real API existing.
 */
export type TaskTypeKey = 'like' | 'follow' | 'subscribe' | 'comment' | 'like_comment';

export interface TaskTypeMeta {
  key: TaskTypeKey;
  label: string;
  icon: LucideIcon;
}

export const TASK_TYPE_META: Record<TaskTypeKey, TaskTypeMeta> = {
  like: { key: 'like', label: 'Like a page', icon: Heart },
  follow: { key: 'follow', label: 'Follow an account', icon: UserPlus },
  subscribe: { key: 'subscribe', label: 'Subscribe to a channel', icon: Tv },
  comment: { key: 'comment', label: 'Comment on a post', icon: MessageSquare },
  like_comment: { key: 'like_comment', label: 'Like a comment', icon: ThumbsUp },
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
};

export type PackageTier = 'basic' | 'silver' | 'ultimate';

/** Ordinal rank of each package tier — higher tiers unlock everything lower tiers unlock, plus more. */
export const PACKAGE_TIER_RANK: Record<PackageTier, number> = { basic: 0, silver: 1, ultimate: 2 };

export const PACKAGE_TIER_LABEL: Record<PackageTier, string> = {
  basic: 'Basic',
  silver: 'Silver',
  ultimate: 'Ultimate',
};

/** Mirrors the backend's ItemsService.redeem gate — see backend/src/modules/packages/package-tier-rank.util.ts. */
export function meetsPackageTier(userTier: PackageTier | null, required: PackageTier | null): boolean {
  if (!required) return true;
  if (!userTier) return false;
  return PACKAGE_TIER_RANK[userTier] >= PACKAGE_TIER_RANK[required];
}

export interface PackageDef {
  tier: PackageTier;
  name: string;
  price: number;
  rates: Record<TaskTypeKey, number>;
}

/** Mirrors the package/rate table in §6 — becomes the fallback until GET /packages is live. */
export const PACKAGES: PackageDef[] = [
  {
    tier: 'basic',
    name: 'Basic',
    price: 4000,
    rates: { like: 15, follow: 12, subscribe: 25, comment: 20, like_comment: 8 },
  },
  {
    tier: 'silver',
    name: 'Silver',
    price: 7000,
    rates: { like: 30, follow: 25, subscribe: 50, comment: 40, like_comment: 15 },
  },
  {
    tier: 'ultimate',
    name: 'Ultimate',
    price: 10000,
    rates: { like: 45, follow: 38, subscribe: 75, comment: 60, like_comment: 23 },
  },
];

export const NEXT_TIER: Record<PackageTier, PackageTier | null> = {
  basic: 'silver',
  silver: 'ultimate',
  ultimate: null,
};

/**
 * Illustrative "open right now" cards on the landing page. Prices here are marketing preview
 * numbers only (not tied to any single package tier) — real per-tier pricing lives in PACKAGES
 * above and is shown in the Packages section.
 */
export const LANDING_TASK_PREVIEW: Array<{
  key: TaskTypeKey | 'reply';
  label: string;
  platform: string;
  price: number;
  icon: LucideIcon;
}> = [
  { key: 'like', label: 'Like a page', platform: 'Instagram', price: 50, icon: Heart },
  { key: 'follow', label: 'Follow an account', platform: 'X (Twitter)', price: 40, icon: UserPlus },
  { key: 'subscribe', label: 'Subscribe to a channel', platform: 'YouTube', price: 120, icon: Tv },
  { key: 'comment', label: 'Comment on a post', platform: 'Instagram', price: 60, icon: MessageSquare },
  { key: 'like_comment', label: 'Like a comment', platform: 'Facebook', price: 20, icon: Heart },
  { key: 'reply', label: 'Reply to a comment', platform: 'Instagram', price: 45, icon: MessageSquare },
];

export const TRUST_STATS = [
  { value: 12400, prefix: '', suffix: '+', decimals: 0, label: 'Active earners this month' },
  { value: 48.2, prefix: '₦', suffix: 'M+', decimals: 1, label: 'Paid to earners since launch' },
  { value: 2.1, prefix: '', suffix: 'M+', decimals: 1, label: 'Tasks completed to date' },
] as const;

export const TESTIMONIALS = [
  {
    amount: '₦31,200 this month',
    quote:
      "I do tasks on my way to school. By the time I'm at the bus stop I've usually made enough for lunch.",
    name: 'Amaka O., Lagos',
  },
  {
    amount: '₦22,600 this month',
    quote: 'The receipt view is what got me. I can see exactly what I earned from what, no guessing.',
    name: 'Tunde A., Ibadan',
  },
  {
    amount: '₦45,900 this month',
    quote: 'Withdrawals actually land same-day. That alone made me trust the platform enough to stay.',
    name: 'Blessing E., Abuja',
  },
] as const;

export const PLATFORM_MARQUEE = [
  'Instagram likes',
  'YouTube subscribes',
  'X follows',
  'Facebook comments',
  'TikTok likes',
] as const;
