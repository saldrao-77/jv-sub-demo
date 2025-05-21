import { createClient } from "@supabase/supabase-js"

// This script should be run once to set up the storage bucket
async function setupStorage() {
  // Create a Supabase client with admin privileges
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  )

  try {
    // Create a new bucket for receipts
    const { data: bucket, error } = await supabaseAdmin.storage.createBucket("receipts", {
      public: false, // Not publicly accessible by default
      fileSizeLimit: 5242880, // 5MB limit
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    })

    if (error) {
      throw error
    }

    // Set bucket policy to allow authenticated users to upload
    const { error: policyError } = await supabaseAdmin.storage
      .from("receipts")
      .createPolicy("authenticated can upload", {
        name: "authenticated can upload",
        definition: {
          role: "authenticated",
          operation: "INSERT",
        },
      })

    if (policyError) {
      throw policyError
    }

    // Set bucket policy to allow users to read their own uploads
    const { error: readPolicyError } = await supabaseAdmin.storage
      .from("receipts")
      .createPolicy("users can read own uploads", {
        name: "users can read own uploads",
        definition: {
          role: "authenticated",
          operation: "SELECT",
          owner: "auth.uid()",
        },
      })

    if (readPolicyError) {
      throw readPolicyError
    }

    console.log('Storage bucket "receipts" created successfully with appropriate policies')
  } catch (error) {
    console.error("Error setting up storage:", error)
  }
}

// Run the setup function
setupStorage()
