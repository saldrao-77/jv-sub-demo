"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TransactionsContentProps {
  transactions: Transaction[]
}

export default function TransactionsContent({ transactions }: TransactionsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const deposits = transactions.filter((tx) => tx.type === "deposit")
  const expenses = transactions.filter((tx) => tx.type === "expense")
  const refunds = transactions.filter((tx) => tx.type === "refund")

  const filterTransactions = (txList: Transaction[]) => {
    return txList.filter(
      (tx) =>
        tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.job_id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const filteredAll = filterTransactions(transactions)
  const filteredDeposits = filterTransactions(deposits)
  const filteredExpenses = filterTransactions(expenses)
  const filteredRefunds = filterTransactions(refunds)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">All Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-[150px] sm:w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({filteredAll.length})</TabsTrigger>
              <TabsTrigger value="deposits">Deposits ({filteredDeposits.length})</TabsTrigger>
              <TabsTrigger value="expenses">Expenses ({filteredExpenses.length})</TabsTrigger>
              <TabsTrigger value="refunds">Refunds ({filteredRefunds.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              {renderTransactionList(filteredAll)}
            </TabsContent>
            <TabsContent value="deposits" className="space-y-4 mt-4">
              {renderTransactionList(filteredDeposits)}
            </TabsContent>
            <TabsContent value="expenses" className="space-y-4 mt-4">
              {renderTransactionList(filteredExpenses)}
            </TabsContent>
            <TabsContent value="refunds" className="space-y-4 mt-4">
              {renderTransactionList(filteredRefunds)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function renderTransactionList(transactions: Transaction[]) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-5 gap-4 p-4 font-medium">
        <div>Date</div>
        <div>Type</div>
        <div>Description</div>
        <div>Vendor</div>
        <div className="text-right">Amount</div>
      </div>
      {transactions.map((transaction) => (
        <div key={transaction.id} className="grid grid-cols-5 gap-4 p-4 border-t items-center">
          <div>{formatDate(transaction.date)}</div>
          <div>
            <Badge className={getStatusColor(transaction.type)}>{transaction.type}</Badge>
          </div>
          <div>{transaction.description || "N/A"}</div>
          <div>{transaction.vendor?.name || "N/A"}</div>
          <div
            className={`text-right font-medium ${
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
        </div>
      ))}
    </div>
  )
}
