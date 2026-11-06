'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { KoboLogo } from '@/components/kobo/LogoMark';
import { useAuth } from '@/lib/auth-context';
import { PremiumButton } from './Button';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/bonus', label: 'Bonus' },
];

export const SITE_HEADER_HEIGHT = 72;

export function SiteHeader() {
  const { status } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-hairline bg-glass-bg backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
        style={{ height: SITE_HEADER_HEIGHT }}
      >
        <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-6 sm:px-8">
          <Link href="/" aria-label="CleekTap home">
            <KoboLogo className="text-pd-text" />
          </Link>

          <nav className="hidden items-center gap-8 text-[14.5px] font-medium text-pd-text-muted lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-pd-text">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle className="hidden sm:flex" />
            <div className="hidden items-center gap-2.5 lg:flex">
              {status === 'authenticated' ? (
                <PremiumButton href="/dashboard" size="sm">
                  Dashboard
                </PremiumButton>
              ) : (
                <>
                  <PremiumButton href="/login" variant="ghost" size="sm">
                    Log in
                  </PremiumButton>
                  <PremiumButton href="/register" size="sm">
                    Start earning
                  </PremiumButton>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-pd-text-muted hover:bg-surface-2 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-x-0 bottom-0 z-30 bg-black/30 lg:hidden"
          style={{ top: SITE_HEADER_HEIGHT }}
        />
      )}

      {mobileOpen && (
        <div
          className="fixed inset-x-0 z-40 border-b border-hairline bg-surface px-6 pb-6 pt-4 shadow-xl lg:hidden"
          style={{ top: SITE_HEADER_HEIGHT }}
        >
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-pd-text-muted transition-colors hover:bg-surface-2 hover:text-pd-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
            <span className="text-[13px] text-pd-text-muted">Theme</span>
            <ThemeToggle />
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            {status === 'authenticated' ? (
              <PremiumButton href="/dashboard" onClick={() => setMobileOpen(false)}>
                Dashboard
              </PremiumButton>
            ) : (
              <>
                <PremiumButton href="/login" variant="secondary" onClick={() => setMobileOpen(false)}>
                  Log in
                </PremiumButton>
                <PremiumButton href="/register" onClick={() => setMobileOpen(false)}>
                  Start earning
                </PremiumButton>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
