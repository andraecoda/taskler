import type { LucideIcon } from 'lucide-react';

interface GoalCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function GoalCard({ icon: Icon, title, description, selected, onSelect }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-kobo-md border-[1.5px] p-5 text-left transition-all duration-150 hover:-translate-y-[3px] motion-reduce:hover:translate-y-0 ${
        selected ? 'border-money bg-money/[.08]' : 'border-white/10 bg-ink-2'
      }`}
    >
      <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-[9px] bg-money/[.14] text-money">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </div>
      <h4 className="mb-1.5 font-display text-[15.5px] font-semibold text-text-dark">{title}</h4>
      <p className="text-[13px] text-text-dark-muted">{description}</p>
    </button>
  );
}
