'use client'

import { useSafeUserId } from '@/hooks/useSafeUserId';
import QRClient from './QRClient';

export default function Page() {
  const userId = useSafeUserId();
  if (!userId) return <p className="text-white">Error: No user ID</p>;
  return <QRClient userId={userId} />;
} 