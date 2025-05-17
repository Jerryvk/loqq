'use client'

import { useSafeUserId } from '@/hooks/useSafeUserId';
import DashboardClient from './DashboardClient';

export default function Page() {
  const userId = useSafeUserId();
  if (!userId) return <p className="text-white">Error: No user ID</p>;
  return <DashboardClient userId={userId} />;
} 