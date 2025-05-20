"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, CreditCard, DollarSign, MapPin, User } from "lucide-react"
import type { Job } from "@/lib/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JobDetailContentProps {
  job: Job
}

export default function JobDetailContent({ job }: JobDetailContentProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const transactions = job.transactions || []
  const deposits = transactions.filter((tx) => tx.type === "deposit")
  const expenses = transactions.filter((tx) => tx.type === "expense")
  const refunds = transactions.filter((tx) => tx.type === "refund")

  const totalDeposits = deposits.reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0)
  const totalRefunds = refunds.reduce((sum, tx) => sum + tx.amount, 0)
  const availableFunds = totalDeposits - totalExpenses + totalRefunds

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to jobs</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{job.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
              <span>•</span>
              <span>Started {formatDate(job.start_date)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/jobs/${job.id}/status`}>View Status Page</Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(job.deposit_amount)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(job.spent_amount)}</div>
                <p className="text-xs text-muted-foreground">
                  {((job.spent_amount / job.deposit_amount) * 100).toFixed(1)}% of deposit
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(availableFunds)}</div>
                <p className="text-xs text-muted-foreground">
                  {((availableFunds / job.deposit_amount) * 100).toFixed(1)}% of deposit
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {job.cards?.filter((card) => card.status === "active").length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{job.customer?.name}</span>
                </div>
                {job.customer?.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{job.customer.email}</span>
                  </div>
                )}
                {job.customer?.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{job.customer.phone}</span>
                  </div>
                )}
                {job.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Started on {formatDate(job.start_date)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Vendors</h3>
                  {job.vendors && job.vendors.length > 0 ? (
                    <div className="space-y-2">
                      {job.vendors.map((vendor) => (
                        <div key={vendor.id} className="text-sm">
                          {vendor.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No vendors assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>All transactions for this job</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>All cards issued for this job</CardDescription>
            </CardHeader>
            <CardContent>
              {!job.cards || job.cards.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No cards found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                    <div>Card Number</div>
                    <div>Issued Date</div>
                    <div>Status</div>
                    <div className="text-right">Available Amount</div>
                  </div>
                  {job.cards.map((card) => (
                    <div key={card.id} className="grid grid-cols-4 gap-4 p-4 border-t items-center">
                      <div>
                        {card.card_number
                          ? `**** **** **** ${card.card_number.slice(-4)}`
                          : "Card number not available"}
                      </div>
                      <div>{formatDate(card.issued_at)}</div>
                      <div>
                        <Badge className={getStatusColor(card.status)}>{card.status}</Badge>
                      </div>
                      <div className="text-right font-medium">{formatCurrency(card.available_amount)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
