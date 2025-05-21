"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for jobs
const jobsData = [
  {
    id: "1",
    name: "Bathroom Renovation",
    customer: "Sarah Johnson",
    address: "123 Main St, San Francisco, CA 94105",
    phone: "(415) 555-1234",
    email: "sarah.johnson@example.com",
    status: "in-progress",
    startDate: "May 15, 2025",
    estimatedEndDate: "June 15, 2025",
    depositAmount: 850,
    depositPaid: true,
    depositDate: "May 10, 2025",
    totalAmount: 8500,
    description: "Complete renovation of master bathroom including new shower, bathtub, vanity, toilet, and tile work.",
    notes: "Customer prefers work to be done between 9am-5pm on weekdays only.",
    cards: [
      {
        id: "1",
        vendor: "Home Depot",
        amount: 850,
        remainingAmount: 850,
        issuedDate: "May 19, 2025",
        status: "active",
      },
    ],
    transactions: [
      {
        id: "t1",
        date: "May 10, 2025",
        description: "Deposit payment",
        amount: 850,
        type: "deposit",
      },
    ],
  },
  {
    id: "2",
    name: "Kitchen Remodel",
    customer: "Michael Chen",
    address: "456 Oak St, Chicago, IL 60611",
    phone: "(312) 555-6789",
    email: "michael.chen@example.com",
    status: "in-progress",
    startDate: "May 5, 2025",
    estimatedEndDate: "July 5, 2025",
    depositAmount: 1200,
    depositPaid: true,
    depositDate: "Apr 30, 2025",
    totalAmount: 12000,
    description: "Full kitchen remodel including new cabinets, countertops, backsplash, sink, and appliances.",
    notes: "Customer has requested to save and reinstall existing light fixtures.",
    cards: [
      {
        id: "2",
        vendor: "Lowe's, Home Depot",
        amount: 1200,
        remainingAmount: 450,
        issuedDate: "May 6, 2025",
        status: "active",
      },
    ],
    transactions: [
      {
        id: "t2",
        date: "Apr 30, 2025",
        description: "Deposit payment",
        amount: 1200,
        type: "deposit",
      },
      {
        id: "t3",
        date: "May 15, 2025",
        description: "Kitchen cabinets and countertops",
        amount: 750,
        type: "expense",
        cardId: "2",
        receiptSubmitted: true,
      },
    ],
  },
  {
    id: "3",
    name: "Deck Construction",
    customer: "Robert Garcia",
    address: "789 Pine St, New York, NY 10001",
    phone: "(212) 555-4321",
    email: "robert.garcia@example.com",
    status: "in-progress",
    startDate: "May 20, 2025",
    estimatedEndDate: "June 10, 2025",
    depositAmount: 750,
    depositPaid: true,
    depositDate: "May 15, 2025",
    totalAmount: 7500,
    description: "Construction of a 20' x 15' wooden deck with railings and stairs.",
    notes: "Customer has requested pressure-treated lumber for durability.",
    cards: [
      {
        id: "3",
        vendor: "Home Depot, Ace Hardware",
        amount: 750,
        remainingAmount: 750,
        issuedDate: "May 19, 2025",
        status: "active",
      },
    ],
    transactions: [
      {
        id: "t4",
        date: "May 15, 2025",
        description: "Deposit payment",
        amount: 750,
        type: "deposit",
      },
    ],
  },
  {
    id: "4",
    name: "Basement Finishing",
    customer: "Jennifer Lee",
    address: "101 Elm St, Boston, MA 02108",
    phone: "(617) 555-8765",
    email: "jennifer.lee@example.com",
    status: "scheduled",
    startDate: "June 1, 2025",
    estimatedEndDate: "July 15, 2025",
    depositAmount: 1500,
    depositPaid: true,
    depositDate: "May 20, 2025",
    totalAmount: 15000,
    description: "Finishing 800 sq ft basement including framing, drywall, electrical, flooring, and a half bathroom.",
    notes: "Customer would like to include a small wet bar area if budget allows.",
    cards: [],
    transactions: [
      {
        id: "t5",
        date: "May 20, 2025",
        description: "Deposit payment",
        amount: 1500,
        type: "deposit",
      },
    ],
  },
  {
    id: "5",
    name: "Patio Installation",
    customer: "David Wilson",
    address: "202 Maple St, Houston, TX 77002",
    phone: "(713) 555-2468",
    email: "david.wilson@example.com",
    status: "completed",
    startDate: "Apr 15, 2025",
    estimatedEndDate: "May 1, 2025",
    completionDate: "May 3, 2025",
    depositAmount: 950,
    depositPaid: true,
    depositDate: "Apr 10, 2025",
    totalAmount: 9500,
    finalAmount: 9800,
    description: "Installation of a 24' x 18' concrete patio with stamped design and sealer.",
    notes: "Added additional 2' x 6' section at customer request (additional $300).",
    cards: [
      {
        id: "4",
        vendor: "Home Depot, Lowe's",
        amount: 950,
        remainingAmount: 0,
        issuedDate: "Apr 16, 2025",
        status: "used",
      },
    ],
    transactions: [
      {
        id: "t6",
        date: "Apr 10, 2025",
        description: "Deposit payment",
        amount: 950,
        type: "deposit",
      },
      {
        id: "t7",
        date: "May 2, 2025",
        description: "Patio materials and pavers",
        amount: 950,
        type: "expense",
        cardId: "4",
        receiptSubmitted: false,
      },
      {
        id: "t8",
        date: "May 5, 2025",
        description: "Final payment",
        amount: 8850,
        type: "payment",
      },
    ],
  },
  {
    id: "6",
    name: "Garage Conversion",
    customer: "Emily Rodriguez",
    address: "303 Cedar St, Los Angeles, CA 90210",
    phone: "(310) 555-1357",
    email: "emily.rodriguez@example.com",
    status: "completed",
    startDate: "Apr 1, 2025",
    estimatedEndDate: "May 15, 2025",
    completionDate: "May 10, 2025",
    depositAmount: 2000,
    depositPaid: true,
    depositDate: "Mar 25, 2025",
    totalAmount: 20000,
    finalAmount: 20000,
    description:
      "Converting 2-car garage into a home office space including insulation, drywall, electrical, HVAC, and flooring.",
    notes: "Customer is very satisfied with the work and has referred two friends.",
    cards: [
      {
        id: "5",
        vendor: "Home Depot, Menards",
        amount: 2000,
        remainingAmount: 0,
        issuedDate: "Apr 2, 2025",
        status: "used",
      },
    ],
    transactions: [
      {
        id: "t9",
        date: "Mar 25, 2025",
        description: "Deposit payment",
        amount: 2000,
        type: "deposit",
      },
      {
        id: "t10",
        date: "Apr 25, 2025",
        description: "Drywall, insulation, and framing",
        amount: 1200,
        type: "expense",
        cardId: "5",
        receiptSubmitted: true,
      },
      {
        id: "t11",
        date: "Apr 27, 2025",
        description: "Electrical supplies and fixtures",
        amount: 800,
        type: "expense",
        cardId: "5",
        receiptSubmitted: false,
      },
      {
        id: "t12",
        date: "May 12, 2025",
        description: "Final payment",
        amount: 18000,
        type: "payment",
      },
    ],
  },
  {
    id: "7",
    name: "Fence Installation",
    customer: "Thomas Brown",
    address: "404 Birch St, Atlanta, GA 30303",
    phone: "(404) 555-9876",
    email: "thomas.brown@example.com",
    status: "completed",
    startDate: "Apr 10, 2025",
    estimatedEndDate: "Apr 20, 2025",
    completionDate: "Apr 22, 2025",
    depositAmount: 600,
    depositPaid: true,
    depositDate: "Apr 5, 2025",
    totalAmount: 6000,
    finalAmount: 6000,
    description: "Installation of 120 linear feet of 6' privacy fence with one gate.",
    notes: "Customer has requested to stain the fence themselves.",
    cards: [
      {
        id: "6",
        vendor: "Home Depot",
        amount: 600,
        remainingAmount: 0,
        issuedDate: "Apr 11, 2025",
        status: "expired",
      },
    ],
    transactions: [
      {
        id: "t13",
        date: "Apr 5, 2025",
        description: "Deposit payment",
        amount: 600,
        type: "deposit",
      },
      {
        id: "t14",
        date: "Apr 18, 2025",
        description: "Fence posts and panels",
        amount: 600,
        type: "expense",
        cardId: "6",
        receiptSubmitted: true,
      },
      {
        id: "t15",
        date: "Apr 25, 2025",
        description: "Final payment",
        amount: 5400,
        type: "payment",
      },
    ],
  },
]

export default function JobDetailPage({ params }: { params: { id: string } }) {
  console.log("JobDetailPage - params.id:", params.id)
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch job details
    setTimeout(() => {
      const job = jobsData.find((job) => job.id === params.id)
      setJobDetails(job || null)
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-6 md:py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading job details...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-6 md:py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Job not found</div>
          </div>
        </main>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 hover:text-blue-400">Scheduled</Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30 hover:text-yellow-400">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-900/20 text-green-400 hover:bg-green-900/30 hover:text-green-400">Completed</Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getCardStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-900/20 text-green-400 hover:bg-green-900/30 hover:text-green-400">Active</Badge>
        )
      case "used":
        return (
          <Badge className="bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 hover:text-purple-400">Used</Badge>
        )
      case "expired":
        return <Badge className="bg-gray-900/20 text-gray-400 hover:bg-gray-900/30 hover:text-gray-400">Expired</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleIssueNewCard = () => {
    console.log("Navigating to /cards/new with jobId:", jobDetails.id)
    window.location.href = `/cards/new?jobId=${jobDetails.id}`
  }

  const handleSubmitReceipt = () => {
    console.log("Navigating to /receipt with jobId:", jobDetails.id)
    window.location.href = `/receipt?jobId=${jobDetails.id}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Job Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{jobDetails.name}</h1>
              <div className="flex items-center mt-1">
                <p className="text-muted-foreground">Job for {jobDetails.customer}</p>
                <span className="mx-2">•</span>
                {getStatusBadge(jobDetails.status)}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{jobDetails.description}</p>
                {jobDetails.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium">Notes:</h4>
                    <p className="text-muted-foreground">{jobDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total Amount</h4>
                    <p className="text-2xl font-bold">${jobDetails.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Deposit</h4>
                    <p className="text-2xl font-bold">${jobDetails.depositAmount.toFixed(2)}</p>
                    {jobDetails.depositPaid && (
                      <Badge variant="outline" className="mt-1 bg-green-900/10 text-green-500">
                        Paid on {jobDetails.depositDate}
                      </Badge>
                    )}
                  </div>
                </div>

                {jobDetails.status === "completed" && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Final Amount</h4>
                    <p className="text-2xl font-bold">${jobDetails.finalAmount.toFixed(2)}</p>
                    {jobDetails.finalAmount !== jobDetails.totalAmount && (
                      <p className="text-sm text-muted-foreground">
                        {jobDetails.finalAmount > jobDetails.totalAmount
                          ? `$${(jobDetails.finalAmount - jobDetails.totalAmount).toFixed(2)} above estimate`
                          : `$${(jobDetails.totalAmount - jobDetails.finalAmount).toFixed(2)} below estimate`}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Virtual Cards</CardTitle>
                  <CardDescription>Materials-only virtual cards issued for this job</CardDescription>
                </div>
                {jobDetails.depositPaid && jobDetails.status !== "completed" && (
                  <Button className="bg-blue hover:bg-blue-dark" onClick={handleIssueNewCard}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Issue New Card
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {jobDetails.cards.length > 0 ? (
                  <div className="space-y-4">
                    {jobDetails.cards.map((card: any) => (
                      <div
                        key={card.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="space-y-1 mb-2 sm:mb-0">
                          <div className="flex items-center">
                            <h4 className="font-medium">{card.vendor}</h4>
                            <span className="mx-2">•</span>
                            {getCardStatusBadge(card.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">Issued on {card.issuedDate}</p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <div className="font-medium">
                            ${card.remainingAmount.toFixed(2)}{" "}
                            <span className="text-sm text-muted-foreground">of ${card.amount.toFixed(2)}</span>
                          </div>
                          <Link href={`/cards/${card.id}`} className="text-sm text-blue hover:underline mt-1">
                            View card details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">No cards issued yet</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>History of all financial transactions for this job</CardDescription>
                </div>
                {jobDetails.status !== "completed" && (
                  <Button className="bg-blue hover:bg-blue-dark" onClick={handleSubmitReceipt}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Submit Receipt
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobDetails.transactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {transaction.type === "deposit" && (
                            <Badge variant="outline" className="bg-blue-900/10 text-blue-500">
                              Deposit
                            </Badge>
                          )}
                          {transaction.type === "payment" && (
                            <Badge variant="outline" className="bg-green-900/10 text-green-500">
                              Payment
                            </Badge>
                          )}
                          {transaction.type === "expense" && (
                            <Badge variant="outline" className="bg-red-900/10 text-red-500">
                              Expense
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              transaction.type === "expense"
                                ? "text-red-400"
                                : transaction.type === "deposit" || transaction.type === "payment"
                                  ? "text-green-400"
                                  : ""
                            }
                          >
                            {transaction.type === "expense" ? "-" : "+"}${transaction.amount.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div>{jobDetails.customer}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div>{jobDetails.address}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div>{jobDetails.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{jobDetails.email}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{getStatusBadge(jobDetails.status)}</div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                  <div>{jobDetails.startDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Estimated Completion</div>
                  <div>{jobDetails.estimatedEndDate}</div>
                </div>
                {jobDetails.status === "completed" && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Actual Completion</div>
                    <div>{jobDetails.completionDate}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {jobDetails.depositPaid && jobDetails.status !== "completed" && (
                  <Button className="w-full bg-blue hover:bg-blue-dark" onClick={handleIssueNewCard}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Issue New Card
                  </Button>
                )}
                {jobDetails.status !== "completed" && (
                  <Button className="w-full bg-blue hover:bg-blue-dark" onClick={handleSubmitReceipt}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Submit Receipt
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
