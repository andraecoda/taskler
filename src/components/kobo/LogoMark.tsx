export function LogoMark({ className = 'h-[30px] w-[30px]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="1" y="1" width="28" height="28" rx="6" fill="#4FA875" />
      <circle cx="7" cy="7.5" r="1.3" fill="#1C1811" />
      <circle cx="7" cy="15" r="1.3" fill="#1C1811" />
      <circle cx="7" cy="22.5" r="1.3" fill="#1C1811" />
      <path
        d="M13 8L21 15L13 22"
        stroke="#1C1811"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KoboLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-display text-[19px] font-bold ${className}`}>
      <LogoMark />
      CleekTap
    </div>
  );
}
