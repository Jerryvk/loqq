export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          company_name: string | null
          wallet_address: string | null
          created_at: string
          current_amount: number | null
        }
        Insert: {
          id: string
          email: string
          company_name?: string | null
          wallet_address?: string | null
          created_at?: string
          current_amount?: number | null
        }
        Update: {
          id?: string
          email?: string
          company_name?: string | null
          wallet_address?: string | null
          created_at?: string
          current_amount?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
} 