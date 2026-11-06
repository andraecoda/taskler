import { ArrowRight, Gift, Users, Wallet, Workflow, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/kobo/Reveal';
import { SectionHeading } from '@/components/premium/SectionHeading';

const EXPLORE_LINKS: Array<{ href: string; icon: LucideIcon; title: string; description: string }> = [
  {
    href: '/how-it-works',
    icon: Workflow,
    title: 'How it works',
    description: 'Three steps from picking a task to getting paid.',
  },
  {
    href: '/wallet',
    icon: Wallet,
    title: 'Wallet',
    description: 'How earnings land in your wallet, and how withdrawals work.',
  },
  {
    href: '/about#earners',
    icon: Users,
    title: 'Real earners',
    description: 'Stories and numbers from people earning on CleekTap today.',
  },
  {
    href: '/bonus',
    icon: Gift,
    title: 'Bonus store',
    description: 'Redeem your wallet balance for electronics, appliances, and more.',
  },
];

export function ExploreSection() {
  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="Explore CleekTap"
            title="Everything CleekTap, one click away."
            description="Dig into how tasks, payouts, and rewards work before you sign up."
          />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-pd-lg border border-hairline bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,.2)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pd-accent-soft text-pd-accent">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mb-1.5 font-pd-display text-[17px] font-semibold text-pd-text">{item.title}</h3>
                <p className="mb-4 text-[13.5px] text-pd-text-muted">{item.description}</p>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-pd-text">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
