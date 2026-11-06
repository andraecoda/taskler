import { CheckCircle2, Clock } from 'lucide-react';
import { KoboButton } from './KoboButton';
import type { BankDetails } from '@/features/kobo/types';
import { formatNaira } from '@/lib/currency';

interface BankTransferCardProps {
  title: string;
  amount: number;
  bankDetails: BankDetails;
  /** pending_transfer: show the "I've made this transfer" action. awaiting_confirmation: show the waiting state. */
  awaitingConfirmation: boolean;
  onMarkPaid?: () => void;
  isMarkingPaid?: boolean;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-paper-line py-3 font-kobo-mono text-[13.5px] last:border-b-0">
      <span className="text-text-paper-muted">{label}</span>
      <span className="font-semibold text-text-paper">{value}</span>
    </div>
  );
}

export function BankTransferCard({
  title,
  amount,
  bankDetails,
  awaitingConfirmation,
  onMarkPaid,
  isMarkingPaid = false,
}: BankTransferCardProps) {
  return (
    <div className="rounded-kobo-lg bg-paper p-6 text-text-paper sm:p-[30px]">
      <div className="mb-1 font-kobo-mono text-[12px] uppercase tracking-[.08em] text-text-paper-muted">
        {title}
      </div>
      <div className="mb-5 font-display text-[32px] font-extrabold">{formatNaira(amount)}</div>

      <div className="mb-5 rounded-kobo-md border border-dashed border-paper-line px-4">
        <DetailRow label="Bank" value={bankDetails.bankName} />
        <DetailRow label="Account name" value={bankDetails.accountName} />
        <DetailRow label="Account number" value={bankDetails.accountNumber} />
      </div>

      {awaitingConfirmation ? (
        <div className="flex items-center gap-3 rounded-kobo-md bg-gold/[.16] px-4 py-3.5 text-[13.5px] text-text-paper">
          <Clock className="h-[18px] w-[18px] shrink-0 text-gold" aria-hidden />
          <span>
            <b>Awaiting admin confirmation.</b> We&apos;ll activate this as soon as your transfer is
            verified — usually within a few hours.
          </span>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[13.5px] text-text-paper-muted">
            Transfer the exact amount above, then let us know — an admin will verify it against the
            bank statement before this activates.
          </p>
          <KoboButton
            onClick={onMarkPaid}
            disabled={isMarkingPaid}
            variant="dark"
            className="w-full justify-center"
          >
            <CheckCircle2 className="h-[18px] w-[18px]" aria-hidden />
            {isMarkingPaid ? 'Saving…' : "I've made this transfer"}
          </KoboButton>
        </>
      )}
    </div>
  );
}
