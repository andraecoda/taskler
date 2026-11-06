import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const INPUT_CLASSES =
  'block w-full rounded-kobo-md border bg-white/5 px-3 py-2.5 font-kobo text-sm text-text-dark placeholder:text-text-dark-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-money/40';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className = '', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`${INPUT_CLASSES} ${hasError ? 'border-stamp/60 bg-stamp/[.08]' : 'border-white/10 focus:border-money/40'} ${className}`}
      {...rest}
    />
  );
});
