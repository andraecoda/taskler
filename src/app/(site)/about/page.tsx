import type { Metadata } from 'next';
import { CheckCircle2, Gift, ListChecks, ShieldCheck, Users, Wallet, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { StatsBandSection } from '@/components/landing/StatsBandSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Eyebrow } from '@/components/premium/SectionHeading';
import { FaqSection } from '@/components/premium/FaqSection';

export const metadata: Metadata = {
  title: 'About · CleekTap',
  description: 'What CleekTap is, what we’re building, and answers to common questions.',
};

const BUILD_PHASES: Array<{ icon: LucideIcon; label: string }> = [
  { icon: ShieldCheck, label: 'Secure account system' },
  { icon: ListChecks, label: 'Task management' },
  { icon: Wallet, label: 'Wallet & reward ledger' },
  { icon: Users, label: 'Referrals' },
  { icon: Gift, label: 'Rewards marketplace' },
];

export default function AboutPage() {
  return (
    <>
      <section className="overflow-hidden px-6 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto grid max-w-[1120px] items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-3.5 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px] lg:text-[48px]">
              About CleekTap
            </h1>
            <p className="mt-6 text-[16px] leading-relaxed text-pd-text-muted">
              CleekTap is a task-based earning and rewards platform. Members subscribe to an earning
              package, complete the tasks assigned to that package, and accumulate wallet
              earnings that can be redeemed toward a product purchase, a cash withdrawal, or a
              gift for someone else.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-pd-text-muted">
              Every reward on the platform is generated from a verified, approved activity — task
              completions, referral qualifications — and recorded on an auditable ledger. We
              built CleekTap around that principle: rewards should always be traceable back to the
              action that earned them.
            </p>

            <h2 className="mt-12 font-pd-display text-[20px] font-semibold text-pd-text">
              What we&apos;re building
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-pd-text-muted">
              We&apos;re a small team building CleekTap in the open, in phases — starting with a
              secure account system, then task management, a wallet and reward ledger, referrals,
              a rewards marketplace, and withdrawals. Each phase ships when it&apos;s ready, not
              before.
            </p>

            <h2 className="mt-12 font-pd-display text-[20px] font-semibold text-pd-text">Questions?</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-pd-text-muted">
              Check the FAQ below, or reach out any time on the{' '}
              <Link href="/contact" className="font-medium text-pd-accent hover:text-pd-accent/80">
                Contact page
              </Link>
              .
            </p>
          </div>

          <div className="relative flex justify-center">
            <div
              aria-hidden
              className="absolute -inset-16 -z-10 rounded-full bg-gradient-to-br from-pd-accent/[.16] via-pd-gold/[.10] to-transparent blur-3xl"
            />
            <div className="w-full max-w-[380px] rounded-pd-xl border border-hairline bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,.25)] sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[13px] font-medium text-pd-text-muted">Built so far</span>
                <span className="rounded-full bg-pd-accent-soft px-2.5 py-1 text-[11px] font-semibold text-pd-accent">
                  Live
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {BUILD_PHASES.map((phase) => (
                  <div key={phase.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-pd-text">
                        <phase.icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0 truncate text-[13.5px] font-medium text-pd-text">
                        {phase.label}
                      </div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-pd-accent" aria-hidden />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-hairline pt-5">
                <span className="text-[13px] text-pd-text-muted">Every reward traceable</span>
                <ShieldCheck className="h-5 w-5 text-pd-accent" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <StatsBandSection />
      <FaqSection />
    </>
  );
}
