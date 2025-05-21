"use client"

import { useState } from "react"
import { ArrowUpDown, CheckCircle2, CreditCard, FileDown, Receipt, Search, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "react-error-boundary"

export function TransactionsList({ initialTransactions, userId }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [transactions] = useState(initialTransactions)

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

  // Filter transactions based on search and type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.jobs?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.jobs?.job_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      transactionType === "all" ||
      (transactionType === "deposits" && (transaction.type === "Deposit" || transaction.type === "Request")) ||
      (transactionType === "purchases" && transaction.type === "Purchase")

    return matchesSearch && matchesType
  })

  // Filter receipts based on search
  const filteredReceipts = transactions.filter((transaction) => {
    const hasReceipt = transaction.receipt_url

    const matchesSearch =
      transaction.jobs?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.jobs?.job_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return hasReceipt && matchesSearch
  })

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

  // Function to export transactions as CSV
  const exportToCSV = () => {
    // Create CSV header
    const header = ["Date", "Customer", "Job", "Type", "Vendor", "Amount", "Status"].join(",")

    // Create CSV rows
    const rows = filteredTransactions.map((transaction) => {
      return [
        transaction.date ? new Date(transaction.date).toLocaleDateString() : "",
        `"${transaction.jobs?.customer_name || ""}"`, // Wrap in quotes to handle commas in names
        `"${transaction.jobs?.job_name || ""}"`,
        transaction.type,
        `"${transaction.vendor || ""}"`,
        Number.parseFloat(transaction.amount).toFixed(2),
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

  // Function to export receipts as CSV
  const exportReceiptsToCSV = () => {
    // Create CSV header
    const header = ["Date", "Customer", "Job", "Vendor", "Amount", "Description"].join(",")

    // Create CSV rows
    const rows = filteredReceipts.map((receipt) => {
      return [
        receipt.date ? new Date(receipt.date).toLocaleDateString() : "",
        `"${receipt.jobs?.customer_name || ""}"`, // Wrap in quotes to handle commas in names
        `"${receipt.jobs?.job_name || ""}"`,
        `"${receipt.vendor || ""}"`,
        Number.parseFloat(receipt.amount).toFixed(2),
        `"${receipt.description || ""}"`,
      ].join(",")
    })

    // Combine header and rows
    const csv = [header, ...rows].join("\n")

    // Create a blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `receipts_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <ErrorBoundary
      fallback={<div className="text-red-500 p-4">Error loading transactions. Please try again later.</div>}
    >
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and manage all your transactions</p>
          </div>
          <Button
            onClick={activeTab === "receipts" ? exportReceiptsToCSV : exportToCSV}
            className="mt-4 md:mt-0"
            size="sm"
          >
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
                From {transactions.filter((t) => t.type === "Deposit").length} deposits
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
                From {transactions.filter((t) => t.type === "Purchase").length} purchases
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
                {activeTab !== "receipts" && (
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
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              onValueChange={(value) => {
                setActiveTab(value)
                if (value !== "receipts") {
                  setTransactionType(value)
                }
              }}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="receipts">Receipts</TabsTrigger>
              </TabsList>

              {activeTab !== "receipts" ? (
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
                              {transaction.date ? new Date(transaction.date).toLocaleDateString() : ""}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-2">
                              <div className="font-medium md:hidden">Job:</div>
                              <span className="font-medium">{transaction.jobs?.job_name}</span>
                              <div className="text-xs text-muted-foreground">{transaction.jobs?.customer_name}</div>
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
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No transactions found matching your search criteria.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border border-border">
                    <div className="grid grid-cols-7 p-4 text-sm font-medium bg-secondary/30">
                      <div className="col-span-7 md:col-span-1 px-2 flex items-center">
                        Date
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                      <div className="col-span-7 md:col-span-2 px-2">Job</div>
                      <div className="col-span-7 md:col-span-1 px-2">Vendor</div>
                      <div className="col-span-7 md:col-span-2 px-2">Description</div>
                      <div className="col-span-7 md:col-span-1 px-2 text-right">Amount</div>
                    </div>
                    <div className="divide-y divide-border">
                      {filteredReceipts.length > 0 ? (
                        filteredReceipts.map((receipt) => (
                          <div key={receipt.id} className="grid grid-cols-1 md:grid-cols-7 p-4 text-sm items-center">
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Date:</div>
                              {receipt.date ? new Date(receipt.date).toLocaleDateString() : ""}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-2">
                              <div className="font-medium md:hidden">Job:</div>
                              <span className="font-medium">{receipt.jobs?.job_name}</span>
                              <div className="text-xs text-muted-foreground">{receipt.jobs?.customer_name}</div>
                            </div>
                            <div className="py-2 md:py-0 px-2">
                              <div className="font-medium md:hidden">Vendor:</div>
                              {receipt.vendor || "-"}
                            </div>
                            <div className="py-2 md:py-0 px-2 md:col-span-2">
                              <div className="font-medium md:hidden">Description:</div>
                              <div className="flex items-center">
                                {receipt.description || "No description"}
                                {receipt.receipt_url && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="right" className="p-0 border-0">
                                        <img
                                          src={receipt.receipt_url || "/placeholder.svg"}
                                          alt={`Receipt for ${receipt.description || "transaction"}`}
                                          className="max-w-[300px] max-h-[400px] rounded-md"
                                        />
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                            <div className="py-2 md:py-0 px-2 md:text-right">
                              <div className="font-medium md:hidden">Amount:</div>$
                              {Number.parseFloat(receipt.amount).toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No receipts found matching your search criteria.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              {activeTab === "receipts"
                ? `Showing ${filteredReceipts.length} of ${filteredReceipts.length} receipts`
                : `Showing ${filteredTransactions.length} of ${transactions.length} transactions`}
            </div>
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
