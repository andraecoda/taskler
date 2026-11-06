'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, LayoutDashboard, Package, Plus, User, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { KoboLogo } from '@/components/kobo/LogoMark';
import { formatNaira } from '@/lib/currency';
import type { PackageTier } from '@/features/kobo/constants';

const NAV_ITEMS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/referrals', label: 'Referrals', icon: Users },
  { href: '/dashboard/post-task', label: 'Post a task', icon: Plus },
  { href: '/dashboard/packages', label: 'Packages', icon: Package },
];

const TIER_PILL_CLASSES: Record<PackageTier, string> = {
  basic: 'bg-tier-basic/[.18] text-tier-basic',
  silver: 'bg-tier-silver/[.18] text-tier-silver',
  ultimate: 'bg-tier-ultimate/[.18] text-tier-ultimate',
};

interface SidebarProps {
  packageTier: PackageTier | null;
  packageName: string | null;
  /** True while the packages list is still loading — avoids flashing "Choose a package" before we actually know. */
  packagesLoading?: boolean;
  walletBalance: number;
  /** Renders as an overlay drawer on small screens; caller controls visibility. */
  onNavigate?: () => void;
}

export function Sidebar({
  packageTier,
  packageName,
  packagesLoading = false,
  walletBalance,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-ink-2 px-[18px] py-[26px] lg:sticky lg:top-0 lg:h-screen lg:w-[250px] lg:border-r lg:border-white/[.08]">
      <Link href="/dashboard" className="mb-[30px] px-2">
        <KoboLogo className="text-text-dark" />
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-[11px] text-[14.5px] font-medium transition-colors ${
                active ? 'bg-money/[.14] text-text-dark' : 'text-text-dark-muted hover:bg-white/5 hover:text-text-dark'
              }`}
            >
              <item.icon className={`h-[17px] w-[17px] shrink-0 ${active ? 'text-money' : ''}`} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <Link
        href="/dashboard/profile"
        onClick={onNavigate}
        className={`mb-3 flex items-center gap-3 rounded-[10px] px-3 py-[11px] text-[14.5px] font-medium transition-colors ${
          pathname === '/dashboard/profile'
            ? 'bg-money/[.14] text-text-dark'
            : 'text-text-dark-muted hover:bg-white/5 hover:text-text-dark'
        }`}
      >
        <User className="h-[17px] w-[17px] shrink-0" aria-hidden />
        Account
      </Link>

      <div className="rounded-kobo-md border border-white/[.08] bg-ink-3 p-4">
        {packagesLoading ? (
          <div className="mb-2.5 h-[22px] w-[110px] animate-pulse rounded-full bg-white/[.08]" />
        ) : packageTier && packageName ? (
          <span
            className={`mb-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-kobo-mono text-[11px] font-semibold uppercase tracking-[.06em] ${TIER_PILL_CLASSES[packageTier]}`}
          >
            {packageName} package
          </span>
        ) : (
          <Link
            href="/dashboard/packages"
            onClick={onNavigate}
            className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-gold/[.18] px-2.5 py-1 font-kobo-mono text-[11px] font-semibold uppercase tracking-[.06em] text-gold"
          >
            Choose a package
          </Link>
        )}
        <div className="font-kobo-mono text-[10.5px] uppercase tracking-[.08em] text-text-dark-muted">
          Wallet balance
        </div>
        <div className="mt-1 font-display text-[21px] font-bold text-text-dark">
          {formatNaira(walletBalance)}
        </div>
      </div>
    </aside>
  );
}
