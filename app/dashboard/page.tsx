import { fetchJobs } from "@/app/actions/jobs"
import { fetchTransactions } from "@/app/actions/transactions"
import DashboardClient from "./dashboard-client"

export default async function Dashboard() {
  // Fetch data from Supabase
  const jobs = await fetchJobs()
  const transactions = await fetchTransactions()

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
}
