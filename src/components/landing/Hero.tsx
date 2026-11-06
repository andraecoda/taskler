import { Heart, MessageSquare, Tv, UserPlus, type LucideIcon } from 'lucide-react';
import { Eyebrow } from '@/components/premium/SectionHeading';
import { PremiumButton } from '@/components/premium/Button';
import { formatNaira } from '@/lib/currency';

const ACTIVITY: Array<{ icon: LucideIcon; label: string; time: string; amount: number }> = [
  { icon: Heart, label: 'Liked @brandpage · IG', time: 'just now', amount: 50 },
  { icon: UserPlus, label: 'Followed @creator · X', time: '2 min ago', amount: 30 },
  { icon: Tv, label: 'Subscribed to a channel · YT', time: '19 min ago', amount: 120 },
  { icon: MessageSquare, label: 'Commented on a post · IG', time: '1 hr ago', amount: 40 },
];

export function Hero() {
  return (
    <section className="overflow-hidden px-6 pb-20 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto grid max-w-[1120px] items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <Eyebrow>Paid social engagement</Eyebrow>
          <h1 className="mt-5 mb-6 font-pd-display text-[44px] font-semibold leading-[1.05] tracking-[-.03em] text-pd-text sm:text-[56px] lg:text-[68px]">
            Turn taps into
            <br />
            <span className="text-pd-accent">take-home.</span>
          </h1>
          <p className="mb-9 max-w-[460px] text-[18px] leading-relaxed text-pd-text-muted">
            Like a page, follow a creator, subscribe to a channel, drop a comment — get an
            itemized commission for every task, paid straight to your wallet.
          </p>
          <div className="mb-12 flex flex-wrap gap-3.5">
            <PremiumButton href="#tasks">Browse open tasks</PremiumButton>
            <PremiumButton href="/how-it-works" variant="secondary">
              See how payouts work
            </PremiumButton>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-pd-text-muted">
            <div>
              <strong className="font-semibold text-pd-text">12,400+</strong> active earners
            </div>
            <div>
              <strong className="font-semibold text-pd-text">₦48.2M+</strong> paid out
            </div>
            <div>
              <strong className="font-semibold text-pd-text">2.1M+</strong> tasks completed
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div
            aria-hidden
            className="absolute -inset-16 -z-10 rounded-full bg-gradient-to-br from-pd-accent/[.16] via-pd-gold/[.10] to-transparent blur-3xl"
          />
          <div className="w-full max-w-[380px] rounded-pd-xl border border-hairline bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,.25)] sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[13px] font-medium text-pd-text-muted">Today&apos;s activity</span>
              <span className="rounded-full bg-pd-accent-soft px-2.5 py-1 text-[11px] font-semibold text-pd-accent">
                Live
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {ACTIVITY.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-pd-text">
                      <item.icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-medium text-pd-text">{item.label}</div>
                      <div className="text-[12px] text-pd-text-faint">{item.time}</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-[13.5px] font-semibold text-pd-accent">
                    +{formatNaira(item.amount)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-hairline pt-5">
              <span className="text-[13px] text-pd-text-muted">Wallet balance</span>
              <span className="text-[22px] font-semibold text-pd-text">{formatNaira(260)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
