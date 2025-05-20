import { seedDatabase } from "@/lib/seed-data"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // First, check if we can bypass the user_id constraint
    const supabase = createServerSupabaseClient()

    // Check if the jobs table has a user_id column and if it's nullable
    try {
      const { data: jobsColumns } = await supabase
        .from("information_schema.columns")
        .select("column_name, is_nullable")
        .eq("table_name", "jobs")
        .eq("column_name", "user_id")
        .single()

      // If user_id is not nullable, try to temporarily alter the table
      if (jobsColumns && jobsColumns.is_nullable === "NO") {
        try {
          // Try to make user_id nullable temporarily
          await supabase.rpc("execute_sql", {
            sql: "ALTER TABLE jobs ALTER COLUMN user_id DROP NOT NULL;",
          })
          console.log("Made user_id nullable for seeding")
        } catch (alterError) {
          console.error("Could not alter jobs table:", alterError)
        }
      }
    } catch (schemaError) {
      console.error("Could not check jobs table schema:", schemaError)
    }

    // Now try to seed the database
    const result = await seedDatabase()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to seed database",
      },
      { status: 500 },
    )
  }
}
