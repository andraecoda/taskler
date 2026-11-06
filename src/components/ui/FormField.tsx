import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13.5px] font-medium text-text-dark-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[13px] text-stamp">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-text-dark-muted">{hint}</p>
      ) : null}
    </div>
  );
}
