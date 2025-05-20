"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink, Plus, Search } from "lucide-react"
import type { Job, Transaction } from "@/lib/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardContentProps {
  jobs: Job[]
  transactions: Transaction[]
}

export default function DashboardContent({ jobs, transactions }: DashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const activeJobs = jobs.filter((job) => job.status === "active")
  const pendingJobs = jobs.filter((job) => job.status === "pending")
  const completedJobs = jobs.filter((job) => job.status === "completed")

  const filteredJobs = activeJobs.filter(
    (job) =>
      job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const recentTransactions = transactions.slice(0, 5)

  const totalDeposits = jobs.reduce((sum, job) => sum + job.deposit_amount, 0)
  const totalSpent = jobs.reduce((sum, job) => sum + job.spent_amount, 0)
  const availableFunds = totalDeposits - totalSpent

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDeposits)}</div>
            <p className="text-xs text-muted-foreground">Across {jobs.length} jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalDeposits) * 100).toFixed(1)}% of deposits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(availableFunds)}</div>
            <p className="text-xs text-muted-foreground">
              {((availableFunds / totalDeposits) * 100).toFixed(1)}% of deposits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingJobs.length} pending, {completedJobs.length} completed
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ongoing Jobs</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search jobs..."
                    className="w-[150px] sm:w-[200px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button asChild>
                  <Link href="/jobs/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Job
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No active jobs found</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium leading-none">{job.name}</p>
                        <p className="text-sm text-muted-foreground">{job.customer?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View job details</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
              {filteredJobs.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/jobs">
                      View all jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions across all jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="space-y-4 mt-4">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {transaction.type === "deposit"
                              ? "Deposit"
                              : transaction.type === "expense"
                                ? "Expense"
                                : "Refund"}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p
                          className={`text-sm font-medium ${
                            transaction.type === "deposit"
                              ? "text-green-600"
                              : transaction.type === "expense"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : transaction.type === "expense" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {recentTransactions.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link href="/transactions">
                        View all transactions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
