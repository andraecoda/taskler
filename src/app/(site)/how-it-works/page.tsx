import type { Metadata } from 'next';
import { Reveal } from '@/components/kobo/Reveal';
import { AdvertiserCtaSection } from '@/components/landing/AdvertiserCtaSection';
import { ExplainerWalkthrough } from '@/components/landing/ExplainerWalkthrough';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SectionHeading } from '@/components/premium/SectionHeading';

export const metadata: Metadata = {
  title: 'How it works · CleekTap',
  description: 'Pick a task, complete it, get paid — how earning on CleekTap works, end to end.',
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="px-6 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-28">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeading
              eyebrow="Watch how it works"
              title="From task to payout, in under a minute."
              description="A quick walkthrough of the loop every earner runs — pick, complete, get paid, cash out."
              align="center"
            />
          </Reveal>
          <ExplainerWalkthrough />
        </div>
      </section>

      <HowItWorksSection />
      <AdvertiserCtaSection />
    </>
  );
}
