"use server"

import { createServerSupabaseClient } from "./supabase/server"
import { createJob } from "./data/jobs"
import { createTransaction } from "./data/transactions"
import { createCard } from "./data/cards"

export async function seedDatabase() {
  const supabase = createServerSupabaseClient()

  // Clear existing data
  await supabase.from("job_vendors").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("cards").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("customers").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("vendors").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  // Create vendors
  const vendors = ["Home Depot", "Lowe's", "Ace Hardware", "Menards"]

  const vendorIds = {}

  for (const vendor of vendors) {
    const { data } = await supabase.from("vendors").insert({ name: vendor }).select().single()

    if (data) {
      vendorIds[vendor] = data.id
    }
  }

  // Create jobs with customers, transactions, and cards
  const jobsData = [
    {
      name: "Bathroom Renovation",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "(555) 123-4567",
        address: "123 Oak St, San Francisco, CA",
      },
      address: "123 Oak St, San Francisco, CA",
      deposit_amount: 850,
      spent_amount: 0,
      status: "Deposit paid",
      start_date: "2025-05-15",
      vendors: ["Home Depot"],
      transactions: [
        {
          type: "Deposit",
          amount: 850,
          status: "Deposit paid",
          created_at: "2025-05-18T10:24:00Z",
        },
      ],
    },
    {
      name: "Kitchen Remodel",
      customer: {
        name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "(555) 234-5678",
        address: "456 Pine Ave, Oakland, CA",
      },
      address: "456 Pine Ave, Oakland, CA",
      deposit_amount: 1200,
      spent_amount: 750,
      status: "Materials purchased",
      start_date: "2025-05-10",
      vendors: ["Lowe's", "Home Depot"],
      transactions: [
        {
          type: "Deposit",
          amount: 1200,
          status: "Deposit paid",
          created_at: "2025-05-12T09:30:00Z",
        },
        {
          type: "Card Issued",
          amount: 1200,
          vendor: "Lowe's, Home Depot",
          status: "Card issued",
          created_at: "2025-05-13T14:15:00Z",
        },
        {
          type: "Purchase",
          amount: -750,
          vendor: "Lowe's",
          status: "Materials purchased",
          created_at: "2025-05-15T11:45:00Z",
        },
      ],
      card: {
        card_number: "•••• •••• •••• 5678",
        expiry_date: "05/25",
        status: "Active",
        available_amount: 450,
        issued_at: "2025-05-13T14:15:00Z",
        expires_at: "2025-06-13T14:15:00Z",
      },
    },
    {
      name: "Deck Construction",
      customer: {
        name: "Robert Garcia",
        email: "robert.garcia@example.com",
        phone: "(555) 345-6789",
        address: "789 Maple Dr, San Jose, CA",
      },
      address: "789 Maple Dr, San Jose, CA",
      deposit_amount: 750,
      spent_amount: 0,
      status: "Card issued",
      start_date: "2025-05-16",
      vendors: ["Home Depot", "Ace Hardware"],
      transactions: [
        {
          type: "Deposit",
          amount: 750,
          status: "Deposit paid",
          created_at: "2025-05-17T16:20:00Z",
        },
        {
          type: "Card Issued",
          amount: 750,
          vendor: "Home Depot, Ace Hardware",
          status: "Card issued",
          created_at: "2025-05-19T10:30:00Z",
        },
      ],
      card: {
        card_number: "•••• •••• •••• 9012",
        expiry_date: "05/25",
        status: "Active",
        available_amount: 750,
        issued_at: "2025-05-19T10:30:00Z",
        expires_at: "2025-06-19T10:30:00Z",
      },
    },
    {
      name: "Basement Finishing",
      customer: {
        name: "Jennifer Lee",
        email: "jennifer.lee@example.com",
        phone: "(555) 456-7890",
        address: "321 Cedar Ln, Berkeley, CA",
      },
      address: "321 Cedar Ln, Berkeley, CA",
      deposit_amount: 1500,
      spent_amount: 0,
      status: "Deposit request sent",
      start_date: "2025-05-19",
      vendors: ["Home Depot", "Menards"],
      transactions: [
        {
          type: "Request",
          amount: 1500,
          status: "Deposit request sent",
          created_at: "2025-05-19T08:45:00Z",
        },
      ],
    },
  ]

  for (const jobData of jobsData) {
    // Create job with customer
    const job = await createJob({
      name: jobData.name,
      address: jobData.address,
      deposit_amount: jobData.deposit_amount,
      status: jobData.status,
      start_date: jobData.start_date,
      customer: jobData.customer,
      vendors: jobData.vendors,
    })

    if (!job) continue

    // Create transactions
    for (const txData of jobData.transactions) {
      await createTransaction({
        job_id: job.id,
        type: txData.type,
        amount: txData.amount,
        vendor: txData.vendor,
        status: txData.status,
        created_at: txData.created_at,
      })
    }

    // Create card if applicable
    if (jobData.card) {
      await createCard({
        job_id: job.id,
        card_number: jobData.card.card_number,
        expiry_date: jobData.card.expiry_date,
        status: jobData.card.status,
        available_amount: jobData.card.available_amount,
        expires_at: jobData.card.expires_at,
      })
    }

    // Update job spent amount
    if (jobData.spent_amount > 0) {
      await supabase.from("jobs").update({ spent_amount: jobData.spent_amount }).eq("id", job.id)
    }
  }

  return { success: true, message: "Database seeded successfully" }
}
