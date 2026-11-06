import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'sm';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-pd-accent-solid text-pd-accent-contrast hover:brightness-105 shadow-[0_1px_2px_rgba(0,0,0,.06)]',
  secondary:
    'bg-surface text-pd-text border border-hairline-strong hover:border-pd-text/30 hover:bg-surface-2',
  ghost: 'bg-transparent text-pd-text hover:bg-surface-2',
};

const SIZE_CLASSES: Record<Size, string> = {
  md: 'px-6 py-3 text-[15px]',
  sm: 'px-4 py-2 text-[13.5px]',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full font-pd font-medium tracking-[-.01em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function PremiumButton(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className = '', children, isLoading = false, ...rest } = props;
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { disabled, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} disabled={disabled || isLoading} {...buttonRest}>
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
