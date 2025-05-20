import { NextResponse } from "next/server"

export async function GET() {
  // Check if Supabase environment variables are set
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
    SUPABASE_URL: process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
  }

  return NextResponse.json({
    message: "Environment variable check",
    envVars,
    allEnvKeys: Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
  })
}
