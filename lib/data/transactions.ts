import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  job?: {
    name: string | null
    customer?: {
      name: string | null
    } | null
  } | null
}

export async function getTransactions() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      job:job_id(
        name,
        customer:customer_id(name)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data
}

export async function getTransactionsByJobId(jobId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("job_id", jobId)
    .order("transaction_date", { ascending: false })

  if (error) {
    console.error(`Error fetching transactions for job ${jobId}:`, error)
    return []
  }

  return data
}

export async function createTransaction(transactionData: {
  job_id: string
  type: string
  amount: number
  vendor?: string
  status: string
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...transactionData,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating transaction:", error)
    return null
  }

  // If it's a purchase transaction, update the job's spent amount
  if (transactionData.type === "Purchase") {
    await updateJobSpentAmount(transactionData.job_id, transactionData.amount)
  }

  return data
}

// Helper function to update job spent amount
async function updateJobSpentAmount(jobId: string, amount: number) {
  const supabase = createServerSupabaseClient()

  // Get current spent amount
  const { data: job } = await supabase.from("jobs").select("spent_amount").eq("id", jobId).single()

  if (!job) return

  const newSpentAmount = (job.spent_amount || 0) + Math.abs(amount)

  await supabase.from("jobs").update({ spent_amount: newSpentAmount }).eq("id", jobId)
}
