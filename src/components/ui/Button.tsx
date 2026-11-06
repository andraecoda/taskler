import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  children: ReactNode;
}

export const BUTTON_VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-money text-[#0E2117] hover:bg-[#5FB584] focus-visible:outline-money',
  secondary:
    'bg-ink text-text-dark border border-white/15 hover:border-white/30 focus-visible:outline-money',
  ghost: 'bg-transparent text-money hover:bg-money/10 focus-visible:outline-money',
};

export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-kobo-md px-4 py-2.5 font-kobo text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`w-full disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
