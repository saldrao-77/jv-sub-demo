import { fetchJobDetails } from "@/app/actions/jobs"
import JobDetailsClient from "./job-details-client"
import { notFound } from "next/navigation"

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const jobDetails = await fetchJobDetails(params.id)

  if (!jobDetails) {
    notFound()
  }

  return <JobDetailsClient jobDetails={jobDetails} />
}
