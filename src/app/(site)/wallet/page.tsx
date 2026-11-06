import type { Metadata } from 'next';
import { WalletPreviewSection } from '@/components/landing/WalletPreviewSection';

export const metadata: Metadata = {
  title: 'Wallet · CleekTap',
  description: 'Every task, itemized. Every kobo, tracked — see how your wallet works.',
};

export default function WalletInfoPage() {
  return <WalletPreviewSection />;
}
