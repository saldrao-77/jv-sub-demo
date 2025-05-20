import { fetchJobDetails } from "@/app/actions/jobs"
import JobDetailsClient from "./job-details-client"
import { notFound } from "next/navigation"
import EnvError from "@/app/env-error"

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  try {
    const jobDetails = await fetchJobDetails(params.id)

    if (!jobDetails) {
      notFound()
    }

    return <JobDetailsClient jobDetails={jobDetails} />
  } catch (error) {
    console.error("Job details error:", error)
    // If the error is related to missing environment variables, show the error page
    if (error instanceof Error && error.message.includes("Missing Supabase environment variables")) {
      return <EnvError />
    }
    // For other errors, rethrow to let Next.js error boundary handle it
    throw error
  }
}
