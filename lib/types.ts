export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  full_name?: string
  company_name?: string
  phone?: string
}

export interface Customer {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  customer_id: string
  name: string
  address?: string
  deposit_amount: number
  spent_amount: number
  status: "pending" | "active" | "completed" | "cancelled"
  start_date: string
  description?: string
  created_at: string
  updated_at: string
  customer?: Customer
  vendors?: Vendor[]
  cards?: Card[]
  transactions?: Transaction[]
}

export interface JobVendor {
  id: string
  job_id: string
  vendor_id: string
  created_at: string
}

export interface Card {
  id: string
  job_id: string
  card_number?: string
  expiry_date?: string
  available_amount: number
  status: "active" | "inactive" | "expired"
  issued_at: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  job_id: string
  type: "deposit" | "expense" | "refund"
  amount: number
  vendor_id?: string
  status: "pending" | "completed" | "failed"
  date: string
  description?: string
  created_at: string
  vendor?: Vendor
  receipt?: Receipt
}

export interface PaymentLink {
  id: string
  job_id: string
  token: string
  status: "active" | "used" | "expired"
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  transaction_id: string
  image_url?: string
  notes?: string
  created_at: string
  updated_at: string
}
