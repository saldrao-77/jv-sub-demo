"use server"

import { getServerClient } from "./supabase"

const supabase = getServerClient()

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Check if data already exists
    const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

    if (userCount && userCount > 0) {
      console.log("Database already has data, skipping seed")
      return { success: true, message: "Database already has data" }
    }

    // Create a test user
    const testUser = {
      id: "test-user-id", // In a real app, this would be a UUID
      email: "test@example.com",
      full_name: "Test User",
      company_name: "Test Company",
      phone: "555-123-4567",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error: userError } = await supabase.from("users").insert(testUser)
    if (userError) throw userError

    // Create customers
    const customers = [
      {
        user_id: testUser.id,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "555-987-6543",
        address: "123 Oak St, San Francisco, CA",
      },
      {
        user_id: testUser.id,
        name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "555-456-7890",
        address: "456 Pine St, San Francisco, CA",
      },
      {
        user_id: testUser.id,
        name: "Emily Rodriguez",
        email: "emily.rodriguez@example.com",
        phone: "555-789-0123",
        address: "789 Maple St, San Francisco, CA",
      },
    ]

    const { error: customersError } = await supabase.from("customers").insert(customers)
    if (customersError) throw customersError

    // Get the inserted customers to use their IDs
    const { data: insertedCustomers, error: fetchCustomersError } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", testUser.id)

    if (fetchCustomersError) throw fetchCustomersError

    // Create vendors
    const vendors = [{ name: "Home Depot" }, { name: "Lowe's" }, { name: "Ace Hardware" }, { name: "Menards" }]

    const { error: vendorsError } = await supabase.from("vendors").insert(vendors)
    if (vendorsError) throw vendorsError

    // Get the inserted vendors to use their IDs
    const { data: insertedVendors, error: fetchVendorsError } = await supabase.from("vendors").select("*")
    if (fetchVendorsError) throw fetchVendorsError

    // Create jobs
    const jobs = [
      {
        user_id: testUser.id,
        customer_id: insertedCustomers[0].id,
        name: "Bathroom Renovation",
        address: "123 Oak St, San Francisco, CA",
        deposit_amount: 2500,
        spent_amount: 1200,
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
        description: "Complete renovation of master bathroom including new fixtures, tile, and vanity.",
      },
      {
        user_id: testUser.id,
        customer_id: insertedCustomers[1].id,
        name: "Kitchen Remodel",
        address: "456 Pine St, San Francisco, CA",
        deposit_amount: 5000,
        spent_amount: 0,
        status: "pending",
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Kitchen remodel with new cabinets, countertops, and appliances.",
      },
      {
        user_id: testUser.id,
        customer_id: insertedCustomers[2].id,
        name: "Deck Construction",
        address: "789 Maple St, San Francisco, CA",
        deposit_amount: 3000,
        spent_amount: 3000,
        status: "completed",
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Construction of a new outdoor deck with composite decking and railing.",
      },
    ]

    const { data: insertedJobs, error: jobsError } = await supabase.from("jobs").insert(jobs).select()
    if (jobsError) throw jobsError

    // Create job vendors (many-to-many relationship)
    const jobVendors = [
      { job_id: insertedJobs[0].id, vendor_id: insertedVendors[0].id },
      { job_id: insertedJobs[0].id, vendor_id: insertedVendors[1].id },
      { job_id: insertedJobs[1].id, vendor_id: insertedVendors[0].id },
      { job_id: insertedJobs[1].id, vendor_id: insertedVendors[2].id },
      { job_id: insertedJobs[2].id, vendor_id: insertedVendors[1].id },
      { job_id: insertedJobs[2].id, vendor_id: insertedVendors[3].id },
    ]

    const { error: jobVendorsError } = await supabase.from("job_vendors").insert(jobVendors)
    if (jobVendorsError) throw jobVendorsError

    // Create cards
    const cards = [
      {
        job_id: insertedJobs[0].id,
        card_number: "4111111111111111",
        expiry_date: "12/25",
        available_amount: 1300,
        status: "active",
        issued_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        job_id: insertedJobs[2].id,
        card_number: "5555555555554444",
        expiry_date: "10/24",
        available_amount: 0,
        status: "expired",
        issued_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const { error: cardsError } = await supabase.from("cards").insert(cards)
    if (cardsError) throw cardsError

    // Create transactions
    const transactions = [
      {
        job_id: insertedJobs[0].id,
        type: "deposit",
        amount: 2500,
        status: "completed",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Initial deposit for bathroom renovation",
      },
      {
        job_id: insertedJobs[0].id,
        type: "expense",
        amount: 800,
        vendor_id: insertedVendors[0].id,
        status: "completed",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Bathroom fixtures and plumbing supplies",
      },
      {
        job_id: insertedJobs[0].id,
        type: "expense",
        amount: 400,
        vendor_id: insertedVendors[1].id,
        status: "completed",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Tile and grout for bathroom",
      },
      {
        job_id: insertedJobs[2].id,
        type: "deposit",
        amount: 3000,
        status: "completed",
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Initial deposit for deck construction",
      },
      {
        job_id: insertedJobs[2].id,
        type: "expense",
        amount: 1800,
        vendor_id: insertedVendors[1].id,
        status: "completed",
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Composite decking materials",
      },
      {
        job_id: insertedJobs[2].id,
        type: "expense",
        amount: 1200,
        vendor_id: insertedVendors[3].id,
        status: "completed",
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Railing and hardware for deck",
      },
    ]

    const { error: transactionsError } = await supabase.from("transactions").insert(transactions)
    if (transactionsError) throw transactionsError

    // Create payment links
    const paymentLinks = [
      {
        job_id: insertedJobs[1].id,
        token: "payment-link-token-1",
        status: "active",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const { error: paymentLinksError } = await supabase.from("payment_links").insert(paymentLinks)
    if (paymentLinksError) throw paymentLinksError

    console.log("Database seeding completed successfully")
    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Error seeding database", error }
  }
}
