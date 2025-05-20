"use client"

import { useState } from "react"
import { ArrowUpDown, CheckCircle2, CreditCard, FileDown, Receipt, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"

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
    jobId: "4",
  },
  {
    date: "May 19, 2025",
    customer: "Robert Garcia",
    job: "Deck Construction",
    type: "Card Issued",
    vendor: "Home Depot, Ace Hardware",
    amount: 750,
    status: "Card issued",
    jobId: "3",
  },
  {
    date: "May 18, 2025",
    customer: "Sarah Johnson",
    job: "Bathroom Renovation",
    type: "Deposit",
    vendor: "-",
    amount: 850,
    status: "Deposit paid",
    jobId: "1",
  },
  {
    date: "May 15, 2025",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    type: "Purchase",
    vendor: "Lowe's",
    amount: -750,
    status: "Materials purchased",
    jobId: "2",
  },
  {
    date: "May 13, 2025",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    type: "Card Issued",
    vendor: "Lowe's, Home Depot",
    amount: 1200,
    status: "Card issued",
    jobId: "2",
  },
  {
    date: "May 12, 2025",
    customer: "Michael Chen",
    job: "Kitchen Remodel",
    type: "Deposit",
    vendor: "-",
    amount: 1200,
    status: "Deposit paid",
    jobId: "2",
  },
  // Additional historical transactions
  {
    date: "May 2, 2025",
    customer: "David Wilson",
    job: "Patio Installation",
    type: "Purchase",
    vendor: "Home Depot",
    amount: -950,
    status: "Materials purchased",
    jobId: "5",
  },
  {
    date: "Apr 30, 2025",
    customer: "David Wilson",
    job: "Patio Installation",
    type: "Card Issued",
    vendor: "Home Depot, Lowe's",
    amount: 950,
    status: "Card issued",
    jobId: "5",
  },
  {
    date: "Apr 29, 2025",
    customer: "David Wilson",
    job: "Patio Installation",
    type: "Deposit",
    vendor: "-",
    amount: 950,
    status: "Deposit paid",
    jobId: "5",
  },
  {
    date: "Apr 27, 2025",
    customer: "Emily Rodriguez",
    job: "Garage Conversion",
    type: "Purchase",
    vendor: "Menards",
    amount: -800,
    status: "Materials purchased",
    jobId: "6",
  },
  {
    date: "Apr 25, 2025",
    customer: "Emily Rodriguez",
    job: "Garage Conversion",
    type: "Purchase",
    vendor: "Home Depot",
    amount: -1200,
    status: "Materials purchased",
    jobId: "6",
  },
  {
    date: "Apr 23, 2025",
    customer: "Emily Rodriguez",
    job: "Garage Conversion",
    type: "Card Issued",
    vendor: "Home Depot, Menards",
    amount: 2000,
    status: "Card issued",
    jobId: "6",
  },
  {
    date: "Apr 22, 2025",
    customer: "Emily Rodriguez",
    job: "Garage Conversion",
    type: "Deposit",
    vendor: "-",
    amount: 2000,
    status: "Deposit paid",
    jobId: "6",
  },
  {
    date: "Apr 18, 2025",
    customer: "Thomas Brown",
    job: "Fence Installation",
    type: "Purchase",
    vendor: "Home Depot",
    amount: -600,
    status: "Materials purchased",
    jobId: "7",
  },
  {
    date: "Apr 17, 2025",
    customer: "Thomas Brown",
    job: "Fence Installation",
    type: "Card Issued",
    vendor: "Home Depot",
    amount: 600,
    status: "Card issued",
    jobId: "7",
  },
  {
    date: "Apr 16, 2025",
    customer: "Thomas Brown",
    job: "Fence Installation",
    type: "Deposit",
    vendor: "-",
    amount: 600,
    status: "Deposit paid",
    jobId: "7",
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("all")

  // Calculate totals for the stats cards
  const totalDeposits = transactionFeed
    .filter((t) => t.type === "Deposit")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalPurchases = Math.abs(
    transactionFeed.filter((t) => t.type === "Purchase").reduce((sum, transaction) => sum + transaction.amount, 0),
  )

  const availableFunds = totalDeposits - totalPurchases

  // Filter transactions based on search and type
  const filteredTransactions = transactionFeed.filter((transaction) => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      transactionType === "all" ||
      (transactionType === "deposits" && (transaction.type === "Deposit" || transaction.type === "Request")) ||
      (transactionType === "purchases" && transaction.type === "Purchase")

    return matchesSearch && matchesType
  })

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

  // Function to export transactions as CSV
  const exportToCSV = () => {
    // Create CSV header
    const header = ["Date", "Customer", "Job", "Type", "Vendor", "Amount", "Status"].join(",")

    // Create CSV rows
    const rows = filteredTransactions.map((transaction) => {
      return [
        transaction.date,
        `"${transaction.customer}"`, // Wrap in quotes to handle commas in names
        `"${transaction.job}"`,
        transaction.type,
        `"${transaction.vendor}"`,
        transaction.amount.toFixed(2),
        transaction.status,
      ].join(",")
    })

    // Combine header and rows
    const csv = [header, ...rows].join("\n")

    // Create a blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
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
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and manage all your transactions</p>
          </div>
          <Button onClick={exportToCSV} className="mt-4 md:mt-0" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Export to CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Deposits</CardTitle>
              <CardDescription>Materials deposits received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalDeposits.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {transactionFeed.filter((t) => t.type === "Deposit").length} deposits
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
                From {transactionFeed.filter((t) => t.type === "Purchase").length} purchases
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
                Across {transactionFeed.filter((t) => t.type === "Card Issued").length} active cards
              </p>
            </CardContent>
          </Card>
        </div>

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
            <div className="text-xs text-muted-foreground">
              Showing {filteredTransactions.length} of {transactionFeed.length} transactions
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
