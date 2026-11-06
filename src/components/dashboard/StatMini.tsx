export function StatMini({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-kobo-md border border-white/[.09] bg-ink-2 p-[18px]">
      <div className="font-kobo-mono text-[11px] uppercase tracking-[.06em] text-text-dark-muted">{label}</div>
      <div className="mt-1.5 font-display text-[22px] font-bold text-text-dark">
        {value}
        {suffix && <span className="ml-1 text-[13px] font-normal text-text-dark-muted">{suffix}</span>}
      </div>
    </div>
  );
}
