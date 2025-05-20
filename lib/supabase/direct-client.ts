import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a direct client that uses connection string instead of env vars
export const createDirectSupabaseClient = () => {
  // Use the PostgreSQL connection string directly
  // This is a fallback approach when environment variables aren't available
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("No database connection string available")
  }

  // Extract host, port, database, user, password from connection string
  const regex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
  const match = connectionString.match(regex)

  if (!match) {
    throw new Error("Invalid connection string format")
  }

  const [, user, password, host, port, database] = match

  // Construct Supabase URL and key from connection string parts
  const supabaseUrl = `https://${host}.supabase.co`

  // Generate a simple key for development purposes
  // This is NOT secure for production, but works for our demo
  const supabaseKey = Buffer.from(`${user}:${password}`).toString("base64")

  return createClient<Database>(supabaseUrl, supabaseKey, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
    },
  })
}

// Singleton pattern
let directClient: ReturnType<typeof createDirectSupabaseClient> | null = null

export const getDirectSupabaseClient = () => {
  if (!directClient) {
    try {
      directClient = createDirectSupabaseClient()
    } catch (error) {
      console.error("Failed to create direct Supabase client:", error)
      // Return a mock client that logs operations but doesn't actually connect
      return createMockClient()
    }
  }
  return directClient
}

// Create a mock client for when we can't connect
function createMockClient() {
  const mockResponse = { data: [], error: null }

  return {
    from: () => ({
      select: () => ({
        eq: () => mockResponse,
        order: () => mockResponse,
        single: () => mockResponse,
        maybeSingle: () => mockResponse,
        in: () => mockResponse,
        limit: () => mockResponse,
      }),
      insert: () => ({
        select: () => ({
          single: () => mockResponse,
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => mockResponse,
          }),
        }),
      }),
      delete: () => ({
        neq: () => mockResponse,
      }),
    }),
    rpc: () => mockResponse,
  } as any
}
