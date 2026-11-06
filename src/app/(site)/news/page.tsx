import type { Metadata } from 'next';
import { Eyebrow } from '@/components/premium/SectionHeading';
import { NewsletterSignup } from '@/components/landing/NewsletterSignup';

export const metadata: Metadata = {
  title: 'News · CleekTap',
  description: 'Product updates and announcements from the CleekTap team.',
};

// Placeholder content until a real CMS/blog backend exists — replace with real posts.
const POSTS = [
  {
    title: 'CleekTap is live: accounts, packages, and the task engine',
    date: '2026-08-01',
    excerpt:
      'Our first release covers secure account creation, package subscriptions, and the core task-completion flow. Wallet, referrals, and the rewards marketplace are next.',
  },
  {
    title: "What's next: wallet & reward ledger",
    date: '2026-08-15',
    excerpt:
      'A look at how we’re building the reward ledger — every task reward and referral bonus recorded as an immutable, auditable transaction.',
  },
  {
    title: 'Security first: how we handle your account',
    date: '2026-08-20',
    excerpt:
      'Password hashing, rotating refresh tokens, account lockout after repeated failed logins, and independent server-side validation on every request.',
  },
] as const;

export default function NewsPage() {
  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px]">
        <Eyebrow>News</Eyebrow>
        <h1 className="mt-3.5 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px]">
          News
        </h1>
        <p className="mt-4 text-[16px] text-pd-text-muted">
          Product updates and announcements from the CleekTap team.
        </p>

        <div className="mt-12 space-y-10">
          {POSTS.map((post) => (
            <article key={post.title} className="border-b border-hairline pb-10 last:border-b-0">
              <time dateTime={post.date} className="text-[12px] text-pd-text-faint">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <h2 className="mt-2 font-pd-display text-[19px] font-semibold text-pd-text">{post.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-pd-text-muted">{post.excerpt}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-pd-lg border border-hairline bg-surface-2 p-6">
          <h3 className="font-pd-display text-[15.5px] font-semibold text-pd-text">Stay updated</h3>
          <p className="mt-1.5 text-[13.5px] text-pd-text-muted">
            Product news and updates, straight to your inbox.
          </p>
          <NewsletterSignup className="mt-4" />
        </div>
      </div>
    </section>
  );
}
