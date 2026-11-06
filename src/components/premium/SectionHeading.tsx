import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.08em] text-pd-accent">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={`mb-14 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'} ${className}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px] lg:text-[48px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[17px] leading-relaxed text-pd-text-muted">{description}</p>
      )}
    </div>
  );
}
