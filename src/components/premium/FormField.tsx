import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function PremiumFormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13.5px] font-medium text-pd-text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[13px] text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-pd-text-faint">{hint}</p>
      ) : null}
    </div>
  );
}
