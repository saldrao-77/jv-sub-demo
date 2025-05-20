import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for server components
export const createServerSupabaseClient = () => {
  try {
    // Use the environment variables that are already available in your project
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Missing Supabase environment variables, using mock client")
      return createMockClient()
    }

    return createClient<Database>(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// Create a mock client for development/testing
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
