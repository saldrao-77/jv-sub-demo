"use client"

import { useState } from "react"
import { CheckCircle2, ChevronDown, ChevronUp, CreditCard, FileDown, Receipt, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample data for all jobs (including historical)
const allJobs = [
  // Current jobs
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
  // Historical jobs
  {
    id: "5",
    customer: "David Wilson",
    job: "Patio Installation",
    address: "567 Birch St, Fremont, CA",
    depositAmount: 950,
    spent: 950,
    vendors: ["Home Depot", "Lowe's"],
    status: "Materials purchased",
    startDate: "Apr 28, 2025",
    transactions: [
      {
        date: "Apr 29, 2025",
        type: "Deposit",
        amount: 950,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "Apr 30, 2025",
        type: "Card Issued",
        amount: 950,
        vendor: "Home Depot, Lowe's",
        status: "Card issued",
      },
      {
        date: "May 2, 2025",
        type: "Purchase",
        amount: -950,
        vendor: "Home Depot",
        status: "Materials purchased",
      },
    ],
  },
  {
    id: "6",
    customer: "Emily Rodriguez",
    job: "Garage Conversion",
    address: "890 Walnut Ave, Sunnyvale, CA",
    depositAmount: 2000,
    spent: 2000,
    vendors: ["Home Depot", "Menards"],
    status: "Materials purchased",
    startDate: "Apr 20, 2025",
    transactions: [
      {
        date: "Apr 22, 2025",
        type: "Deposit",
        amount: 2000,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "Apr 23, 2025",
        type: "Card Issued",
        amount: 2000,
        vendor: "Home Depot, Menards",
        status: "Card issued",
      },
      {
        date: "Apr 25, 2025",
        type: "Purchase",
        amount: -1200,
        vendor: "Home Depot",
        status: "Materials purchased",
      },
      {
        date: "Apr 27, 2025",
        type: "Purchase",
        amount: -800,
        vendor: "Menards",
        status: "Materials purchased",
      },
    ],
  },
  {
    id: "7",
    customer: "Thomas Brown",
    job: "Fence Installation",
    address: "432 Elm St, Palo Alto, CA",
    depositAmount: 600,
    spent: 600,
    vendors: ["Home Depot"],
    status: "Materials purchased",
    startDate: "Apr 15, 2025",
    transactions: [
      {
        date: "Apr 16, 2025",
        type: "Deposit",
        amount: 600,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "Apr 17, 2025",
        type: "Card Issued",
        amount: 600,
        vendor: "Home Depot",
        status: "Card issued",
      },
      {
        date: "Apr 18, 2025",
        type: "Purchase",
        amount: -600,
        vendor: "Home Depot",
        status: "Materials purchased",
      },
    ],
  },
  {
    id: "8",
    customer: "Sophia Martinez",
    job: "Kitchen Backsplash",
    address: "765 Cherry Dr, Mountain View, CA",
    depositAmount: 350,
    spent: 350,
    vendors: ["Lowe's"],
    status: "Materials purchased",
    startDate: "Apr 10, 2025",
    transactions: [
      {
        date: "Apr 11, 2025",
        type: "Deposit",
        amount: 350,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "Apr 12, 2025",
        type: "Card Issued",
        amount: 350,
        vendor: "Lowe's",
        status: "Card issued",
      },
      {
        date: "Apr 13, 2025",
        type: "Purchase",
        amount: -350,
        vendor: "Lowe's",
        status: "Materials purchased",
      },
    ],
  },
  {
    id: "9",
    customer: "James Taylor",
    job: "Bathroom Tile Work",
    address: "543 Spruce Ln, Santa Clara, CA",
    depositAmount: 500,
    spent: 500,
    vendors: ["Home Depot", "Ace Hardware"],
    status: "Materials purchased",
    startDate: "Apr 5, 2025",
    transactions: [
      {
        date: "Apr 6, 2025",
        type: "Deposit",
        amount: 500,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "Apr 7, 2025",
        type: "Card Issued",
        amount: 500,
        vendor: "Home Depot, Ace Hardware",
        status: "Card issued",
      },
      {
        date: "Apr 8, 2025",
        type: "Purchase",
        amount: -300,
        vendor: "Home Depot",
        status: "Materials purchased",
      },
      {
        date: "Apr 9, 2025",
        type: "Purchase",
        amount: -200,
        vendor: "Ace Hardware",
        status: "Materials purchased",
      },
    ],
  },
  {
    id: "10",
    customer: "Olivia Anderson",
    job: "Flooring Installation",
    address: "876 Redwood Ct, San Mateo, CA",
    depositAmount: 1100,
    spent: 1100,
    vendors: ["Lowe's"],
    status: "Materials purchased",
    startDate: "Mar 28, 2025",
    transactions: [
      {
        date: "Mar 29, 2025",
        type: "Deposit",
        amount: 1100,
        vendor: "-",
        status: "Deposit paid",
      },
      {
        date: "Mar 30, 2025",
        type: "Card Issued",
        amount: 1100,
        vendor: "Lowe's",
        status: "Card issued",
      },
      {
        date: "Apr 1, 2025",
        type: "Purchase",
        amount: -1100,
        vendor: "Lowe's",
        status: "Materials purchased",
      },
    ],
  },
]

export default function JobsPage() {
  const [expandedJobs, setExpandedJobs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const toggleJobExpansion = (jobId: string) => {
    if (expandedJobs.includes(jobId)) {
      setExpandedJobs(expandedJobs.filter((id) => id !== jobId))
    } else {
      setExpandedJobs([...expandedJobs, jobId])
    }
  }

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
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

  // Function to export jobs as CSV
  const exportToCSV = () => {
    // Create CSV header
    const header = [
      "Customer",
      "Job",
      "Property Address",
      "Job Started",
      "Deposit Amount",
      "Spent",
      "Vendors",
      "Status",
    ].join(",")

    // Create CSV rows
    const rows = filteredJobs.map((job) => {
      return [
        `"${job.customer}"`, // Wrap in quotes to handle commas in names
        `"${job.job}"`,
        `"${job.address}"`,
        job.startDate,
        job.depositAmount.toFixed(2),
        job.spent.toFixed(2),
        `"${job.vendors.join(", ")}"`,
        job.status,
      ].join(",")
    })

    // Combine header and rows
    const csv = [header, ...rows].join("\n")

    // Create a blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `jobs_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">View and manage all your jobs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Deposit request sent">Deposit request sent</SelectItem>
                <SelectItem value="Deposit paid">Deposit paid</SelectItem>
                <SelectItem value="Card issued">Card issued</SelectItem>
                <SelectItem value="Materials purchased">Materials purchased</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToCSV} size="sm">
              <FileDown className="mr-2 h-4 w-4" /> Export to CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
            <CardDescription>View and manage all your material deposit requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <div className="grid grid-cols-9 p-4 text-sm font-medium bg-secondary/30">
                <div className="col-span-9 md:col-span-1 px-2">Customer</div>
                <div className="col-span-9 md:col-span-1 px-2">Job</div>
                <div className="col-span-9 md:col-span-2 px-2">Property Address</div>
                <div className="col-span-9 md:col-span-1 px-2">Job Started</div>
                <div className="col-span-9 md:col-span-1 px-2">Deposit Amount</div>
                <div className="col-span-9 md:col-span-1 px-2">Spent</div>
                <div className="col-span-9 md:col-span-1 px-2">Vendors</div>
                <div className="col-span-9 md:col-span-1 px-2">Status</div>
              </div>

              <div className="divide-y divide-border">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Collapsible key={job.id} open={expandedJobs.includes(job.id)}>
                      <CollapsibleTrigger asChild className="w-full">
                        <div
                          className="grid grid-cols-1 md:grid-cols-9 p-4 text-sm items-center cursor-pointer hover:bg-secondary/50"
                          onClick={() => toggleJobExpansion(job.id)}
                        >
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Customer:</div>
                            {job.customer}
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Job:</div>
                            {job.job}
                          </div>
                          <div className="py-2 md:py-0 px-2 md:col-span-2">
                            <div className="font-medium md:hidden">Property Address:</div>
                            {job.address}
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Job Started:</div>
                            {job.startDate}
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Deposit Amount:</div>${job.depositAmount.toFixed(2)}
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Spent:</div>${job.spent.toFixed(2)}
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Vendors:</div>
                            <div className="flex flex-wrap gap-1">
                              {job.vendors.map((vendor) => (
                                <Badge key={vendor} variant="outline" className="text-xs">
                                  {vendor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="py-2 md:py-0 px-2">
                            <div className="font-medium md:hidden">Status:</div>
                            {getStatusBadge(job.status)}
                          </div>
                          <div className="py-2 md:py-0 px-2 flex items-center justify-center">
                            {expandedJobs.includes(job.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
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
            <div className="text-xs text-muted-foreground">
              Showing {filteredJobs.length} of {allJobs.length} jobs
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
