import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-pd-lg border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,.04),0_16px_40px_-24px_rgba(0,0,0,.18)] sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
