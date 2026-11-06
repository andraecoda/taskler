import { Gift, ShoppingBag, Wallet, type LucideIcon } from 'lucide-react';

export const GOAL_OPTIONS: Array<{
  key: 'funds_withdrawal' | 'item_purchase' | 'gift_item';
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    key: 'funds_withdrawal',
    icon: Wallet,
    title: 'Funds withdrawal',
    description: "Request a payout to your bank account once you're eligible.",
  },
  {
    key: 'item_purchase',
    icon: ShoppingBag,
    title: 'Item purchase',
    description: 'Redeem your balance for a gadget, voucher, or airtime bundle.',
  },
  {
    key: 'gift_item',
    icon: Gift,
    title: 'Gift an item',
    description: 'Send a reward to a friend or family member from your wallet.',
  },
];
