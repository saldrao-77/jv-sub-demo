import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for client components
let client: ReturnType<typeof createBrowserSupabaseClient> | null = null

export const createBrowserSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Missing Supabase environment variables for browser client")
      return createMockClient()
    }

    return createClient<Database>(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error("Error creating browser Supabase client:", error)
    return createMockClient()
  }
}

// Singleton pattern to avoid multiple instances
export const getBrowserSupabaseClient = () => {
  if (!client) {
    client = createBrowserSupabaseClient()
  }
  return client
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
    auth: {
      signIn: () => Promise.resolve(mockResponse),
      signOut: () => Promise.resolve(mockResponse),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as any
}
