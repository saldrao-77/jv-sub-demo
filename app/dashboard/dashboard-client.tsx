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
import { Header } from "@/components/header"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Job } from "@/lib/data/jobs"
import type { Transaction } from "@/lib/data/transactions"

interface DashboardClientProps {
  jobs: Job[]
  transactions: Transaction[]
  stats: {
    totalDeposits: number
    totalPurchases: number
    availableFunds: number
    depositCount: number
    purchaseCount: number
    cardCount: number
  }
}

export default function DashboardClient({ jobs, transactions, stats }: DashboardClientProps) {
  const [expandedJobs, setExpandedJobs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("all")

  const toggleJobExpansion = (jobId: string) => {
    if (expandedJobs.includes(jobId)) {
      setExpandedJobs(expandedJobs.filter((id) => id !== jobId))
    } else {
      setExpandedJobs([...expandedJobs, jobId])
    }
  }

  // Filter jobs based on search
  const filteredJobs = jobs.filter(
    (job) =>
      job.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter transactions based on search and type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.job?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.job?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const matchesType =
      transactionType === "all" ||
      (transactionType === "deposits" && (transaction.type === "Deposit" || transaction.type === "Request")) ||
      (transactionType === "purchases" && transaction.type === "Purchase")

    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: string) => {
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

  const getTransactionTypeBadge = (type: string) => {
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

  // Format date from ISO string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

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
                <div className="text-3xl font-bold">${stats.totalDeposits.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">From {stats.depositCount} jobs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials Purchased</CardTitle>
                <CardDescription>Total spent on materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.totalPurchases.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">From {stats.purchaseCount} jobs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Funds</CardTitle>
                <CardDescription>Ready to use for materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue">${stats.availableFunds.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Across {stats.cardCount} active cards</p>
              </CardContent>
            </Card>
          </div>

          {/* Ongoing Jobs Table */}
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
                  <div className="md:col-span-1 px-2">Vendors</div>
                  <div className="md:col-span-1 px-2">Status</div>
                  <div className="md:col-span-1 px-2">Actions</div>
                </div>
                <div className="divide-y divide-border">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <Collapsible key={job.id} open={expandedJobs.includes(job.id)}>
                        <CollapsibleTrigger asChild className="w-full">
                          <div
                            className="grid grid-cols-1 md:grid-cols-10 p-4 text-sm items-center cursor-pointer hover:bg-secondary/50"
                            onClick={() => toggleJobExpansion(job.id)}
                          >
                            <div className="py-2 md:py-0 px-2 md:col-span-1">
                              <div className="font-medium md:hidden">Customer:</div>
                              {job.customer?.name || "N/A"}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-1">
                              <div className="font-medium md:hidden">Job:</div>
                              {job.name || "N/A"}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-2">
                              <div className="font-medium md:hidden">Property Address:</div>
                              {job.address || "N/A"}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-1">
                              <div className="font-medium md:hidden">Job Started:</div>
                              {formatDate(job.start_date)}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-1">
                              <div className="font-medium md:hidden">Deposit Amount:</div>$
                              {job.deposit_amount?.toFixed(2) || "0.00"}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-1">
                              <div className="font-medium md:hidden">Spent:</div>$
                              {job.spent_amount?.toFixed(2) || "0.00"}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-1">
                              <div className="font-medium md:hidden">Vendors:</div>
                              <div className="flex flex-wrap gap-1">
                                {job.vendors?.map((vendor) => (
                                  <Badge key={vendor.id} variant="outline" className="text-xs">
                                    {vendor.name}
                                  </Badge>
                                )) || "None"}
                              </div>
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-1 flex items-center justify-between">
                              <div className="font-medium md:hidden">Status:</div>
                              {getStatusBadge(job.status || "Unknown")}
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
                                href={`/jobs/${job.id}/status`}
                                className="text-blue hover:text-blue-dark"
                                onClick={(e) => e.stopPropagation()}
                                title="View detailed status"
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
                              {transactions
                                .filter((t) => t.job_id === job.id)
                                .map((transaction, idx) => (
                                  <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                                    <div className="py-1 px-2">
                                      <div className="font-medium md:hidden">Date:</div>
                                      {formatDate(transaction.created_at)}
                                    </div>
                                    <div className="py-1 px-2">
                                      <div className="font-medium md:hidden">Type:</div>
                                      {getTransactionTypeBadge(transaction.type)}
                                    </div>
                                    <div className="py-1 px-2">
                                      <div className="font-medium md:hidden">Vendor:</div>
                                      {transaction.vendor || "-"}
                                    </div>
                                    <div className={`py-1 px-2 ${transaction.amount < 0 ? "text-red-400" : ""}`}>
                                      <div className="font-medium md:hidden">Amount:</div>
                                      {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                                    </div>
                                    <div className="py-1 px-2">
                                      <div className="font-medium md:hidden">Status:</div>
                                      {transaction.status}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No jobs found matching your search criteria.
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

          {/* Transaction Feed */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                <CardTitle>Transaction Feed</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8 w-full sm:w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all" onValueChange={setTransactionType}>
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
                  <TabsTrigger value="all" onClick={() => setTransactionType("all")}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="deposits" onClick={() => setTransactionType("deposits")}>
                    Deposits
                  </TabsTrigger>
                  <TabsTrigger value="purchases" onClick={() => setTransactionType("purchases")}>
                    Purchases
                  </TabsTrigger>
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
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-6 p-4 text-sm items-center">
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Date:</div>
                              {formatDate(transaction.created_at)}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-2">
                              <div className="font-medium md:hidden">Job:</div>
                              <span className="font-medium">{transaction.job?.name || "Unknown Job"}</span>
                              <div className="text-xs text-muted-foreground">
                                {transaction.job?.customer?.name || "Unknown Customer"}
                              </div>
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
                              className={`py-2 md:py-0 px-2 md:text-right ${transaction.amount < 0 ? "text-red-400" : ""}`}
                            >
                              <div className="font-medium md:hidden">Amount:</div>
                              {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No transactions found matching your search criteria.
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
      </main>
    </div>
  )
}
