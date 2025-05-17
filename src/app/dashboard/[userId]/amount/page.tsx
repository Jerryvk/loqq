'use client'

import { useSafeUserId } from '@/hooks/useSafeUserId';
import AmountClient from './AmountClient';

export default function Page() {
  const userId = useSafeUserId();
  if (!userId) return <p className="text-white">Error: No user ID</p>;
  return <AmountClient userId={userId} />;
} 