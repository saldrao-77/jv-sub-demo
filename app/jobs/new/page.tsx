"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LegalNotice } from "@/components/legal-notice"
import { Header } from "@/components/header"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function NewJobPage() {
  const router = useRouter()
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [otherVendor, setOtherVendor] = useState("")
  const [showOtherVendor, setShowOtherVendor] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [paymentLink, setPaymentLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const handleAddVendor = (vendor: string) => {
    if (vendor === "other") {
      setShowOtherVendor(true)
      return
    }

    if (!selectedVendors.includes(vendor)) {
      setSelectedVendors([...selectedVendors, vendor])
    }
  }

  const handleRemoveVendor = (vendor: string) => {
    setSelectedVendors(selectedVendors.filter((v) => v !== vendor))
  }

  const handleAddOtherVendor = () => {
    if (otherVendor && !selectedVendors.includes(otherVendor)) {
      setSelectedVendors([...selectedVendors, otherVendor])
      setOtherVendor("")
      setShowOtherVendor(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call to create job and generate payment link
    setTimeout(() => {
      setIsSubmitting(false)
      // Generate a random payment link that points to the actual payment page
      const randomId = Math.random().toString(36).substring(2, 10)
      // Make sure this points to the correct URL structure for your updated payment page
      setPaymentLink(`${window.location.origin}/payment/${randomId}`)
      setShowShareDialog(true)
    }, 1500)
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
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
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

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Enter the details for this materials deposit request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="customer-name" className="text-base">
                    Customer Name
                  </Label>
                  <Input id="customer-name" placeholder="John Smith" required className="text-base py-6" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="job-name" className="text-base">
                    Job Name
                  </Label>
                  <Input id="job-name" placeholder="Kitchen Remodel" required className="text-base py-6" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="customer-email" className="text-base">
                    Customer Email
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="customer@example.com"
                    required
                    className="text-base py-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="customer-phone" className="text-base">
                    Customer Phone
                  </Label>
                  <Input
                    id="customer-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                    className="text-base py-6"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="property-address" className="text-base">
                    Property Address
                  </Label>
                  <Input
                    id="property-address"
                    placeholder="123 Main St, City, State"
                    required
                    className="text-base py-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="created-date" className="text-base">
                    Created Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-base py-6",
                          !date && "text-muted-foreground",
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="deposit-amount" className="text-base">
                    Materials Deposit Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-5 text-muted-foreground text-base">$</span>
                    <Input
                      id="deposit-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      className="pl-7 text-base py-6 border-blue ring-1 ring-blue"
                      placeholder="1000"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base">Approved Vendors</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedVendors.map((vendor) => (
                      <Badge key={vendor} variant="secondary" className="flex items-center gap-1 text-base py-2 px-3">
                        {vendor}
                        <X className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleRemoveVendor(vendor)} />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={handleAddVendor}>
                    <SelectTrigger className="text-base py-6">
                      <SelectValue placeholder="Select vendors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home-depot">Home Depot</SelectItem>
                      <SelectItem value="lowes">Lowe's</SelectItem>
                      <SelectItem value="ace">Ace Hardware</SelectItem>
                      <SelectItem value="menards">Menards</SelectItem>
                      <SelectItem value="other">Other (specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showOtherVendor && (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="Enter vendor name"
                        value={otherVendor}
                        onChange={(e) => setOtherVendor(e.target.value)}
                        className="text-base py-6"
                      />
                      <Button type="button" size="sm" onClick={handleAddOtherVendor}>
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base">
                  Notes for Customer (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Covers materials only—labor billed separately"
                  className="min-h-[100px] text-base"
                />
              </div>

              <LegalNotice />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto text-base py-6 px-8"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue hover:bg-blue-dark text-base py-6 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Generate Secure Payment Link"}
              </Button>
            </CardFooter>
          </form>
        </Card>

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
                  onClick={() => {
                    setShowShareDialog(false)
                    router.push("/dashboard")
                  }}
                >
                  Return to Dashboard
                </Button>
                <Button type="button" className="bg-blue hover:bg-blue-dark" onClick={() => setShowShareDialog(false)}>
                  Done
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
