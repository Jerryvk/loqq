'use client'

import { useParams } from 'next/navigation'

export function useSafeUserId(): string | null {
  const params = useParams()
  
  // Check if userId exists and is a string (not an array)
  if (!params?.userId || Array.isArray(params.userId)) {
    return null
  }

  return params.userId
} 