'use client'

import { useSafeUserId } from '@/hooks/useSafeUserId'
import UserIdMissing from '@/components/UserIdMissing'
import QRPageClient from './QRPageClient'

export default function QRPage() {
  const userId = useSafeUserId()
  
  if (!userId) return <UserIdMissing />
  return <QRPageClient userId={userId} />
} 