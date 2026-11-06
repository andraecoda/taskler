export function ProgressBar({
  percent,
  tone = 'money',
}: {
  percent: number;
  tone?: 'money' | 'gold';
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="my-2.5 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-[width] duration-600 ease-out motion-reduce:transition-none ${
          tone === 'gold' ? 'bg-gold' : 'bg-money'
        }`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function ProgressMeta({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between font-kobo-mono text-[12px] text-text-dark-muted">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
