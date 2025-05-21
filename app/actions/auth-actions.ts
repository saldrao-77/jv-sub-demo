"use server"

import { createServiceClient } from "@/lib/supabase"

export async function createUserRecord(userId: string, email: string, businessName: string) {
  const supabase = createServiceClient()

  try {
    console.log("Creating user record:", { userId, email, businessName })

    const { data, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        business_name: businessName,
      })
      .select()

    console.log("User record creation result:", { data, error })

    return { success: !error, error }
  } catch (err) {
    console.error("Error creating user record:", err)
    return { success: false, error: err }
  }
}
