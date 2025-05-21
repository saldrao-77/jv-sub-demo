"use client"

import { useState } from "react"
import { CheckCircle2, ChevronDown, ChevronUp, CreditCard, FileDown, Receipt, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { ErrorBoundary } from "react-error-boundary"

export function JobsList({ initialJobs, initialJobTransactions, userId }) {
  const [expandedJobs, setExpandedJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobs] = useState(initialJobs)
  const [jobTransactions] = useState(initialJobTransactions)

  const toggleJobExpansion = (jobId) => {
    if (expandedJobs.includes(jobId)) {
      setExpandedJobs(expandedJobs.filter((id) => id !== jobId))
    } else {
      setExpandedJobs([...expandedJobs, jobId])
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.property_address?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  // Function to export jobs as CSV
  const exportToCSV = () => {
    // Create CSV header
    const header = ["Customer", "Job", "Property Address", "Job Started", "Deposit Amount", "Spent", "Status"].join(",")

    // Create CSV rows
    const rows = filteredJobs.map((job) => {
      const transactions = jobTransactions[job.id] || []
      const spent = transactions
        .filter((t) => t.type === "Purchase")
        .reduce((sum, t) => sum + Math.abs(Number.parseFloat(t.amount)), 0)

      return [
        `"${job.customer_name || ""}"`, // Wrap in quotes to handle commas in names
        `"${job.job_name || ""}"`,
        `"${job.property_address || ""}"`,
        job.created_date ? new Date(job.created_date).toLocaleDateString() : "",
        Number.parseFloat(job.deposit_amount).toFixed(2),
        spent.toFixed(2),
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
    <ErrorBoundary fallback={<div className="text-red-500 p-4">Error loading jobs. Please try again later.</div>}>
      <div>
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
              <div className="grid grid-cols-10 p-4 text-sm font-medium bg-secondary/30">
                <div className="col-span-10 md:col-span-1 px-2">Customer</div>
                <div className="col-span-10 md:col-span-1 px-2">Job</div>
                <div className="col-span-10 md:col-span-2 px-2">Property Address</div>
                <div className="col-span-10 md:col-span-1 px-2">Job Started</div>
                <div className="col-span-10 md:col-span-1 px-2">Deposit Amount</div>
                <div className="col-span-10 md:col-span-1 px-2">Spent</div>
                <div className="col-span-10 md:col-span-1 px-2">Status</div>
                <div className="col-span-10 md:col-span-1 px-2 text-center">Actions</div>
              </div>

              <div className="divide-y divide-border">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const transactions = jobTransactions[job.id] || []
                    const spent = transactions
                      .filter((t) => t.type === "Purchase")
                      .reduce((sum, t) => sum + Math.abs(Number.parseFloat(t.amount)), 0)

                    return (
                      <Collapsible key={job.id} open={expandedJobs.includes(job.id)}>
                        <CollapsibleTrigger asChild className="w-full">
                          <div
                            className="grid grid-cols-1 md:grid-cols-10 p-4 text-sm items-center cursor-pointer hover:bg-secondary/50"
                            onClick={() => toggleJobExpansion(job.id)}
                          >
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Customer:</div>
                              {job.customer_name}
                            </div>
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Job:</div>
                              {job.job_name}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-2">
                              <div className="font-medium md:hidden">Property Address:</div>
                              {job.property_address}
                            </div>
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Job Started:</div>
                              {job.created_date ? new Date(job.created_date).toLocaleDateString() : ""}
                            </div>
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Deposit Amount:</div>$
                              {Number.parseFloat(job.deposit_amount).toFixed(2)}
                            </div>
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Spent:</div>${spent.toFixed(2)}
                            </div>
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Status:</div>
                              {getStatusBadge(job.status)}
                            </div>
                            <div className="py-2 md:py-0 px-2 flex items-center justify-center space-x-2">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-blue hover:text-blue-dark"
                                onClick={(e) => e.stopPropagation()}
                                title="View job details"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                              <div>
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
                              {transactions.length > 0 ? (
                                transactions.map((transaction, idx) => (
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
                    No jobs found matching your search criteria.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </div>
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
