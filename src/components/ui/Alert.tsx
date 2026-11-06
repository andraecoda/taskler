import { ReactNode } from 'react';

interface AlertProps {
  variant: 'error' | 'success' | 'info';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<AlertProps['variant'], string> = {
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  info: 'bg-indigo-50 text-indigo-800 border-indigo-200',
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
