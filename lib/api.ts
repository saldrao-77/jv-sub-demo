import { supabase } from "./supabase"

// Jobs
export async function getJobs(userId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_date", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  return data || []
}

export async function getJobById(jobId: string, userId: string) {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", jobId).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching job:", error)
    return null
  }

  return data
}

export async function createJob(jobData: any, userId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .insert([{ ...jobData, user_id: userId }])
    .select()

  if (error) {
    console.error("Error creating job:", error)
    return { error }
  }

  return { data }
}

// Cards
export async function getCards(userId: string) {
  const { data, error } = await supabase
    .from("cards")
    .select(`
      *,
      jobs:job_id (job_name, customer_name)
    `)
    .eq("user_id", userId)
    .order("issued_date", { ascending: false })

  if (error) {
    console.error("Error fetching cards:", error)
    return []
  }

  return data || []
}

export async function getCardById(cardId: string, userId: string) {
  const { data, error } = await supabase
    .from("cards")
    .select(`
      *,
      jobs:job_id (job_name, customer_name)
    `)
    .eq("id", cardId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching card:", error)
    return null
  }

  return data
}

export async function createCard(cardData: any, userId: string) {
  const { data, error } = await supabase
    .from("cards")
    .insert([{ ...cardData, user_id: userId }])
    .select()

  if (error) {
    console.error("Error creating card:", error)
    return { error }
  }

  return { data }
}

// Transactions
export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      jobs:job_id (job_name, customer_name),
      cards:card_id (card_number, vendor)
    `)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data || []
}

export async function getTransactionsByJobId(jobId: string, userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching job transactions:", error)
    return []
  }

  return data || []
}

export async function getTransactionsByCardId(cardId: string, userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("card_id", cardId)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching card transactions:", error)
    return []
  }

  return data || []
}

export async function createTransaction(transactionData: any, userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([{ ...transactionData, user_id: userId }])
    .select()

  if (error) {
    console.error("Error creating transaction:", error)
    return { error }
  }

  return { data }
}

// Receipts - We'll use transactions table with receipt-specific fields
export async function uploadReceipt(file: File, userId: string) {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `receipts/${fileName}`

  const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading receipt:", uploadError)
    return { error: uploadError }
  }

  // Get the public URL for the uploaded file
  const { data } = supabase.storage.from("receipts").getPublicUrl(filePath)

  return { url: data.publicUrl }
}

export async function createReceiptTransaction(
  receiptData: {
    jobId: string
    cardId: string
    date: string
    vendor: string
    amount: number
    description: string
    receiptUrl: string
  },
  userId: string,
) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id: userId,
        job_id: receiptData.jobId,
        card_id: receiptData.cardId,
        date: receiptData.date,
        type: "Receipt",
        vendor: receiptData.vendor,
        amount: receiptData.amount,
        status: "Receipt submitted",
        description: receiptData.description,
        receipt_url: receiptData.receiptUrl,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating receipt transaction:", error)
    return { error }
  }

  return { data }
}

// Add these new functions for the receipts table after the existing receipt functions

// Receipts - Using the dedicated receipts table
export async function getReceipts(userId: string) {
  const { data, error } = await supabase
    .from("receipts")
    .select(`
      *,
      jobs:job_id (job_name, customer_name),
      cards:card_id (card_number, vendor)
    `)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching receipts:", error)
    return []
  }

  return data || []
}

export async function getReceiptsByJobId(jobId: string, userId: string) {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching job receipts:", error)
    return []
  }

  return data || []
}

export async function getReceiptsByCardId(cardId: string, userId: string) {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("card_id", cardId)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching card receipts:", error)
    return []
  }

  return data || []
}

export async function createReceipt(
  receiptData: {
    jobId?: string
    cardId?: string
    date: string
    vendor: string
    amount: number
    description: string
    receiptUrl: string
  },
  userId: string,
) {
  const { data, error } = await supabase
    .from("receipts")
    .insert([
      {
        user_id: userId,
        job_id: receiptData.jobId,
        card_id: receiptData.cardId,
        date: receiptData.date,
        vendor: receiptData.vendor,
        amount: receiptData.amount,
        description: receiptData.description,
        receipt_url: receiptData.receiptUrl,
        status: "Submitted",
      },
    ])
    .select()

  if (error) {
    console.error("Error creating receipt:", error)
    return { error }
  }

  return { data }
}
