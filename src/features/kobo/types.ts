import type { PackageTier, TaskTypeKey } from './constants';

export interface ApiPackage {
  id: string;
  tier: PackageTier;
  name: string;
  price: number;
  rates: Record<TaskTypeKey, number>;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export type PackageSubscriptionStatus =
  | 'pending_transfer'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'rejected';

export interface PackageSubscriptionRequest {
  id: string;
  userId: string;
  packageId: string;
  package?: ApiPackage;
  status: PackageSubscriptionStatus;
  userMarkedPaidAt: string | null;
  confirmedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface SubscribeResponse {
  request: PackageSubscriptionRequest;
  bankDetails: BankDetails;
}

export interface TaskPaymentIntent {
  taskId: string;
  amount: number;
  bankDetails: BankDetails;
}

export interface EarnerRates {
  currentPackage: ApiPackage;
  nextPackage: ApiPackage | null;
}

export interface AdvertiserRate {
  id: string;
  taskType: TaskTypeKey;
  unitCost: number;
}

export type TaskStatus = 'draft' | 'pending_payment' | 'live' | 'completed' | 'expired';
export type Platform = 'instagram' | 'youtube' | 'x' | 'facebook' | 'tiktok' | 'linkedin';

export interface Task {
  id: string;
  posterId: string;
  poster?: { fullName: string } | null;
  platform: Platform;
  taskType: TaskTypeKey;
  targetCount: number;
  completedCount: number;
  durationDays: number;
  url: string;
  status: TaskStatus;
  costPerAction: number;
  totalCost: number;
  paidAt: string | null;
  startedAt: string | null;
  userMarkedPaidAt: string | null;
}

export interface WalletSummary {
  balance: number;
  totalEarnings: number;
  minWithdrawalBalance: number;
  maxWithdrawable: number;
  maxItemSpend: number;
  eligibleForWithdrawal: boolean;
  nextPayoutDate: string;
}

export interface WeeklySummary {
  tasksCompleted: number;
  earned: number;
  referralEarned: number;
}

export type WalletTransactionType = 'earning' | 'withdrawal' | 'referral' | 'redemption';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  reference: string | null;
  createdAt: string;
}

export interface ReferralsOverview {
  referralCode: string;
  commissionRate: number;
  referralCount: number;
  successfulReferralThreshold: number;
  referredUsers: Array<{
    id: string;
    fullName: string;
    hasActivePackage: boolean;
    tasksCompleted: number;
    commissionEarned: number;
  }>;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string | null;
  /** Minimum package tier required to redeem — null means every subscribed tier can. */
  minPackageTier: PackageTier | null;
}
