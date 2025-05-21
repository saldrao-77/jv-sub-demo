"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Create a Supabase client with the service role key for server actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function createJob(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const customerName = formData.get("customerName") as string
    const jobName = formData.get("jobName") as string
    const customerEmail = formData.get("customerEmail") as string
    const customerPhone = formData.get("customerPhone") as string
    const propertyAddress = formData.get("propertyAddress") as string
    const createdDate = formData.get("createdDate") as string
    const depositAmount = Number.parseFloat(formData.get("depositAmount") as string)
    const notes = formData.get("notes") as string
    const status = (formData.get("status") as string) || "Deposit request sent"

    // Validate required fields
    if (!userId || !customerName || !jobName) {
      return { error: "Missing required fields" }
    }

    // Insert the job into the database
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        user_id: userId,
        customer_name: customerName,
        job_name: jobName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        property_address: propertyAddress,
        created_date: createdDate,
        deposit_amount: depositAmount,
        notes: notes,
        status: status,
      })
      .select()

    if (error) {
      console.error("Error creating job:", error)
      return { error: error.message }
    }

    // Revalidate the jobs page to show the new job
    revalidatePath("/jobs")
    revalidatePath("/dashboard")

    return { data: data[0] }
  } catch (error: any) {
    console.error("Error in createJob action:", error)
    return { error: error.message || "An error occurred while creating the job" }
  }
}

export async function createCard(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const jobId = formData.get("jobId") as string
    const vendor = formData.get("vendor") as string
    const cardNumber = formData.get("cardNumber") as string
    const expiryDate = formData.get("expiryDate") as string
    const cvv = formData.get("cvv") as string
    const billingZip = formData.get("billingZip") as string
    const issuedDate = formData.get("issuedDate") as string
    const initialAmount = Number.parseFloat(formData.get("initialAmount") as string)
    const remainingAmount = Number.parseFloat(formData.get("remainingAmount") as string) || initialAmount
    const status = (formData.get("status") as string) || "active"
    const issuedTo = formData.get("issuedTo") as string
    const role = formData.get("role") as string

    // Validate required fields
    if (!userId || !jobId || !vendor || !initialAmount || !issuedTo) {
      return { error: "Missing required fields" }
    }

    // Insert the card into the database
    const { data, error } = await supabase
      .from("cards")
      .insert({
        user_id: userId,
        job_id: jobId,
        vendor,
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv,
        billing_zip: billingZip,
        issued_date: issuedDate,
        initial_amount: initialAmount,
        remaining_amount: remainingAmount,
        status,
        issued_to: issuedTo,
        role,
      })
      .select()

    if (error) {
      console.error("Error creating card:", error)
      return { error: error.message }
    }

    // Also create a transaction for the card issuance
    const { error: transactionError } = await supabase.from("transactions").insert({
      user_id: userId,
      job_id: jobId,
      card_id: data[0].id,
      date: issuedDate,
      type: "Card Issued",
      vendor,
      amount: initialAmount,
      status: "Card issued",
      description: `Card issued to ${issuedTo} for ${role}`,
    })

    if (transactionError) {
      console.error("Error creating card issuance transaction:", transactionError)
      // We don't return an error here since the card was created successfully
    }

    // Revalidate the cards page to show the new card
    revalidatePath("/cards")
    revalidatePath(`/jobs/${jobId}`)

    return { data: data[0] }
  } catch (error: any) {
    console.error("Error in createCard action:", error)
    return { error: error.message || "An error occurred while creating the card" }
  }
}

export async function createTransaction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const jobId = formData.get("jobId") as string
    const cardId = formData.get("cardId") as string
    const date = formData.get("date") as string
    const type = formData.get("type") as string
    const vendor = formData.get("vendor") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const status = formData.get("status") as string
    const description = formData.get("description") as string

    // Validate required fields
    if (!userId || !date || !type || isNaN(amount)) {
      return { error: "Missing required fields" }
    }

    // Insert the transaction into the database
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        job_id: jobId,
        card_id: cardId,
        date,
        type,
        vendor,
        amount,
        status,
        description,
      })
      .select()

    if (error) {
      console.error("Error creating transaction:", error)
      return { error: error.message }
    }

    // If this is a purchase transaction, update the card's remaining amount
    if (type === "Purchase" && cardId) {
      // Get the current card
      const { data: cardData, error: cardError } = await supabase
        .from("cards")
        .select("remaining_amount")
        .eq("id", cardId)
        .single()

      if (!cardError && cardData) {
        // Update the remaining amount
        const newRemainingAmount = cardData.remaining_amount + amount // amount is negative for purchases

        const { error: updateError } = await supabase
          .from("cards")
          .update({ remaining_amount: newRemainingAmount })
          .eq("id", cardId)

        if (updateError) {
          console.error("Error updating card remaining amount:", updateError)
        }
      }
    }

    // Revalidate the transactions page to show the new transaction
    revalidatePath("/transactions")
    if (jobId) revalidatePath(`/jobs/${jobId}`)
    if (cardId) revalidatePath(`/cards/${cardId}`)

    return { data: data[0] }
  } catch (error: any) {
    console.error("Error in createTransaction action:", error)
    return { error: error.message || "An error occurred while creating the transaction" }
  }
}
