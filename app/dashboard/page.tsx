import { fetchJobs } from "@/app/actions/jobs"
import { fetchTransactions } from "@/app/actions/transactions"
import DashboardClient from "./dashboard-client"
import { SeedDatabase } from "@/components/seed-database"

export default async function Dashboard() {
  try {
    // Fetch data from Supabase
    const jobs = await fetchJobs()
    const transactions = await fetchTransactions()

    // If there's no data, show the seed database component
    if (jobs.length === 0) {
      return (
        <div className="flex min-h-screen flex-col">
          <div className="container py-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Welcome to JobVault</h1>
            <SeedDatabase />
          </div>
        </div>
      )
    }

    // Calculate stats
    const totalDeposits = transactions.filter((t) => t.type === "Deposit").reduce((sum, t) => sum + (t.amount || 0), 0)

    const totalPurchases = Math.abs(
      transactions.filter((t) => t.type === "Purchase").reduce((sum, t) => sum + (t.amount || 0), 0),
    )

    const availableFunds = totalDeposits - totalPurchases

    const stats = {
      totalDeposits,
      totalPurchases,
      availableFunds,
      depositCount: transactions.filter((t) => t.type === "Deposit").length,
      purchaseCount: transactions.filter((t) => t.type === "Purchase").length,
      cardCount: transactions.filter((t) => t.type === "Card Issued").length,
    }

    // Pass data to client component
    return <DashboardClient jobs={jobs} transactions={transactions} stats={stats} />
  } catch (error) {
    console.error("Dashboard error:", error)

    // Return a simplified dashboard with mock data if there's an error
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container py-10 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">JobVault - Development Mode</h1>
          <p className="mb-6 text-muted-foreground">
            Running in development mode with mock data. Some features may be limited.
          </p>
          <SeedDatabase />
        </div>
      </div>
    )
  }
}
