import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export const createServerSupabase = () =>
  createServerComponentClient<Database>({ cookies }) 