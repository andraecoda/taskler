'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdvertiserCtaSection } from '@/components/landing/AdvertiserCtaSection';
import { ExploreSection } from '@/components/landing/ExploreSection';
import { GoalProductsSection } from '@/components/landing/GoalProductsSection';
import { Hero } from '@/components/landing/Hero';
import { PackagesSection } from '@/components/landing/PackagesSection';
import { PlatformMarquee } from '@/components/landing/PlatformMarquee';
import { StatsBandSection } from '@/components/landing/StatsBandSection';
import { TaskMarketplaceSection } from '@/components/landing/TaskMarketplaceSection';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return null;
  }

  return (
    <>
      <Hero />
      <PlatformMarquee />
      <TaskMarketplaceSection />
      <PackagesSection />
      <GoalProductsSection />
      <ExploreSection />
      <StatsBandSection />
      <AdvertiserCtaSection />
    </>
  );
}
