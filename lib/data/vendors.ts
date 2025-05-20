import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

export type Vendor = Database["public"]["Tables"]["vendors"]["Row"]

export async function getVendors() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("vendors").select("*").order("name")

  if (error) {
    console.error("Error fetching vendors:", error)
    return []
  }

  return data
}

export async function getVendorsByJobId(jobId: string) {
  const supabase = createServerSupabaseClient()

  const { data: jobVendors, error: jobVendorsError } = await supabase
    .from("job_vendors")
    .select("vendor_id")
    .eq("job_id", jobId)

  if (jobVendorsError) {
    console.error(`Error fetching job vendors for job ${jobId}:`, jobVendorsError)
    return []
  }

  if (!jobVendors || jobVendors.length === 0) {
    return []
  }

  const vendorIds = jobVendors.map((jv) => jv.vendor_id)

  const { data, error } = await supabase.from("vendors").select("*").in("id", vendorIds).order("name")

  if (error) {
    console.error(`Error fetching vendors for job ${jobId}:`, error)
    return []
  }

  return data
}

export async function createVendor(name: string) {
  const supabase = createServerSupabaseClient()

  // Check if vendor already exists
  const { data: existingVendor } = await supabase.from("vendors").select("id").eq("name", name).single()

  if (existingVendor) {
    return existingVendor
  }

  // Create new vendor
  const { data, error } = await supabase.from("vendors").insert({ name }).select().single()

  if (error) {
    console.error(`Error creating vendor ${name}:`, error)
    return null
  }

  return data
}
