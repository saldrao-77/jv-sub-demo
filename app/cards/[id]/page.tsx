"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Eye, EyeOff, LinkIcon, Receipt, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Update the cardsData array to separate name and role
const cardsData = [
  {
    id: "1",
    jobId: "1",
    jobName: "Bathroom Renovation",
    customer: "Sarah Johnson",
    vendor: "Home Depot",
    cardNumber: "4242 4242 4242 4589",
    expiryDate: "06/25",
    cvv: "123",
    billingZip: "94105",
    issuedDate: "May 19, 2025",
    initialAmount: 850,
    remainingAmount: 850,
    status: "active",
    issuedTo: "John Smith",
    role: "Contractor",
    transactions: [],
  },
  {
    id: "2",
    jobId: "2",
    jobName: "Kitchen Remodel",
    customer: "Michael Chen",
    vendor: "Lowe's, Home Depot",
    cardNumber: "4242 4242 4242 7823",
    expiryDate: "06/25",
    cvv: "456",
    billingZip: "60611",
    issuedDate: "May 13, 2025",
    initialAmount: 1200,
    remainingAmount: 450,
    status: "active",
    issuedTo: "Alex Wong",
    role: "Foreman",
    transactions: [
      {
        id: "t1",
        date: "May 15, 2025",
        vendor: "Lowe's",
        amount: 750,
        description: "Kitchen cabinets and countertops",
        receiptSubmitted: true,
      },
    ],
  },
  {
    id: "3",
    jobId: "3",
    jobName: "Deck Construction",
    customer: "Robert Garcia",
    vendor: "Home Depot, Ace Hardware",
    cardNumber: "4242 4242 4242 3456",
    expiryDate: "06/25",
    cvv: "789",
    billingZip: "10001",
    issuedDate: "May 19, 2025",
    initialAmount: 750,
    remainingAmount: 750,
    status: "active",
    issuedTo: "Carlos Rodriguez",
    role: "Carpenter",
    transactions: [],
  },
  {
    id: "4",
    jobId: "5",
    jobName: "Patio Installation",
    customer: "David Wilson",
    vendor: "Home Depot, Lowe's",
    cardNumber: "4242 4242 4242 9012",
    expiryDate: "05/25",
    cvv: "987",
    billingZip: "77002",
    issuedDate: "Apr 30, 2025",
    initialAmount: 950,
    remainingAmount: 0,
    status: "used",
    issuedTo: "Mike Johnson",
    role: "Landscaper",
    transactions: [
      {
        id: "t2",
        date: "May 2, 2025",
        vendor: "Home Depot",
        amount: 950,
        description: "Patio materials and pavers",
        receiptSubmitted: false,
      },
    ],
  },
  {
    id: "5",
    jobId: "6",
    jobName: "Garage Conversion",
    customer: "Emily Rodriguez",
    vendor: "Home Depot, Menards",
    cardNumber: "4242 4242 4242 5678",
    expiryDate: "05/25",
    cvv: "654",
    billingZip: "90210",
    issuedDate: "Apr 23, 2025",
    initialAmount: 2000,
    remainingAmount: 0,
    status: "used",
    issuedTo: "David Lee",
    role: "Project Manager",
    transactions: [
      {
        id: "t3",
        date: "Apr 25, 2025",
        vendor: "Home Depot",
        amount: 1200,
        description: "Drywall, insulation, and framing",
        receiptSubmitted: true,
      },
      {
        id: "t4",
        date: "Apr 27, 2025",
        vendor: "Menards",
        amount: 800,
        description: "Electrical supplies and fixtures",
        receiptSubmitted: false,
      },
    ],
  },
  {
    id: "6",
    jobId: "7",
    jobName: "Fence Installation",
    customer: "Thomas Brown",
    vendor: "Home Depot",
    cardNumber: "4242 4242 4242 1234",
    expiryDate: "05/25",
    cvv: "321",
    billingZip: "30303",
    issuedDate: "Apr 17, 2025",
    initialAmount: 600,
    remainingAmount: 0,
    status: "expired",
    issuedTo: "James Wilson",
    role: "Installer",
    transactions: [
      {
        id: "t5",
        date: "Apr 18, 2025",
        vendor: "Home Depot",
        amount: 600,
        description: "Fence posts and panels",
        receiptSubmitted: true,
      },
    ],
  },
]

export default function CardDetailPage({ params }: { params: { id: string } }) {
  console.log("Card ID from params:", params.id)
  const [cardDetails, setCardDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFullCardNumber, setShowFullCardNumber] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch card details
    setTimeout(() => {
      const card = cardsData.find((card) => card.id === params.id)
      setCardDetails(card || null)
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-6 md:py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading card details...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!cardDetails) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-6 md:py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Card not found</div>
          </div>
        </main>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
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

  // Update the handleTextCard function to include the separated role and full card number
  const handleTextCard = () => {
    if (!cardDetails) return

    const cardUrl = `${window.location.origin}/cards/${cardDetails.id}`

    const message = `JobVault Virtual Card Details:
Job: ${cardDetails.jobName}
Customer: ${cardDetails.customer}
Card #: ${cardDetails.cardNumber}
Funds: $${cardDetails.remainingAmount.toFixed(2)}
Vendor(s): ${cardDetails.vendor}
Expiration: ${cardDetails.expiryDate}
CVV: ${cardDetails.cvv}
Billing Zip: ${cardDetails.billingZip}
Issued To: ${cardDetails.issuedTo}
Role: ${cardDetails.role}

Card Link: ${cardUrl}

This is a materials-only card that can only be used at the specified vendors.

To submit receipts, text them to +18886395525`

    window.location.href = `sms:?&body=${encodeURIComponent(message)}`
  }

  // Update the handleEmailCard function to include the separated role and full card number
  const handleEmailCard = () => {
    if (!cardDetails) return

    const cardUrl = `${window.location.origin}/cards/${cardDetails.id}`

    const subject = "JobVault Virtual Card Details"
    const body = `JobVault Virtual Card Details:

Job: ${cardDetails.jobName}
Customer: ${cardDetails.customer}
Card #: ${cardDetails.cardNumber}
Funds: $${cardDetails.remainingAmount.toFixed(2)}
Vendor(s): ${cardDetails.vendor}
Expiration: ${cardDetails.expiryDate}
CVV: ${cardDetails.cvv}
Billing Zip: ${cardDetails.billingZip}
Issued To: ${cardDetails.issuedTo}
Role: ${cardDetails.role}

Card Link: ${cardUrl}

This is a materials-only card that can only be used at the specified vendors.

To submit receipts, text them to +18886395525

Thank you,
JobVault Team`

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleCopyLink = () => {
    const cardUrl = `${window.location.origin}/cards/${cardDetails.id}`
    navigator.clipboard.writeText(cardUrl)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="mb-6">
          <Link
            href="/cards"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Cards
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Card Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{cardDetails.jobName}</h1>
              <div className="flex items-center mt-1">
                <p className="text-muted-foreground">Card for {cardDetails.customer}</p>
                <span className="mx-2">•</span>
                {getStatusBadge(cardDetails.status)}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm mb-1">Total Spent</h3>
                    <p className="text-2xl font-bold">
                      ${(cardDetails.initialAmount - cardDetails.remainingAmount).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">of ${cardDetails.initialAmount.toFixed(2)}</p>
                  </div>
                  <div className="h-5 w-5 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Virtual Card</CardTitle>
                <CardDescription>Materials-only virtual card details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl bg-gradient-to-r from-blue-dark to-blue p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs opacity-80">MATERIALS ONLY</div>
                      <div className="mt-4 text-xl font-bold flex items-center">
                        {showFullCardNumber
                          ? cardDetails.cardNumber
                          : cardDetails.cardNumber.replace(/\d{4} \d{4} \d{4}/, "•••• •••• ••••")}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-white hover:text-white/80 p-0"
                          onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                        >
                          {showFullCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-sm font-medium">Vendor Locked</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-80">VALID THRU</div>
                      <div className="text-sm font-medium">{cardDetails.expiryDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80">AVAILABLE</div>
                      <div className="text-lg font-bold">${cardDetails.remainingAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Amount:</span>
                    <span className="font-medium">${cardDetails.initialAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent:</span>
                    <span className="font-medium">
                      ${(cardDetails.initialAmount - cardDetails.remainingAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium text-blue">${cardDetails.remainingAmount.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Usage:</span>
                      <span className="font-medium">
                        {Math.round((1 - cardDetails.remainingAmount / cardDetails.initialAmount) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(1 - cardDetails.remainingAmount / cardDetails.initialAmount) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="rounded-md bg-blue/10 p-4">
                  <div className="flex">
                    <ShieldCheck className="h-5 w-5 text-blue mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Materials-Only Card</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This card can only be used at {cardDetails.vendor} for purchasing materials.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>History of all transactions for this card</CardDescription>
              </CardHeader>
              <CardContent>
                {cardDetails.transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cardDetails.transactions.map((transaction: any, index: number) => (
                        <TableRow key={transaction.id || index}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.vendor}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-right text-red-400">-${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {transaction.receiptSubmitted ? (
                              <Badge variant="outline" className="bg-green-900/20 text-green-400">
                                Submitted
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline" asChild>
                                <Link href="/receipt">
                                  <Receipt className="mr-1 h-3 w-3" />
                                  Submit
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground p-4">No transactions yet</div>
                )}
              </CardContent>
              {cardDetails.status === "active" && (
                <CardFooter>
                  <Link href="/receipt" className="w-full">
                    <button
                      style={{ backgroundColor: "#0066FF", color: "white" }}
                      className="w-full flex items-center justify-center rounded-md py-2 px-4 font-medium hover:bg-blue-dark"
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Submit Receipt
                    </button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Card Number</div>
                  <div className="flex items-center">
                    {showFullCardNumber
                      ? cardDetails.cardNumber
                      : cardDetails.cardNumber.replace(/\d{4} \d{4} \d{4}/, "•••• •••• ••••")}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-0"
                      onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                    >
                      {showFullCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Expiry Date</div>
                  <div>{cardDetails.expiryDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">CVV</div>
                  <div>{cardDetails.cvv}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Billing Zip</div>
                  <div>{cardDetails.billingZip}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Issued Date</div>
                  <div>{cardDetails.issuedDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Issued To</div>
                  <div>{cardDetails.issuedTo}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Role</div>
                  <div>{cardDetails.role}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{getStatusBadge(cardDetails.status)}</div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Approved Vendors</div>
                  <div>{cardDetails.vendor}</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Share Card Details</div>
                  <Button variant="outline" className="w-full justify-start text-left" onClick={handleTextCard}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Text card details
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left" onClick={handleEmailCard}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Email card details
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left" onClick={handleCopyLink}>
                    <LinkIcon className="h-5 w-5 mr-2" />
                    {copySuccess ? "Link copied!" : "Copy link to card"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Job Name</div>
                  <div>{cardDetails.jobName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Customer</div>
                  <div>{cardDetails.customer}</div>
                </div>
                <Separator />
                <Link href={`/jobs/${cardDetails.jobId}`} className="w-full">
                  <button
                    style={{ backgroundColor: "#0066FF", color: "white" }}
                    className="w-full flex items-center justify-center rounded-md py-2 px-4 font-medium hover:bg-blue-dark"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Job Details
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
