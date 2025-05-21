import { Suspense } from "react"
import { DashboardContent } from "./dashboard-content"
import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/get-current-user"
import { redirect } from "next/navigation"
import { getJobs, getTransactions } from "@/lib/api"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const [jobs, transactions] = await Promise.all([getJobs(user.id), getTransactions(user.id)])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <Suspense fallback={<div className="text-center p-8">Loading dashboard data...</div>}>
          <DashboardContent initialJobs={jobs} initialTransactions={transactions} userId={user.id} />
        </Suspense>
      </main>
    </div>
  )
}
