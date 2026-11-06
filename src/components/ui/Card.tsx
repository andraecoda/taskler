import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-kobo-lg border border-white/10 bg-ink-2 p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,.5)] sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
