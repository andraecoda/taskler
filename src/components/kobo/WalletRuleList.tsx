import { Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface Rule {
  title: string;
  description: ReactNode;
}

export function WalletRuleList({ rules }: { rules: Rule[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {rules.map((rule) => (
        <div key={rule.title} className="flex items-start gap-3 text-[14px] text-text-dark-muted">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
          <span>
            <b className="font-semibold text-text-dark">{rule.title}</b> — {rule.description}
          </span>
        </div>
      ))}
    </div>
  );
}
