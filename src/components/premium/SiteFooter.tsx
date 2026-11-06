import Link from 'next/link';
import { KoboLogo } from '@/components/kobo/LogoMark';
import { Container } from './Container';

const FOOT_COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Browse tasks', href: '/#tasks' },
      { label: 'Wallet', href: '/wallet' },
      { label: 'Bonus store', href: '/bonus' },
      { label: 'Referrals', href: '/register' },
    ],
  },
  {
    heading: 'Advertisers',
    links: [
      { label: 'Post a task', href: '/register' },
      { label: 'Pricing', href: '/#packages' },
      { label: 'Guidelines', href: '/guidelines' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'News', href: '/news' },
      { label: 'FAQ', href: '/about#faq' },
      { label: 'Support', href: '/contact' },
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-surface px-6 py-16 sm:px-8">
      <Container className="!px-0">
        <div className="flex flex-col justify-between gap-10 pb-14 sm:flex-row sm:flex-wrap">
          <div>
            <Link href="/" aria-label="CleekTap home">
              <KoboLogo className="text-pd-text" />
            </Link>
            <p className="mt-3 max-w-[220px] text-[13.5px] leading-relaxed text-pd-text-muted">
              Get paid to engage — complete tasks, earn instantly, redeem for cash or rewards.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {FOOT_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h5 className="mb-3.5 text-[12px] font-semibold uppercase tracking-[.08em] text-pd-text-faint">
                  {column.heading}
                </h5>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="mb-2.5 block text-[14px] text-pd-text-muted transition-colors hover:text-pd-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6 text-[12.5px] text-pd-text-faint">
          <span>© {new Date().getFullYear()} CleekTap. All rights reserved.</span>
          <span>Payouts processed in NGN · bi-weekly withdrawals</span>
        </div>
      </Container>
    </footer>
  );
}
