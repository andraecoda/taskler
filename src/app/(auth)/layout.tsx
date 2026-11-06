import Link from 'next/link';
import { ReactNode } from 'react';
import { KoboLogo } from '@/components/kobo/LogoMark';
import { ThemeToggle } from '@/components/premium/ThemeToggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center bg-surface px-4 py-12 font-pd">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <div className="mb-8">
        <Link href="/" aria-label="CleekTap home">
          <KoboLogo className="text-pd-text" />
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
