import type { Metadata } from 'next';
import { BonusCatalog } from '@/components/bonus/BonusCatalog';

export const metadata: Metadata = {
  title: 'Bonus store · CleekTap',
  description:
    'Redeem your CleekTap wallet balance for electronics, appliances, clothing, and subscriptions.',
};

export default function BonusPage() {
  return <BonusCatalog />;
}
