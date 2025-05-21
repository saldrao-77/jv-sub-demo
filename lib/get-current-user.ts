import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function getCurrentUser() {
  const supabase = createServerComponentClient({ cookies })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
