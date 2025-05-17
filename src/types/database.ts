export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          company_name: string | null
          wallet_address: string | null
          created_at: string
          updated_at: string
          current_amount: number | null
          current_amount_base_units: number | null
        }
        Insert: {
          id: string
          email: string
          company_name?: string | null
          wallet_address?: string | null
          created_at?: string
          updated_at?: string
          current_amount?: number | null
          current_amount_base_units?: number | null
        }
        Update: {
          id?: string
          email?: string
          company_name?: string | null
          wallet_address?: string | null
          created_at?: string
          updated_at?: string
          current_amount?: number | null
          current_amount_base_units?: number | null
        }
      }
    }
  }
} 