import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getJob } from "@/lib/actions"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <Suspense fallback={<div>Loading...</div>}>
          <JobDetail id={params.id} />
        </Suspense>
      </main>
    </div>
  )
}

async function JobDetail({ id }: { id: string }) {
  const job = await getJob(id)

  if (!job) {
    notFound()
  }

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
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(job.deposit_amount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(job.spent_amount)}</div>
            <p className="text-xs text-muted-foreground">
              {job.deposit_amount > 0
                ? `${((job.spent_amount / job.deposit_amount) * 100).toFixed(1)}% of deposit`
                : "0% of deposit"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(job.deposit_amount - job.spent_amount)}</div>
            <p className="text-xs text-muted-foreground">
              {job.deposit_amount > 0
                ? `${(((job.deposit_amount - job.spent_amount) / job.deposit_amount) * 100).toFixed(1)}% of deposit`
                : "0% of deposit"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {job.cards?.filter((card) => card.status === "active").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="font-medium">Name</div>
                  <div>{job.customer?.name}</div>
                </div>
                {job.customer?.email && (
                  <div>
                    <div className="font-medium">Email</div>
                    <div>{job.customer.email}</div>
                  </div>
                )}
                {job.customer?.phone && (
                  <div>
                    <div className="font-medium">Phone</div>
                    <div>{job.customer.phone}</div>
                  </div>
                )}
                {job.address && (
                  <div>
                    <div className="font-medium">Address</div>
                    <div>{job.address}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <div>
                    <div className="font-medium">Description</div>
                    <div className="text-sm text-muted-foreground">{job.description}</div>
                  </div>
                )}
                <div>
                  <div className="font-medium">Vendors</div>
                  {job.vendors && job.vendors.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      {job.vendors.map((vendor) => (
                        <div key={vendor.id} className="text-sm">
                          {vendor.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No vendors assigned</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>All transactions for this job</CardDescription>
            </CardHeader>
            <CardContent>
              {!job.transactions || job.transactions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                    <div>Date</div>
                    <div>Type</div>
                    <div>Vendor</div>
                    <div className="text-right">Amount</div>
                  </div>
                  {job.transactions.map((transaction) => (
                    <div key={transaction.id} className="grid grid-cols-4 gap-4 p-4 border-t items-center">
                      <div>{formatDate(transaction.date)}</div>
                      <div>
                        <Badge className={getStatusColor(transaction.type)}>{transaction.type}</Badge>
                      </div>
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

        <TabsContent value="cards" className="mt-4">
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
