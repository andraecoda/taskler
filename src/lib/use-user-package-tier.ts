'use client';

import { useQuery } from '@tanstack/react-query';
import type { PackageTier } from '@/features/kobo/constants';
import type { ApiPackage } from '@/features/kobo/types';
import { useAuth } from '@/lib/auth-context';

/** The signed-in user's current package tier, or null if signed out or not yet subscribed. */
export function useUserPackageTier(): PackageTier | null {
  const { user, status, fetchWithAuth } = useAuth();

  const packagesQuery = useQuery({
    queryKey: ['packages'],
    queryFn: () => fetchWithAuth<ApiPackage[]>('/packages'),
    enabled: status === 'authenticated',
  });

  if (!user?.packageId) return null;
  return packagesQuery.data?.find((pkg) => pkg.id === user.packageId)?.tier ?? null;
}
