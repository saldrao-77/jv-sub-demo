import { seedDatabase } from "@/lib/seed-data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await seedDatabase()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, message: "Failed to seed database" }, { status: 500 })
  }
}
