export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string
          job_id: string
          card_number: string | null
          expiry_date: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
          expires_at: string | null
          issued_at: string | null
          available_amount: number | null
        }
        Insert: {
          id?: string
          job_id: string
          card_number?: string | null
          expiry_date?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          expires_at?: string | null
          issued_at?: string | null
          available_amount?: number | null
        }
        Update: {
          id?: string
          job_id?: string
          card_number?: string | null
          expiry_date?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          expires_at?: string | null
          issued_at?: string | null
          available_amount?: number | null
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      job_vendors: {
        Row: {
          id: string
          job_id: string
          vendor_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          vendor_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          vendor_id?: string
          created_at?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          user_id: string | null
          customer_id: string | null
          name: string | null
          address: string | null
          deposit_amount: number | null
          spent_amount: number | null
          status: string | null
          start_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_id?: string | null
          name?: string | null
          address?: string | null
          deposit_amount?: number | null
          spent_amount?: number | null
          status?: string | null
          start_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          customer_id?: string | null
          name?: string | null
          address?: string | null
          deposit_amount?: number | null
          spent_amount?: number | null
          status?: string | null
          start_date?: string | null
          created_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          job_id: string
          type: string
          amount: number
          vendor: string | null
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          type: string
          amount: number
          vendor?: string | null
          status: string
          created_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          type?: string
          amount?: number
          vendor?: string | null
          status?: string
          created_at?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
        }
      }
    }
  }
}
