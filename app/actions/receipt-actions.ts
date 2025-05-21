"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Create a Supabase client with the service role key for server actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function uploadReceiptImage(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const file = formData.get("file") as File

    if (!userId || !file) {
      return { error: "Missing required fields" }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `receipts/${fileName}`

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading receipt:", uploadError)
      return { error: uploadError.message }
    }

    // Get the public URL for the uploaded file
    const { data } = supabase.storage.from("receipts").getPublicUrl(filePath)

    return { url: data.publicUrl }
  } catch (error: any) {
    console.error("Error in uploadReceiptImage action:", error)
    return { error: error.message || "An error occurred while uploading the receipt image" }
  }
}

export async function createReceiptEntry(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const jobId = formData.get("jobId") as string
    const cardId = formData.get("cardId") as string
    const date = formData.get("date") as string
    const vendor = formData.get("vendor") as string
    const amount = Number.parseFloat(formData.get("amount") as string) || 0
    const description = formData.get("description") as string
    const receiptUrl = formData.get("receiptUrl") as string

    // Validate required fields
    if (!userId || !date || !vendor || !receiptUrl) {
      return { error: "Missing required fields" }
    }

    // Insert the receipt into the database
    const { data, error } = await supabase
      .from("receipts")
      .insert({
        user_id: userId,
        job_id: jobId || null,
        card_id: cardId || null,
        date,
        vendor,
        amount,
        description,
        receipt_url: receiptUrl,
        status: "Submitted",
      })
      .select()

    if (error) {
      console.error("Error creating receipt:", error)
      return { error: error.message }
    }

    // Revalidate the receipts page to show the new receipt
    revalidatePath("/receipts")
    if (jobId) revalidatePath(`/jobs/${jobId}`)
    if (cardId) revalidatePath(`/cards/${cardId}`)

    return { data: data[0] }
  } catch (error: any) {
    console.error("Error in createReceiptEntry action:", error)
    return { error: error.message || "An error occurred while creating the receipt" }
  }
}

export async function createReceiptTransaction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const jobId = formData.get("jobId") as string
    const cardId = formData.get("cardId") as string
    const date = formData.get("date") as string
    const vendor = formData.get("vendor") as string
    const amount = Number.parseFloat(formData.get("amount") as string) || 0
    const description = formData.get("description") as string
    const receiptUrl = formData.get("receiptUrl") as string

    // Validate required fields
    if (!userId || !date || !vendor || !receiptUrl) {
      return { error: "Missing required fields" }
    }

    // Insert the transaction into the database
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        job_id: jobId || null,
        card_id: cardId || null,
        date,
        type: "Receipt",
        vendor,
        amount,
        status: "Receipt submitted",
        description,
        receipt_url: receiptUrl,
      })
      .select()

    if (error) {
      console.error("Error creating receipt transaction:", error)
      return { error: error.message }
    }

    // Revalidate the transactions page to show the new transaction
    revalidatePath("/transactions")
    if (jobId) revalidatePath(`/jobs/${jobId}`)
    if (cardId) revalidatePath(`/cards/${cardId}`)

    return { data: data[0] }
  } catch (error: any) {
    console.error("Error in createReceiptTransaction action:", error)
    return { error: error.message || "An error occurred while creating the receipt transaction" }
  }
}
