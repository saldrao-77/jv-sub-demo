"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Plus,
  Receipt,
  Search,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ErrorBoundary } from "react-error-boundary"

export function DashboardContent({ initialJobs, initialTransactions, userId }) {
  const [expandedJobs, setExpandedJobs] = useState([])
  const [jobs] = useState(initialJobs)
  const [transactions] = useState(initialTransactions)

  const toggleJobExpansion = (jobId) => {
    if (expandedJobs.includes(jobId)) {
      setExpandedJobs(expandedJobs.filter((id) => id !== jobId))
    } else {
      setExpandedJobs([...expandedJobs, jobId])
    }
  }

  // Calculate totals for the stats cards
  const totalDeposits = transactions
    .filter((t) => t.type === "Deposit")
    .reduce((sum, transaction) => sum + Number.parseFloat(transaction.amount), 0)

  const totalPurchases = Math.abs(
    transactions
      .filter((t) => t.type === "Purchase")
      .reduce((sum, transaction) => sum + Number.parseFloat(transaction.amount), 0),
  )

  const availableFunds = totalDeposits - totalPurchases

  // Get only active jobs (those that are not completed)
  const activeJobs = jobs.filter(
    (job) =>
      job.status === "Deposit request sent" ||
      job.status === "Deposit paid" ||
      job.status === "Card issued" ||
      job.status === "Materials purchased",
  )

  // Get job transactions
  const getJobTransactions = (jobId) => {
    return transactions.filter((t) => t.job_id === jobId)
  }

  // Get recent transactions for the feed
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

  const getStatusBadge = (status) => {
    switch (status) {
      case "Deposit request sent":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-900/20 px-2 py-1 text-xs font-medium text-amber-400">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            {status}
          </span>
        )
      case "Deposit paid":
        return (
          <span className="inline-flex items-center rounded-full bg-green-900/20 px-2 py-1 text-xs font-medium text-green-400">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-400"></span>
            {status}
          </span>
        )
      case "Card issued":
        return (
          <span className="inline-flex items-center rounded-full bg-blue/10 px-2 py-1 text-xs font-medium text-blue">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue"></span>
            {status}
          </span>
        )
      case "Materials purchased":
        return (
          <span className="inline-flex items-center rounded-full bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-400">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-purple-400"></span>
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-900/20 px-2 py-1 text-xs font-medium text-gray-400">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
            {status}
          </span>
        )
    }
  }

  const getTransactionTypeBadge = (type) => {
    switch (type) {
      case "Deposit":
        return (
          <span className="inline-flex items-center rounded-full bg-green-900/20 px-2 py-1 text-xs font-medium text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {type}
          </span>
        )
      case "Card Issued":
        return (
          <span className="inline-flex items-center rounded-full bg-blue/10 px-2 py-1 text-xs font-medium text-blue">
            <CreditCard className="mr-1 h-3 w-3" />
            {type}
          </span>
        )
      case "Purchase":
        return (
          <span className="inline-flex items-center rounded-full bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-400">
            <Receipt className="mr-1 h-3 w-3" />
            {type}
          </span>
        )
      case "Request":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-900/20 px-2 py-1 text-xs font-medium text-amber-400">
            <Receipt className="mr-1 h-3 w-3" />
            {type}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-900/20 px-2 py-1 text-xs font-medium text-gray-400">
            <Receipt className="mr-1 h-3 w-3" />
            {type}
          </span>
        )
    }
  }

  return (
    <ErrorBoundary
      fallback={<div className="text-red-500 p-4">Error loading dashboard data. Please try again later.</div>}
    >
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your materials deposits and track your jobs</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/jobs/new" className="flex flex-col items-center">
              <Plus className="h-5 w-5 text-white" />
              <span className="text-white">New Job</span>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Deposits</CardTitle>
                <CardDescription>Materials deposits received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalDeposits.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {transactions.filter((t) => t.type === "Deposit").length} jobs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials Purchased</CardTitle>
                <CardDescription>Total spent on materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalPurchases.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {transactions.filter((t) => t.type === "Purchase").length} job
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Funds</CardTitle>
                <CardDescription>Ready to use for materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue">${availableFunds.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {transactions.filter((t) => t.type === "Card Issued").length} active cards
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ongoing Jobs Table (Now in the middle) */}
          <Card>
            <CardHeader>
              <CardTitle>Ongoing Jobs</CardTitle>
              <CardDescription>View and manage your active material deposit requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <div className="grid grid-cols-10 p-4 text-sm font-medium bg-secondary/30">
                  <div className="md:col-span-1 px-2">Customer</div>
                  <div className="md:col-span-1 px-2">Job</div>
                  <div className="md:col-span-2 px-2">Property Address</div>
                  <div className="md:col-span-1 px-2">Job Started</div>
                  <div className="md:col-span-1 px-2">Deposit Amount</div>
                  <div className="md:col-span-1 px-2">Spent</div>
                  <div className="md:col-span-1 px-2">Status</div>
                  <div className="md:col-span-1 px-2">Actions</div>
                </div>
                <div className="divide-y divide-border">
                  {activeJobs.length > 0 ? (
                    activeJobs.map((job) => {
                      const jobTransactions = getJobTransactions(job.id)
                      const spent = jobTransactions
                        .filter((t) => t.type === "Purchase")
                        .reduce((sum, t) => sum + Math.abs(Number.parseFloat(t.amount)), 0)

                      return (
                        <Collapsible key={job.id} open={expandedJobs.includes(job.id)}>
                          <CollapsibleTrigger asChild className="w-full">
                            <div
                              className="grid grid-cols-1 md:grid-cols-10 p-4 text-sm items-center cursor-pointer hover:bg-secondary/50"
                              onClick={() => toggleJobExpansion(job.id)}
                            >
                              <div className="py-2 md:py-0 px-2 md:col-span-1">
                                <div className="font-medium md:hidden">Customer:</div>
                                {job.customer_name}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-1">
                                <div className="font-medium md:hidden">Job:</div>
                                {job.job_name}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-2">
                                <div className="font-medium md:hidden">Property Address:</div>
                                {job.property_address}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-1">
                                <div className="font-medium md:hidden">Job Started:</div>
                                {job.created_date ? new Date(job.created_date).toLocaleDateString() : ""}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-1">
                                <div className="font-medium md:hidden">Deposit Amount:</div>$
                                {Number.parseFloat(job.deposit_amount).toFixed(2)}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-1">
                                <div className="font-medium md:hidden">Spent:</div>${spent.toFixed(2)}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-1 flex items-center justify-between">
                                <div className="font-medium md:hidden">Status:</div>
                                {getStatusBadge(job.status)}
                                <div className="ml-2 md:hidden">
                                  {expandedJobs.includes(job.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-1 flex items-center justify-center space-x-2">
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="text-blue hover:text-blue-dark"
                                  onClick={(e) => e.stopPropagation()}
                                  title="View job details"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                                <div className="hidden md:block">
                                  {expandedJobs.includes(job.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="bg-secondary/30 p-4 pl-8">
                              <div className="text-sm font-medium mb-2">Transaction History</div>
                              <div className="space-y-2">
                                {jobTransactions.length > 0 ? (
                                  jobTransactions.map((transaction, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                                      <div className="py-1 px-2">
                                        <div className="font-medium md:hidden">Date:</div>
                                        {transaction.date ? new Date(transaction.date).toLocaleDateString() : ""}
                                      </div>
                                      <div className="py-1 px-2">
                                        <div className="font-medium md:hidden">Type:</div>
                                        {getTransactionTypeBadge(transaction.type)}
                                      </div>
                                      <div className="py-1 px-2">
                                        <div className="font-medium md:hidden">Vendor:</div>
                                        {transaction.vendor || "-"}
                                      </div>
                                      <div
                                        className={`py-1 px-2 ${Number.parseFloat(transaction.amount) < 0 ? "text-red-400" : "text-green-400"}`}
                                      >
                                        <div className="font-medium md:hidden">Amount:</div>
                                        {Number.parseFloat(transaction.amount) < 0 ? "-" : ""}$
                                        {Math.abs(Number.parseFloat(transaction.amount)).toFixed(2)}
                                      </div>
                                      <div className="py-1 px-2">
                                        <div className="font-medium md:hidden">Status:</div>
                                        {transaction.status}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center text-muted-foreground py-2">
                                    No transactions found for this job.
                                  </div>
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No active jobs found. Create a new job to get started.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Transaction Feed (Renamed from Transaction History) */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                <CardTitle>Transaction Feed</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search transactions..." className="pl-8 w-full sm:w-[200px]" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="deposits">Deposits</SelectItem>
                      <SelectItem value="purchases">Purchases</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="deposits">Deposits</TabsTrigger>
                  <TabsTrigger value="purchases">Purchases</TabsTrigger>
                </TabsList>
                <div className="space-y-4">
                  <div className="rounded-md border border-border">
                    <div className="grid grid-cols-6 p-4 text-sm font-medium bg-secondary/30">
                      <div className="col-span-6 md:col-span-1 px-2 flex items-center">
                        Date
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                      <div className="col-span-6 md:col-span-2 px-2">Job</div>
                      <div className="col-span-6 md:col-span-1 px-2">Type</div>
                      <div className="col-span-6 md:col-span-1 px-2">Vendor</div>
                      <div className="col-span-6 md:col-span-1 px-2 text-right">Amount</div>
                    </div>
                    <div className="divide-y divide-border">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, idx) => {
                          const job = jobs.find((j) => j.id === transaction.job_id) || {}

                          return (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 p-4 text-sm items-center">
                              <div className="py-2 md:py-0 px-2">
                                <div className="font-medium md:hidden">Date:</div>
                                {transaction.date ? new Date(transaction.date).toLocaleDateString() : ""}
                              </div>
                              <div className="py-2 md:py-0 px-2 md:col-span-2">
                                <div className="font-medium md:hidden">Job:</div>
                                <span className="font-medium">{job.job_name}</span>
                                <div className="text-xs text-muted-foreground">{job.customer_name}</div>
                              </div>
                              <div className="py-2 md:py-0 px-2">
                                <div className="font-medium md:hidden">Type:</div>
                                {getTransactionTypeBadge(transaction.type)}
                              </div>
                              <div className="py-2 md:py-0 px-2">
                                <div className="font-medium md:hidden">Vendor:</div>
                                {transaction.vendor || "-"}
                              </div>
                              <div
                                className={`py-2 md:py-0 px-2 md:text-right ${Number.parseFloat(transaction.amount) < 0 ? "text-red-400" : ""}`}
                              >
                                <div className="font-medium md:hidden">Amount:</div>
                                {Number.parseFloat(transaction.amount) < 0 ? "-" : ""}$
                                {Math.abs(Number.parseFloat(transaction.amount)).toFixed(2)}
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No transactions found. Create a job and add transactions to get started.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/transactions">View All Transactions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
