"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, CreditCard, Receipt, ShieldCheck, Clock, ImageIcon, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [isCardIssued, setIsCardIssued] = useState(false)

  const handleIssueCard = () => {
    setIsCardIssued(true)
  }

  // Add job progress state
  const [jobProgress, setJobProgress] = useState(33)

  // Sample cards data
  const cards = [
    {
      id: "1", // Changed from card1 to 1
      cardNumber: "•••• •••• •••• 4589",
      vendor: "Home Depot",
      amount: 850,
      expiryDate: "06/25",
      status: "active",
    },
  ]

  // Add state for payment link dialog
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [paymentLink, setPaymentLink] = useState("")
  const [linkCopied, setCopySuccess] = useState(false)

  // Add handlers for the dialog
  const handleResendPaymentLink = () => {
    // Generate a random payment link that points to the actual payment page
    const randomId = Math.random().toString(36).substring(2, 10)
    setPaymentLink(`${window.location.origin}/payment/${randomId}`)
    setShowShareDialog(true)
  }

  const handleEmailLink = () => {
    const subject = "Your Materials Deposit Payment Link"
    const body = `Hello,\n\nHere is your secure payment link for the materials deposit: ${paymentLink}\n\nThis link will allow you to securely pay for the materials needed for your project.\n\nThank you,\nJobVault Team`

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleTextLink = () => {
    const message = `Your materials deposit payment link: ${paymentLink}`
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bathroom Renovation</h1>
              <p className="text-muted-foreground">Job for Sarah Johnson</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Status & Timeline</CardTitle>
                <CardDescription>Track the progress of your job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{jobProgress}%</span>
                  </div>
                  <Progress value={jobProgress} className="h-2" />
                </div>

                <div className="rounded-md bg-blue/10 p-4">
                  <div className="flex">
                    <ShieldCheck className="h-5 w-5 text-blue mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Materials funds received for Bathroom Renovation</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Funds can only be used at Home Depot and will expire in 30 days if unused.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20 text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="h-full w-px bg-green-400/50"></div>
                  </div>
                  <div className="pb-8">
                    <div className="text-lg font-medium">Payment Link Created</div>
                    <div className="text-muted-foreground">May 17, 2025 • 9:15 AM</div>
                    <div className="mt-2 text-sm">Secure payment link sent to customer</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20 text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="h-full w-px bg-green-400/50"></div>
                  </div>
                  <div className="pb-8">
                    <div className="text-lg font-medium">Payment Received</div>
                    <div className="text-muted-foreground">May 18, 2025 • 10:24 AM</div>
                    <div className="mt-2 text-sm">Customer paid the materials deposit</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    {isCardIssued ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20 text-green-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10 text-blue">
                        <Clock className="h-5 w-5" />
                      </div>
                    )}
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div className="pb-8">
                    <div className="text-lg font-medium">Virtual Card Issued</div>
                    <div className="text-muted-foreground">
                      {isCardIssued ? "May 19, 2025 • 10:29 AM" : "In Progress"}
                    </div>
                    <div className="mt-2 text-sm">Virtual card issued for use at approved vendors</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <Receipt className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">Materials Purchased</div>
                    <div className="text-muted-foreground">Pending</div>
                    <div className="mt-2 text-sm">Materials purchased using the virtual card</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History Card - Moved to left side */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions related to this job</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-md bg-secondary/50">
                    <div className="mr-4 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">Deposit</div>
                        <div className="text-green-400">$850.00</div>
                      </div>
                      <div className="text-sm text-muted-foreground">May 18, 2025</div>
                      <div className="text-sm mt-1">Vendor: -</div>
                    </div>
                  </div>

                  {/* Added receipt transaction */}
                  <div className="flex items-start p-3 rounded-md bg-secondary/50">
                    <div className="mr-4 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-900/20 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">Receipt Submitted</div>
                        <div className="text-purple-400">$250.00</div>
                      </div>
                      <div className="text-sm text-muted-foreground">May 19, 2025</div>
                      <div className="text-sm mt-1">Vendor: Home Depot</div>
                      <div className="relative group">
                        <button className="text-xs text-blue mt-1 flex items-center">
                          <ImageIcon className="h-3 w-3 mr-1" /> View Receipt
                        </button>
                        <div className="absolute z-50 invisible group-hover:visible bg-background border border-border rounded-md p-2 shadow-lg -left-20 mt-1">
                          <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20at%207.23.45%E2%80%AFPM-1gnHX7aWXTg0I6w0jonH6cjRvaNAQj.png"
                            alt="Receipt"
                            className="w-48"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isCardIssued && (
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Card</CardTitle>
                  <CardDescription>Use this card to purchase materials at Home Depot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl bg-gradient-to-r from-blue-dark to-blue p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs opacity-80">MATERIALS ONLY</div>
                        <div className="mt-4 text-xl font-bold">•••• •••• •••• 4589</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-sm font-medium">Vendor Locked</span>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-80">VALID THRU</div>
                        <div className="text-sm font-medium">06/25</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">AVAILABLE</div>
                        <div className="text-lg font-bold">$850.00</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-secondary p-4 text-center">
                    <p className="font-medium">Usable only at Home Depot for up to $850.00</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tap to pay with your phone or use the card details above
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Receipt className="mr-2 h-4 w-4" />
                    Text Receipt After Purchase
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div>Sarah Johnson</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>sarah.johnson@example.com</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div>(555) 123-4567</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Property Address</div>
                  <div>123 Oak St, San Francisco, CA</div>
                </div>
              </CardContent>
            </Card>

            {/* Materials Deposit Card - Moved to right side */}
            <Card>
              <CardHeader>
                <CardTitle>Materials Deposit Details</CardTitle>
                <CardDescription>Materials-only deposit for this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Amount</div>
                    <div className="text-lg font-semibold">$850.00</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Vendor</div>
                    <div className="text-lg font-semibold">Home Depot</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="inline-flex items-center rounded-full bg-green-900/20 px-2.5 py-0.5 text-sm font-medium text-green-400">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Funds Received
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards Tile - New */}
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Virtual cards associated with this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.length > 0 ? (
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <Link href={`/cards/${card.id}`} key={card.id}>
                        <div className="rounded-md border p-3 hover:bg-secondary/50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-blue" />
                              <div>
                                <div className="font-medium">{card.cardNumber}</div>
                                <div className="text-sm text-muted-foreground">{card.vendor}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${card.amount.toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">Exp: {card.expiryDate}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">No cards issued yet</div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {" "}
                {/* Increased spacing between buttons */}
                <Link href={`/cards/new?jobId=${params.id}`} className="w-full block">
                  <Button style={{ backgroundColor: "#0066FF", color: "white" }} className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Issue New Card
                  </Button>
                </Link>
                <Link href={`/receipt?jobId=${params.id}`} className="w-full block">
                  <Button style={{ backgroundColor: "#0066FF", color: "white" }} className="w-full">
                    <Receipt className="mr-2 h-4 w-4" />
                    Submit Receipt
                  </Button>
                </Link>
                <Button
                  style={{ backgroundColor: "#0066FF", color: "white" }}
                  className="w-full"
                  onClick={handleResendPaymentLink}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Resend Payment Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* Share Payment Link Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-2xl bg-background border-border p-6 w-[95vw] md:w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Share your payment link</DialogTitle>
            <DialogDescription>
              Share this secure payment link with your customer to collect the materials deposit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="font-medium">Copy link</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-md border border-input bg-secondary px-3 py-2 text-sm">
                  {paymentLink}
                </div>
                <Button
                  onClick={copyToClipboard}
                  className={cn("bg-blue hover:bg-blue-dark", linkCopied && "bg-green-600 hover:bg-green-700")}
                >
                  {linkCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Email or text</div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-secondary border-secondary"
                  onClick={handleEmailLink}
                >
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
                  Email to customer
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-secondary border-secondary"
                  onClick={handleTextLink}
                >
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
                  Text to customer
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                className="mt-3 sm:mt-0 bg-secondary border-secondary"
                onClick={() => setShowShareDialog(false)}
              >
                Cancel
              </Button>
              <Button type="button" className="bg-blue hover:bg-blue-dark" onClick={() => setShowShareDialog(false)}>
                Done
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
