import { Suspense } from "react"
import { JobsList } from "./jobs-list"
import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/get-current-user"
import { redirect } from "next/navigation"
import { getJobs, getTransactionsByJobId } from "@/lib/api"

export default async function JobsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const jobs = await getJobs(user.id)

  // Fetch transactions for each job
  const jobTransactions = {}
  for (const job of jobs) {
    const transactions = await getTransactionsByJobId(job.id, user.id)
    jobTransactions[job.id] = transactions
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <Suspense fallback={<div className="text-center p-8">Loading jobs...</div>}>
          <JobsList initialJobs={jobs} initialJobTransactions={jobTransactions} userId={user.id} />
        </Suspense>
      </main>
    </div>
  )
}
