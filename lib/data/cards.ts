import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

export type Card = Database["public"]["Tables"]["cards"]["Row"]

export async function getCards() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("cards")
    .select(`
      *,
      job:job_id(
        name,
        customer:customer_id(name)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cards:", error)
    return []
  }

  return data
}

export async function getCardsByJobId(jobId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching cards for job ${jobId}:`, error)
    return []
  }

  return data
}

export async function createCard(cardData: {
  job_id: string
  card_number?: string
  expiry_date?: string
  status: string
  available_amount: number
  expires_at?: string
}) {
  const supabase = createServerSupabaseClient()

  // Set default expiration date to 30 days from now if not provided
  const expiresAt = cardData.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("cards")
    .insert({
      ...cardData,
      issued_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating card:", error)
    return null
  }

  return data
}

export async function updateCardStatus(id: string, status: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("cards").update({ status }).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating card status for card ${id}:`, error)
    return null
  }

  return data
}

export async function updateCardAmount(id: string, amount: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("cards")
    .update({ available_amount: amount })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating card amount for card ${id}:`, error)
    return null
  }

  return data
}
