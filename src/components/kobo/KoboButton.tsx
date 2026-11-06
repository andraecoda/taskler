import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'dark';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-money text-[#0E2117] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(79,168,117,.28)]',
  ghost:
    'bg-transparent border-white/[.22] text-text-dark hover:border-white/50 hover:-translate-y-0.5',
  dark: 'bg-ink text-paper hover:-translate-y-0.5',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-6 py-3.5 font-kobo text-[15px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0';

interface CommonProps {
  variant?: Variant;
  size?: 'default' | 'sm';
  className?: string;
  children: ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<CommonProps['size']>, string> = {
  default: '',
  sm: 'px-4 py-2.5 text-[13px]',
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function KoboButton(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'default', className = '', children, ...rest } = props;
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
