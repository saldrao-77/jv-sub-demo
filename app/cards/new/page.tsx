"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, LinkIcon, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { LegalNotice } from "@/components/legal-notice"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Sample data for jobs with deposits paid but no cards issued yet
const availableJobs = [
  {
    id: "1",
    jobName: "Bathroom Renovation",
    customer: "Sarah Johnson",
    depositAmount: 850,
    depositDate: "May 18, 2025",
    vendors: ["Home Depot"],
  },
  {
    id: "4",
    jobName: "Basement Finishing",
    customer: "Jennifer Lee",
    depositAmount: 1500,
    depositDate: "May 19, 2025",
    vendors: ["Home Depot", "Menards"],
  },
]

// Sample data for all vendors
const allVendors = [
  { id: "1", name: "Home Depot" },
  { id: "2", name: "Lowe's" },
  { id: "3", name: "Ace Hardware" },
  { id: "4", name: "Menards" },
  { id: "5", name: "84 Lumber" },
]

export default function NewCardPage() {
  const router = useRouter()
  const [selectedJob, setSelectedJob] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [cardAmount, setCardAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCardDialog, setShowCardDialog] = useState(false)
  const [newCard, setNewCard] = useState<any>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  // Add issuedTo state
  const [issuedTo, setIssuedTo] = useState("")
  const [role, setRole] = useState("")

  // Get job details based on selected job
  const jobDetails = availableJobs.find((job) => job.id === selectedJob)

  // Handle vendor selection
  const handleVendorChange = (vendorName: string) => {
    if (selectedVendors.includes(vendorName)) {
      setSelectedVendors(selectedVendors.filter((v) => v !== vendorName))
    } else {
      setSelectedVendors([...selectedVendors, vendorName])
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call to create virtual card
    setTimeout(() => {
      setIsSubmitting(false)

      // Create a new card object
      const job = availableJobs.find((job) => job.id === selectedJob)
      if (!job) return

      const amount = Number.parseFloat(cardAmount) || job.depositAmount
      const cardId = Math.random().toString(36).substring(2, 10)
      const cardNumber = "4242 4242 4242 " + Math.floor(1000 + Math.random() * 9000).toString()
      const expiryDate = "06/25" // In a real app, this would be calculated

      setNewCard({
        id: cardId,
        jobId: job.id,
        jobName: job.jobName,
        customer: job.customer,
        vendor: selectedVendors.join(", "),
        cardNumber: cardNumber,
        expiryDate: "06/25", // In a real app, this would be calculated
        cvv: Math.floor(100 + Math.random() * 900).toString(), // Generate random 3-digit CVV
        billingZip: "94105", // Example billing zip
        issuedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        initialAmount: amount,
        remainingAmount: amount,
        status: "active",
        issuedTo: issuedTo,
        role: role,
      })

      setShowCardDialog(true)
      // Note: The router navigation happens when the dialog is closed in the DialogFooter
    }, 1500)
  }

  const handleTextCard = () => {
    if (!newCard) return

    const cardUrl = `${window.location.origin}/cards/${newCard.id}`

    const message = `JobVault Virtual Card Details:
Job: ${newCard.jobName}
Customer: ${newCard.customer}
Card #: ${newCard.cardNumber}
Funds: $${Number.parseFloat(cardAmount).toFixed(2)}
Vendor(s): ${newCard.vendor}
Expiration: ${newCard.expiryDate}
CVV: ${newCard.cvv}
Billing Zip: ${newCard.billingZip}
Issued To: ${newCard.issuedTo}
Role: ${newCard.role}

Card Link: ${cardUrl}

This is a materials-only card that can only be used at the specified vendors.

To submit receipts, text them to +18886395525`

    window.location.href = `sms:?&body=${encodeURIComponent(message)}`
  }

  const handleEmailCard = () => {
    if (!newCard) return

    const cardUrl = `${window.location.origin}/cards/${newCard.id}`

    const subject = "JobVault Virtual Card Details"
    const body = `JobVault Virtual Card Details:

Job: ${newCard.jobName}
Customer: ${newCard.customer}
Card #: ${newCard.cardNumber}
Funds: $${Number.parseFloat(cardAmount).toFixed(2)}
Vendor(s): ${newCard.vendor}
Expiration: ${newCard.expiryDate}
CVV: ${newCard.cvv}
Billing Zip: ${newCard.billingZip}
Issued To: ${newCard.issuedTo}
Role: ${newCard.role}

Card Link: ${cardUrl}

This is a materials-only card that can only be used at the specified vendors.

To submit receipts, text them to +18886395525

Thank you,
JobVault Team`

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleCopyLink = () => {
    if (!newCard) return

    const cardUrl = `${window.location.origin}/cards/${newCard.id}`
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

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Issue New Virtual Card</CardTitle>
              <CardDescription>Create a new materials-only virtual card for a job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="job" className="text-base">
                  Select Job
                </Label>
                <Select
                  value={selectedJob}
                  onValueChange={(value) => {
                    setSelectedJob(value)
                    // Pre-select vendors from the job
                    const job = availableJobs.find((job) => job.id === value)
                    if (job) {
                      setSelectedVendors(job.vendors)
                      setCardAmount(job.depositAmount.toString())
                    }
                  }}
                  required
                >
                  <SelectTrigger id="job" className="text-base py-6">
                    <SelectValue placeholder="Select a job with deposit paid" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.jobName} - {job.customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {jobDetails && (
                <div className="rounded-md bg-secondary p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{jobDetails.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit Amount:</span>
                    <span className="font-medium">${jobDetails.depositAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit Date:</span>
                    <span className="font-medium">{jobDetails.depositDate}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-base">Approved Vendors</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allVendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`vendor-${vendor.id}`}
                        checked={selectedVendors.includes(vendor.name)}
                        onChange={() => handleVendorChange(vendor.name)}
                        className="h-4 w-4 rounded border-gray-300 text-blue focus:ring-blue"
                      />
                      <Label htmlFor={`vendor-${vendor.id}`} className="text-sm font-normal">
                        {vendor.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVendors.map((vendor) => (
                    <Badge key={vendor} variant="secondary">
                      {vendor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="card-amount" className="text-base">
                  Card Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-5 text-muted-foreground text-base">$</span>
                  <Input
                    id="card-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    className="pl-7 text-base py-6 border-blue ring-1 ring-blue"
                    placeholder="Enter amount"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    required
                  />
                </div>
                {jobDetails && (
                  <p className="text-sm text-muted-foreground">
                    Maximum amount: ${jobDetails.depositAmount.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="issued-to" className="text-base">
                  Issued To
                </Label>
                <Input
                  id="issued-to"
                  placeholder="Full name of the person who will use this card"
                  className="text-base py-6"
                  value={issuedTo}
                  onChange={(e) => setIssuedTo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="role" className="text-base">
                  Role
                </Label>
                <Input
                  id="role"
                  placeholder="Role (e.g., Contractor, Foreman, Carpenter)"
                  className="text-base py-6"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

              <LegalNotice />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto text-base py-6 px-8"
                onClick={() => router.push("/cards")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue hover:bg-blue-dark text-base py-6 px-8"
                disabled={isSubmitting || !selectedJob || selectedVendors.length === 0 || !cardAmount}
              >
                {isSubmitting ? "Creating..." : "Issue Virtual Card"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Card Created Dialog */}
        {newCard && (
          <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Virtual Card Created</DialogTitle>
                <DialogDescription>Your virtual materials card has been issued successfully</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-dark to-blue p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs opacity-80">MATERIALS ONLY</div>
                      <div className="mt-4 text-xl font-bold">{newCard.cardNumber}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-sm font-medium">Vendor Locked</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-80">VALID THRU</div>
                      <div className="text-sm font-medium">{newCard.expiryDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80">AVAILABLE</div>
                      <div className="text-lg font-bold">${Number.parseFloat(cardAmount).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Job:</span>
                    <span className="font-medium">{newCard.jobName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{newCard.customer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vendor(s):</span>
                    <span className="font-medium">{newCard.vendor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CVV:</span>
                    <span className="font-medium">{newCard.cvv}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Billing Zip:</span>
                    <span className="font-medium">{newCard.billingZip}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issued Date:</span>
                    <span className="font-medium">{newCard.issuedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issued To:</span>
                    <span className="font-medium">{newCard.issuedTo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium">{newCard.role}</span>
                  </div>
                </div>

                <div className="rounded-md bg-blue/10 p-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-blue" />
                    <div>
                      <p className="font-medium">Materials-Only Card</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This card can only be used at the specified vendors for purchasing materials.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium mb-2">Share card details</div>
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
              </div>
              <DialogFooter>
                <Button
                  className="w-full bg-blue hover:bg-blue-dark"
                  onClick={() => {
                    setShowCardDialog(false)
                    router.push("/cards")
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  View All Cards
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
