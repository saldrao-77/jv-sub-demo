import { Suspense } from "react"
import { getJobs, getTransactions } from "@/lib/actions"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"

export default async function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your materials deposits and track your jobs</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/jobs/new" className="flex items-center">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <DashboardStats />
        </Suspense>

        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <RecentJobs />
          </Suspense>
        </div>

        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <RecentTransactions />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

async function DashboardStats() {
  try {
    const jobs = await getJobs()
    console.log("Dashboard stats jobs:", jobs?.length || 0)

    const totalDeposits = jobs.reduce((sum, job) => sum + job.deposit_amount, 0)
    const totalSpent = jobs.reduce((sum, job) => sum + job.spent_amount, 0)
    const availableFunds = totalDeposits - totalSpent

    const activeJobs = jobs.filter((job) => job.status === "active")

    return (
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Deposits</CardTitle>
            <CardDescription>Materials deposits received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalDeposits)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {jobs.length} jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materials Purchased</CardTitle>
            <CardDescription>Total spent on materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalDeposits > 0 ? `${((totalSpent / totalDeposits) * 100).toFixed(1)}% of deposits` : "0% of deposits"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Funds</CardTitle>
            <CardDescription>Ready to use for materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">{formatCurrency(availableFunds)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {activeJobs.length} active jobs</p>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in DashboardStats:", error)
    return <div>Error loading dashboard stats. Check console for details.</div>
  }
}

async function RecentJobs() {
  const jobs = await getJobs()
  const recentJobs = jobs.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Jobs</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/jobs">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentJobs.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between">
                <div>
                  <Link href={`/jobs/${job.id}`} className="font-medium hover:underline">
                    {job.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{job.customer?.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(job.deposit_amount)}</div>
                  <p className="text-sm text-muted-foreground">{job.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function RecentTransactions() {
  const transactions = await getTransactions()
  const recentTransactions = transactions.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${
                      transaction.type === "deposit"
                        ? "text-green-600"
                        : transaction.type === "expense"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {transaction.type === "deposit" ? "+" : transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.vendor?.name || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
