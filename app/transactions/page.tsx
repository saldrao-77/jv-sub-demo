import { Suspense } from "react"
import { getTransactions } from "@/lib/actions"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and manage all your transactions</p>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <TransactionsList />
        </Suspense>
      </main>
    </div>
  )
}

async function TransactionsList() {
  const transactions = await getTransactions()

  const deposits = transactions.filter((tx) => tx.type === "deposit")
  const expenses = transactions.filter((tx) => tx.type === "expense")
  const refunds = transactions.filter((tx) => tx.type === "refund")

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
            <TabsTrigger value="deposits">Deposits ({deposits.length})</TabsTrigger>
            <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
            <TabsTrigger value="refunds">Refunds ({refunds.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <TransactionsTable transactions={transactions} />
          </TabsContent>
          <TabsContent value="deposits" className="mt-4">
            <TransactionsTable transactions={deposits} />
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            <TransactionsTable transactions={expenses} />
          </TabsContent>
          <TabsContent value="refunds" className="mt-4">
            <TransactionsTable transactions={refunds} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function TransactionsTable({ transactions }) {
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
