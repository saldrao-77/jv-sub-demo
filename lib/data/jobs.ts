import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

export type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  customer?: Database["public"]["Tables"]["customers"]["Row"]
  vendors?: Database["public"]["Tables"]["vendors"]["Row"][]
}

export async function getJobs() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      customer:customer_id(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  // Fetch vendors for each job
  const jobsWithVendors = await Promise.all(
    data.map(async (job) => {
      const { data: jobVendors } = await supabase.from("job_vendors").select("vendor_id").eq("job_id", job.id)

      if (jobVendors && jobVendors.length > 0) {
        const vendorIds = jobVendors.map((jv) => jv.vendor_id)
        const { data: vendors } = await supabase.from("vendors").select("*").in("id", vendorIds)

        return { ...job, vendors: vendors || [] }
      }

      return { ...job, vendors: [] }
    }),
  )

  return jobsWithVendors
}

export async function getJobById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      customer:customer_id(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching job with id ${id}:`, error)
    return null
  }

  // Fetch vendors for the job
  const { data: jobVendors } = await supabase.from("job_vendors").select("vendor_id").eq("job_id", id)

  if (jobVendors && jobVendors.length > 0) {
    const vendorIds = jobVendors.map((jv) => jv.vendor_id)
    const { data: vendors } = await supabase.from("vendors").select("*").in("id", vendorIds)

    return { ...data, vendors: vendors || [] }
  }

  return { ...data, vendors: [] }
}

export async function createJob(jobData: {
  name: string
  address: string
  deposit_amount: number
  status: string
  start_date: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  vendors: string[]
}) {
  const supabase = createServerSupabaseClient()

  // First create the customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      name: jobData.customer.name,
      email: jobData.customer.email,
      phone: jobData.customer.phone,
      address: jobData.customer.address,
    })
    .select()
    .single()

  if (customerError) {
    console.error("Error creating customer:", customerError)
    return null
  }

  // Then create the job
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      name: jobData.name,
      address: jobData.address,
      deposit_amount: jobData.deposit_amount,
      spent_amount: 0,
      status: jobData.status,
      start_date: jobData.start_date,
      customer_id: customer.id,
    })
    .select()
    .single()

  if (jobError) {
    console.error("Error creating job:", jobError)
    return null
  }

  // Add vendors
  if (jobData.vendors.length > 0) {
    // First ensure all vendors exist
    for (const vendorName of jobData.vendors) {
      const { data: existingVendor } = await supabase.from("vendors").select("id").eq("name", vendorName).single()

      if (!existingVendor) {
        // Create vendor if it doesn't exist
        await supabase.from("vendors").insert({ name: vendorName })
      }
    }

    // Get all vendor IDs
    const { data: vendors } = await supabase.from("vendors").select("id, name").in("name", jobData.vendors)

    if (vendors && vendors.length > 0) {
      // Create job_vendors relationships
      const jobVendorsData = vendors.map((vendor) => ({
        job_id: job.id,
        vendor_id: vendor.id,
      }))

      await supabase.from("job_vendors").insert(jobVendorsData)
    }
  }

  return job
}

export async function updateJobStatus(id: string, status: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("jobs").update({ status }).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating job status for job ${id}:`, error)
    return null
  }

  return data
}

export async function updateJobSpentAmount(id: string, amount: number) {
  const supabase = createServerSupabaseClient()

  // Get current spent amount
  const { data: job } = await supabase.from("jobs").select("spent_amount").eq("id", id).single()

  if (!job) {
    console.error(`Job with id ${id} not found`)
    return null
  }

  const newSpentAmount = (job.spent_amount || 0) + amount

  const { data, error } = await supabase
    .from("jobs")
    .update({ spent_amount: newSpentAmount })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating job spent amount for job ${id}:`, error)
    return null
  }

  return data
}
