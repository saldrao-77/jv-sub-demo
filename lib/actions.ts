"use server"

import { revalidatePath } from "next/cache"
import { getServerClient } from "./supabase"
import type { Job, Customer, Vendor, Transaction } from "./types"

const supabase = getServerClient()

// User actions
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

// Customer actions
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("name")

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data as Customer[]
}

export async function createCustomer(customer: Partial<Customer>) {
  const { data, error } = await supabase.from("customers").insert(customer).select().single()

  if (error) {
    console.error("Error creating customer:", error)
    return null
  }

  revalidatePath("/dashboard")
  revalidatePath("/jobs")

  return data as Customer
}

// Vendor actions
export async function getVendors() {
  const { data, error } = await supabase.from("vendors").select("*").order("name")

  if (error) {
    console.error("Error fetching vendors:", error)
    return []
  }

  return data as Vendor[]
}

export async function createVendor(vendor: Partial<Vendor>) {
  const { data, error } = await supabase.from("vendors").insert(vendor).select().single()

  if (error) {
    console.error("Error creating vendor:", error)
    return null
  }

  revalidatePath("/dashboard")
  revalidatePath("/jobs")

  return data as Vendor
}

// Job actions
export async function getJobs() {
  console.log("Fetching jobs...")
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      customer:customers(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  console.log("Jobs fetched:", data?.length || 0)
  return data as Job[]
}

export async function getJob(id: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      customer:customers(*),
      cards(*),
      transactions(*, vendor:vendors(*))
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching job ${id}:`, error)
    return null
  }

  // Get job vendors
  const { data: jobVendors, error: jobVendorsError } = await supabase
    .from("job_vendors")
    .select(`
      *,
      vendor:vendors(*)
    `)
    .eq("job_id", id)

  if (!jobVendorsError && jobVendors) {
    data.vendors = jobVendors.map((jv) => jv.vendor)
  }

  return data as Job
}

export async function createJob(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const name = formData.get("name") as string
  const customerId = formData.get("customer_id") as string
  const address = formData.get("address") as string
  const depositAmount = Number.parseFloat(formData.get("deposit_amount") as string)
  const startDate = formData.get("start_date") as string
  const description = formData.get("description") as string

  const job = {
    user_id: user.id,
    customer_id: customerId,
    name,
    address,
    deposit_amount: depositAmount,
    spent_amount: 0,
    status: "pending",
    start_date: startDate,
    description,
  }

  const { data, error } = await supabase.from("jobs").insert(job).select().single()

  if (error) {
    console.error("Error creating job:", error)
    return { error: error.message }
  }

  // Create a payment link for the job
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

  const paymentLink = {
    job_id: data.id,
    token,
    status: "active",
    expires_at: expiresAt.toISOString(),
  }

  await supabase.from("payment_links").insert(paymentLink)

  revalidatePath("/dashboard")
  revalidatePath("/jobs")

  return { job: data as Job }
}

// Transaction actions
export async function getTransactions() {
  console.log("Fetching transactions...")
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      job:jobs(*),
      vendor:vendors(*)
    `)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  console.log("Transactions fetched:", data?.length || 0)
  return data as Transaction[]
}

export async function createTransaction(transaction: Partial<Transaction>) {
  const { data, error } = await supabase.from("transactions").insert(transaction).select().single()

  if (error) {
    console.error("Error creating transaction:", error)
    return null
  }

  // Update job spent amount if it's an expense
  if (transaction.type === "expense" && transaction.job_id) {
    const { data: job } = await supabase.from("jobs").select("spent_amount").eq("id", transaction.job_id).single()

    if (job) {
      const newSpentAmount = (job.spent_amount || 0) + (transaction.amount || 0)

      await supabase.from("jobs").update({ spent_amount: newSpentAmount }).eq("id", transaction.job_id)
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  revalidatePath(`/jobs/${transaction.job_id}`)

  return data as Transaction
}

// Payment link actions
export async function getPaymentLink(token: string) {
  const { data, error } = await supabase
    .from("payment_links")
    .select(`
      *,
      job:jobs(*, customer:customers(*))
    `)
    .eq("token", token)
    .single()

  if (error) {
    console.error(`Error fetching payment link with token ${token}:`, error)
    return null
  }

  return data
}

export async function processPayment(formData: FormData) {
  const token = formData.get("token") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const jobId = formData.get("job_id") as string

  // Update payment link status
  await supabase.from("payment_links").update({ status: "used" }).eq("token", token)

  // Create a deposit transaction
  const transaction = {
    job_id: jobId,
    type: "deposit",
    amount,
    status: "completed",
    date: new Date().toISOString(),
    description: "Customer deposit",
  }

  const { data, error } = await supabase.from("transactions").insert(transaction).select().single()

  if (error) {
    console.error("Error creating deposit transaction:", error)
    return { error: error.message }
  }

  // Create a card for the job
  const card = {
    job_id: jobId,
    available_amount: amount,
    status: "active",
    issued_at: new Date().toISOString(),
  }

  await supabase.from("cards").insert(card)

  // Update job status to active
  await supabase.from("jobs").update({ status: "active" }).eq("id", jobId)

  revalidatePath("/dashboard")
  revalidatePath("/jobs")
  revalidatePath(`/jobs/${jobId}`)

  return { success: true, transaction: data }
}
