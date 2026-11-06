import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const PREMIUM_INPUT_CLASSES =
  'block w-full rounded-pd-md border bg-surface px-3.5 py-2.5 font-pd text-[15px] text-pd-text placeholder:text-pd-text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-pd-accent/25';

export const PremiumInput = forwardRef<HTMLInputElement, InputProps>(function PremiumInput(
  { hasError = false, className = '', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`${PREMIUM_INPUT_CLASSES} ${hasError ? 'border-red-400 bg-red-50/50' : 'border-hairline-strong focus:border-pd-accent/50'} ${className}`}
      {...rest}
    />
  );
});
