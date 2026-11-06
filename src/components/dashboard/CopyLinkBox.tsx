'use client';

import { useState } from 'react';

export function CopyLinkBox({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (permissions, insecure context) — fail silently,
      // the link is still selectable as plain text.
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-kobo-sm border border-dashed border-white/20 bg-ink-3 px-4 py-3.5 font-kobo-mono text-[13px] text-text-dark-muted">
      <span>{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full bg-ink px-[18px] py-2.5 font-kobo text-[13.5px] font-semibold text-paper transition-opacity hover:opacity-90"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
