import { Check, Heart, MessageSquare, Tv, UserPlus, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/kobo/Reveal';
import { Eyebrow } from '@/components/premium/SectionHeading';
import { formatNaira } from '@/lib/currency';

const WALLET_POINTS = [
  'Instant commission on task verification',
  'Withdraw to your bank twice a month',
  'Track every transaction, itemized',
];

const TRANSACTIONS: Array<{ icon: LucideIcon; name: string; time: string; amount: number }> = [
  { icon: Heart, name: 'Liked @naijaeats page', time: '2 min ago', amount: 50 },
  { icon: Tv, name: 'Subscribed to Tekno Reviews', time: '19 min ago', amount: 120 },
  { icon: MessageSquare, name: 'Commented on a Lagos Foodie post', time: '1 hr ago', amount: 60 },
  { icon: UserPlus, name: 'Followed @ChukwuBuilds', time: '3 hrs ago', amount: 40 },
];

export function WalletPreviewSection() {
  return (
    <section id="wallet" className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-[1120px] items-center gap-16 lg:grid-cols-[.9fr_1.1fr]">
        <Reveal>
          <Eyebrow>Your earnings</Eyebrow>
          <h2 className="my-5 font-pd-display text-[32px] font-semibold leading-[1.12] tracking-[-.02em] text-pd-text sm:text-[40px]">
            Every task, itemized.
            <br />
            Every kobo, tracked.
          </h2>
          <p className="mb-7 max-w-[440px] text-[16px] leading-relaxed text-pd-text-muted">
            Your wallet reads like a statement — see exactly what you did, for whom, and what it
            paid, in real time.
          </p>
          <ul className="flex flex-col gap-3.5">
            {WALLET_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[14.5px] text-pd-text-muted">
                <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-pd-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="rounded-pd-xl border border-hairline bg-surface p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,.18)] sm:p-8">
            <div className="mb-5 flex items-start justify-between border-b border-hairline pb-6">
              <div>
                <div className="text-[12px] font-medium uppercase tracking-[.08em] text-pd-text-faint">
                  Available balance
                </div>
                <div className="mt-1.5 font-pd-display text-[32px] font-semibold text-pd-text">
                  {formatNaira(18420)}
                </div>
              </div>
              <button
                type="button"
                className="rounded-full bg-pd-accent-solid px-5 py-2.5 text-[13.5px] font-semibold text-pd-accent-contrast"
              >
                Withdraw
              </button>
            </div>

            <div className="flex flex-col">
              {TRANSACTIONS.map((tx, index) => (
                <div
                  key={tx.name}
                  className={`flex items-center justify-between py-3 ${
                    index !== TRANSACTIONS.length - 1 ? 'border-b border-hairline' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-surface-2 text-pd-text">
                      <tx.icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-pd-text">{tx.name}</div>
                      <div className="text-[11.5px] text-pd-text-faint">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-[14px] font-semibold text-pd-accent">+{formatNaira(tx.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
