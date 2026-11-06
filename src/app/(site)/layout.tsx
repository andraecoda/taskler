import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/premium/SiteFooter';
import { SiteHeader, SITE_HEADER_HEIGHT } from '@/components/premium/SiteHeader';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-surface font-pd text-pd-text [scroll-behavior:smooth]"
      style={{ paddingTop: SITE_HEADER_HEIGHT }}
    >
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
