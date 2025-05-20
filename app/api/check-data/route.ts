import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if we have jobs in the database
    const { count, error } = await supabase.from("jobs").select("*", { count: "exact", head: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ hasData: count && count > 0 })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json({ hasData: false }, { status: 500 })
  }
}
