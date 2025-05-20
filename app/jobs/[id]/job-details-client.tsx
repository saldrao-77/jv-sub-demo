"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, CreditCard, Receipt, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { issueVirtualCard } from "@/app/actions/jobs"

interface JobDetailsClientProps {
  jobDetails: any // We'll use any for simplicity, but ideally this would be properly typed
}

export default function JobDetailsClient({ jobDetails }: JobDetailsClientProps) {
  const [isCardIssued, setIsCardIssued] = useState(jobDetails.cards && jobDetails.cards.length > 0)

  const handleIssueCard = async () => {
    const result = await issueVirtualCard(jobDetails.id)
    if (result.success) {
      setIsCardIssued(true)
    }
  }

  // Format date from ISO string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
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
              <h1 className="text-2xl font-bold tracking-tight">{jobDetails.name}</h1>
              <p className="text-muted-foreground">Job for {jobDetails.customer?.name}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Materials Deposit Details</CardTitle>
                <CardDescription>Materials-only deposit for this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Amount</div>
                    <div className="text-lg font-semibold">${jobDetails.deposit_amount?.toFixed(2)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Vendor</div>
                    <div className="text-lg font-semibold">{jobDetails.vendors?.join(", ") || "None specified"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                    <div className="inline-flex items-center rounded-full bg-green-900/20 px-2.5 py-0.5 text-sm font-medium text-green-400">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      {jobDetails.status}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-md bg-blue/10 p-4">
                  <div className="flex">
                    <CheckCircle2 className="h-5 w-5 text-blue mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Materials funds received for {jobDetails.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Funds can only be used at {jobDetails.vendors?.join(", ") || "approved vendors"} and will expire
                        in 30 days if unused.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isCardIssued || jobDetails.status !== "Deposit paid"}
                      className="bg-blue hover:bg-blue-dark"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {isCardIssued ? "Card Issued" : "Get Virtual Materials Card"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Issue Virtual Card</DialogTitle>
                      <DialogDescription>
                        This card can only be used at approved vendors for up to $
                        {jobDetails.deposit_amount?.toFixed(2)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="rounded-md bg-blue/10 p-3 text-sm">
                        <p className="font-medium">Materials-Only Card</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          This card is for purchasing materials only, in compliance with California law.
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vendor:</span>
                          <span className="font-medium">{jobDetails.vendors?.join(", ") || "Approved vendors"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Amount Limit:</span>
                          <span className="font-medium">${jobDetails.deposit_amount?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expiration:</span>
                          <span className="font-medium">30 days</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleIssueCard} className="bg-blue hover:bg-blue-dark">
                        Issue Virtual Card
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            {isCardIssued && (
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Card</CardTitle>
                  <CardDescription>Use this card to purchase materials at approved vendors</CardDescription>
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
                        <div className="text-lg font-bold">${jobDetails.deposit_amount?.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-secondary p-4 text-center">
                    <p className="font-medium">
                      Usable only at approved vendors for up to ${jobDetails.deposit_amount?.toFixed(2)}
                    </p>
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
                  <div>{jobDetails.customer?.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{jobDetails.customer?.email}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div>{jobDetails.customer?.phone}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobDetails.transactions?.map((transaction: any, index: number) => (
                    <div className="flex" key={transaction.id}>
                      <div className="mr-4 flex flex-col items-center">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            transaction.type === "Deposit" || transaction.type === "Card Issued"
                              ? "bg-green-900/20 text-green-400"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {transaction.type === "Deposit" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : transaction.type === "Card Issued" ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <Receipt className="h-4 w-4" />
                          )}
                        </div>
                        {index < jobDetails.transactions.length - 1 && <div className="h-full w-px bg-border"></div>}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.type === "Deposit"
                            ? "Payment Received"
                            : transaction.type === "Card Issued"
                              ? "Virtual Card Issued"
                              : transaction.type === "Purchase"
                                ? "Materials Purchased"
                                : transaction.type}
                        </div>
                        <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                      </div>
                    </div>
                  ))}

                  {!jobDetails.transactions?.some((t: any) => t.type === "Card Issued") && (
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="h-full w-px bg-border"></div>
                      </div>
                      <div>
                        <div className="font-medium">Virtual Card Issued</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  )}

                  {!jobDetails.transactions?.some((t: any) => t.type === "Purchase") && (
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                          <Receipt className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Materials Purchased</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
