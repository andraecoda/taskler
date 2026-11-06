import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/premium/SectionHeading';

export const metadata: Metadata = {
  title: 'Advertiser guidelines · CleekTap',
  description: 'What you can post as a task on CleekTap, and how tasks get reviewed and paid out.',
};

const RULES = [
  {
    title: 'Real, working destinations only',
    body: 'The URL you submit must point to a real page, channel, or post you control or represent — no placeholder links, shorteners that hide the destination, or pages that redirect elsewhere after review.',
  },
  {
    title: 'No prohibited or misleading content',
    body: 'Tasks may not promote illegal goods or services, adult content, hate speech, harassment, financial scams, or anything designed to mislead earners about what they’re engaging with.',
  },
  {
    title: 'One action per task type',
    body: 'Each task covers a single action — like, follow, subscribe, comment, or like a comment — on a single platform (Instagram, YouTube, X, Facebook, or TikTok). Bundle multiple actions into separate tasks.',
  },
  {
    title: 'Accurate target counts',
    body: 'Set a target count you actually want fulfilled. Padding a target to game visibility, then cancelling before it completes, may result in the task being rejected on review.',
  },
  {
    title: 'No incentivizing outside CleekTap',
    body: 'Don’t instruct earners to engage in ways that violate the destination platform’s own terms of service — CleekTap tasks must be legitimate engagement, not manufactured metrics.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'You submit the task',
    body: 'Pick a platform, task type, target count, and duration, then submit the destination URL — the cost is calculated up front from your rate card.',
  },
  {
    num: '02',
    title: 'We review it',
    body: 'Every task is checked against these guidelines before it goes live. Most reviews clear within one business day.',
  },
  {
    num: '03',
    title: 'You pay, it goes live',
    body: 'Once approved, complete the bank transfer and confirm it — the task stays in draft, invisible to earners, until an admin confirms your payment.',
  },
];

export default function GuidelinesPage() {
  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[760px]">
        <Eyebrow>For advertisers</Eyebrow>
        <h1 className="mt-3.5 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px]">
          Task guidelines
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-pd-text-muted">
          Every task posted on CleekTap is reviewed against the rules below before it goes live and
          becomes visible to earners. Keeping to these keeps payouts fast and disputes rare.
        </p>

        <h2 className="mt-12 font-pd-display text-[19px] font-semibold text-pd-text">What&apos;s allowed</h2>
        <div className="mt-5 flex flex-col gap-5">
          {RULES.map((rule) => (
            <div key={rule.title} className="rounded-pd-lg border border-hairline bg-surface-2 p-5">
              <h3 className="font-pd-display text-[15px] font-semibold text-pd-text">{rule.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-pd-text-muted">{rule.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-pd-display text-[19px] font-semibold text-pd-text">How review works</h2>
        <div className="mt-5 grid gap-px overflow-hidden rounded-pd-lg border border-hairline bg-hairline sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-surface p-6">
              <span className="text-[13px] font-semibold tracking-[.08em] text-pd-accent">{step.num}</span>
              <h3 className="my-3 font-pd-display text-[16px] font-semibold text-pd-text">{step.title}</h3>
              <p className="text-[13.5px] leading-relaxed text-pd-text-muted">{step.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-[15px] text-pd-text-muted">
          Not sure whether something fits?{' '}
          <Link href="/contact" className="font-medium text-pd-accent hover:text-pd-accent/80">
            Ask us before you post
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
