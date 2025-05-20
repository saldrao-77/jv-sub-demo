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

// Sample data for ongoing jobs
const ongoingJobs = [
  {
    id: "1",
    customer: "Sarah Johnson",
    job: "Bathroom Renovation",
    address: "123 Oak St, San Francisco, CA",
    depositAmount: 850,
    spent: 0,
    vendors: ["Home Depot"],
    status: "Deposit paid",
    startDate: "May 15, 2025",
    transactions: [
      {
        date: "May 18, 2025",
        type: "Deposit",
        amount: 850,
        vendor: "-",
        status: "Deposit paid",
      },
    ],
  },
  {
    id: "2",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    address: "456 Pine Ave, Oakland, CA",
    depositAmount: 1200,
    spent: 750,
    vendors: ["Lowe's", "Home Depot"],
    status: "Materials purchased",
    startDate: "May 10, 2025",
    transactions: [
      {
        date: "May 12, 2025",
        type: "Deposit",
        amount: 1200,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "May 13, 2025",
        type: "Card Issued",
        amount: 1200,
        vendor: "Lowe's, Home Depot",
        status: "Card issued",
      },
      {
        date: "May 15, 2025",
        type: "Purchase",
        amount: -750,
        vendor: "Lowe's",
        status: "Materials purchased",
      },
    ],
  },
  {
    id: "3",
    customer: "Robert Garcia",
    job: "Deck Construction",
    address: "789 Maple Dr, San Jose, CA",
    depositAmount: 750,
    spent: 0,
    vendors: ["Home Depot", "Ace Hardware"],
    status: "Card issued",
    startDate: "May 16, 2025",
    transactions: [
      {
        date: "May 17, 2025",
        type: "Deposit",
        amount: 750,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "May 19, 2025",
        type: "Card Issued",
        amount: 750,
        vendor: "Home Depot, Ace Hardware",
        status: "Card issued",
      },
    ],
  },
  {
    id: "4",
    customer: "Jennifer Lee",
    job: "Basement Finishing",
    address: "321 Cedar Ln, Berkeley, CA",
    depositAmount: 1500,
    spent: 0,
    vendors: ["Home Depot", "Menards"],
    status: "Deposit request sent",
    startDate: "May 19, 2025",
    transactions: [
      {
        date: "May 19, 2025",
        type: "Request",
        amount: 1500,
        vendor: "-",
        status: "Deposit request sent",
      },
    ],
  },
]

// Sample data for transaction feed
const transactionFeed = [
  {
    date: "May 19, 2025",
    customer: "Jennifer Lee",
    job: "Basement Finishing",
    type: "Request",
    vendor: "-",
    amount: 1500,
    status: "Deposit request sent",
  },
  {
    date: "May 19, 2025",
    customer: "Robert Garcia",
    job: "Deck Construction",
    type: "Card Issued",
    vendor: "Home Depot, Ace Hardware",
    amount: 750,
    status: "Card issued",
  },
  {
    date: "May 18, 2025",
    customer: "Sarah Johnson",
    job: "Bathroom Renovation",
    type: "Deposit",
    vendor: "-",
    amount: 850,
    status: "Deposit paid",
  },
  {
    date: "May 15, 2025",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    type: "Purchase",
    vendor: "Lowe's",
    amount: -750,
    status: "Materials purchased",
  },
  {
    date: "May 13, 2025",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    type: "Card Issued",
    vendor: "Lowe's, Home Depot",
    amount: 1200,
    status: "Card issued",
  },
  {
    date: "May 12, 2025",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    type: "Deposit",
    vendor: "-",
    amount: 1200,
    status: "Deposit paid",
  },
]

export default function Dashboard() {
  const [expandedJobs, setExpandedJobs] = useState<string[]>([])

  const toggleJobExpansion = (jobId: string) => {
    if (expandedJobs.includes(jobId)) {
      setExpandedJobs(expandedJobs.filter((id) => id !== jobId))
    } else {
      setExpandedJobs([...expandedJobs, jobId])
    }
  }

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
                <div className="text-3xl font-bold">$2,800.00</div>
                <p className="text-xs text-muted-foreground mt-1">From 3 jobs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials Purchased</CardTitle>
                <CardDescription>Total spent on materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$750.00</div>
                <p className="text-xs text-muted-foreground mt-1">From 1 job</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Funds</CardTitle>
                <CardDescription>Ready to use for materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue">$2,050.00</div>
                <p className="text-xs text-muted-foreground mt-1">Across 3 active cards</p>
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
                  <div className="md:col-span-1 px-2">Vendors</div>
                  <div className="md:col-span-1 px-2">Status</div>
                  <div className="md:col-span-1 px-2">Actions</div>
                </div>
                <div className="divide-y divide-border">
                  {ongoingJobs.map((job) => (
                    <Collapsible key={job.id} open={expandedJobs.includes(job.id)}>
                      <CollapsibleTrigger asChild className="w-full">
                        <div
                          className="grid grid-cols-1 md:grid-cols-10 p-4 text-sm items-center cursor-pointer hover:bg-secondary/50"
                          onClick={() => toggleJobExpansion(job.id)}
                        >
                          <div className="py-2 md:py-0 px-2 md:col-span-1">
                            <div className="font-medium md:hidden">Customer:</div>
                            {job.customer}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-1">
                            <div className="font-medium md:hidden">Job:</div>
                            {job.job}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-2">
                            <div className="font-medium md:hidden">Property Address:</div>
                            {job.address}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-1">
                            <div className="font-medium md:hidden">Job Started:</div>
                            {job.startDate}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-1">
                            <div className="font-medium md:hidden">Deposit Amount:</div>${job.depositAmount.toFixed(2)}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-1">
                            <div className="font-medium md:hidden">Spent:</div>${job.spent.toFixed(2)}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-1">
                            <div className="font-medium md:hidden">Vendors:</div>
                            <div className="flex flex-wrap gap-1">
                              {job.vendors.map((vendor) => (
                                <Badge key={vendor} variant="outline" className="text-xs">
                                  {vendor}
                                </Badge>
                              ))}
                            </div>
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
                            {job.transactions.map((transaction, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                                <div className="py-1 px-2">
                                  <div className="font-medium md:hidden">Date:</div>
                                  {transaction.date}
                                </div>
                                <div className="py-1 px-2">
                                  <div className="font-medium md:hidden">Type:</div>
                                  {getTransactionTypeBadge(transaction.type)}
                                </div>
                                <div className="py-1 px-2">
                                  <div className="font-medium md:hidden">Vendor:</div>
                                  {transaction.vendor}
                                </div>
                                <div
                                  className={`py-1 px-2 ${transaction.amount < 0 ? "text-red-400" : "text-green-400"}`}
                                >
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
                  ))}
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
                      {transactionFeed.map((transaction, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-6 p-4 text-sm items-center">
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Date:</div>
                            {transaction.date}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-2">
                            <div className="font-medium md:hidden">Job:</div>
                            <span className="font-medium">{transaction.job}</span>
                            <div className="text-xs text-muted-foreground">{transaction.customer}</div>
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Type:</div>
                            {getTransactionTypeBadge(transaction.type)}
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Vendor:</div>
                            {transaction.vendor}
                          </div>
                          <div
                            className={`py-2 md:py-0 px-2 md:text-right ${transaction.amount < 0 ? "text-red-400" : ""}`}
                          >
                            <div className="font-medium md:hidden">Amount:</div>
                            {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
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
