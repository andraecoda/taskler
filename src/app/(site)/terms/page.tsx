import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/premium/SectionHeading';

export const metadata: Metadata = {
  title: 'Terms of Service · CleekTap',
  description: 'The terms that govern using CleekTap as an earner or an advertiser.',
};

const SECTIONS = [
  {
    title: '1. Acceptance of terms',
    body: 'By creating a CleekTap account you agree to these terms. If you don’t agree, don’t create an account or use the platform.',
  },
  {
    title: '2. Your account',
    body: 'You must provide accurate registration details and are responsible for activity under your account. Keep your login credentials confidential — accounts are individual and may not be shared or transferred.',
  },
  {
    title: '3. Earning tasks',
    body: 'Earners complete tasks — likes, follows, subscriptions, and comments — posted by advertisers and are credited a fixed, up-front commission per completed and verified task. CleekTap may withhold or reverse a credit for a task later found to be fraudulent, incomplete, or in violation of the destination platform’s own terms.',
  },
  {
    title: '4. Packages',
    body: 'Earning rates are set by the package you subscribe to. Package subscriptions are confirmed after a bank transfer is verified by CleekTap; the rates that apply are the ones live on your package at the time each task is completed.',
  },
  {
    title: '5. Wallet, withdrawals, and redemption',
    body: 'Your wallet balance reflects verified earnings, referral commissions, and any adjustments, less withdrawals and redemptions. Withdrawals are subject to a minimum balance and a maximum-withdrawable cap disclosed in your wallet. Items redeemed against your balance — for yourself or as a gift — are subject to the coverage rule shown at the time of redemption.',
  },
  {
    title: '6. Advertisers and posted tasks',
    body: 'Advertisers are responsible for the accuracy and legality of every task they post. All tasks are reviewed against our Guidelines before going live, and payment is required before a task becomes visible to earners.',
  },
  {
    title: '7. Referrals',
    body: 'Referral commissions are paid on qualifying activity from users who signed up with your referral code, at the rate disclosed in your account. CleekTap may adjust or withhold a referral commission tied to activity later found to be fraudulent.',
  },
  {
    title: '8. Prohibited conduct',
    body: 'You may not use bots, scripts, or multiple accounts to complete tasks; misrepresent your identity; post tasks that violate our Guidelines; or attempt to manipulate wallet balances, referrals, or redemptions. Violations may result in suspension, forfeiture of unpaid balances tied to the violation, or account termination.',
  },
  {
    title: '9. Suspension and termination',
    body: 'We may suspend or terminate an account that violates these terms. You may close your account at any time; verified, unpaid balances at the time of closure are settled according to standard withdrawal terms.',
  },
  {
    title: '10. Disclaimers',
    body: 'CleekTap is provided "as is." We work to keep the platform accurate and available but don’t guarantee uninterrupted service or that every advertiser task will remain available for its full stated duration.',
  },
  {
    title: '11. Changes to these terms',
    body: 'We may update these terms as the platform evolves. Material changes will be reflected here with an updated effective date; continued use after a change means you accept the update.',
  },
];

export default function TermsPage() {
  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[760px]">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-3.5 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px]">
          Terms of Service
        </h1>
        <p className="mt-4 text-[14px] text-pd-text-faint">Effective from your date of registration.</p>
        <p className="mt-6 text-[16px] leading-relaxed text-pd-text-muted">
          These terms govern your use of CleekTap as an earner, an advertiser, or both. They work
          alongside our{' '}
          <Link href="/guidelines" className="font-medium text-pd-accent hover:text-pd-accent/80">
            task guidelines
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-pd-accent hover:text-pd-accent/80">
            privacy policy
          </Link>
          .
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-pd-display text-[17px] font-semibold text-pd-text">{section.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-pd-text-muted">{section.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-[15px] text-pd-text-muted">
          Questions about these terms?{' '}
          <Link href="/contact" className="font-medium text-pd-accent hover:text-pd-accent/80">
            Contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
