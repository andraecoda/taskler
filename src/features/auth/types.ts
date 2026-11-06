/**
 * Mirrors the backend's User/UserProfile/Role/Permission entities and TokenPair
 * interface (backend/src/modules/**\/entities, backend/src/modules/auth/interfaces).
 * passwordHash is never included — the backend never returns it.
 */

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DEACTIVATED';

export interface Permission {
  id: string;
  name: string;
  description: string | null;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permission[];
}

export interface UserProfile {
  id: string;
  userId: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export type EarningGoal = 'item_purchase' | 'funds_withdrawal' | 'gift_item';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  referralCode: string;
  referredByCode: string | null;
  status: UserStatus;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  lastLoginAt: string | null;
  packageId: string | null;
  walletBalance: number;
  totalEarnings: number;
  earningGoal: EarningGoal | null;
  /** The target product when earningGoal is item_purchase or gift_item — always null for funds_withdrawal. */
  earningGoalItemId: string | null;
  roles: Role[];
  profile: UserProfile | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * What the frontend ever holds client-side — the refresh token is deliberately excluded
 * here; it only ever lives in the httpOnly cookie set by the /api/auth/* route handlers.
 */
export interface ClientSession {
  user: User;
  accessToken: string;
  expiresIn: number;
}
