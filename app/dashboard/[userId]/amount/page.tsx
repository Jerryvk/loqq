'use client'

import { useSafeUserId } from '@/hooks/useSafeUserId'
import UserIdMissing from '@/components/UserIdMissing'
import AmountPageClient from './AmountPageClient'

export default function AmountPage() {
  const userId = useSafeUserId()
  
  if (!userId) return <UserIdMissing />
  return <AmountPageClient userId={userId} />
} 