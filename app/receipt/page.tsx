"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle2, ImageIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"

export default function ReceiptPage() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedJob, setSelectedJob] = useState("bathroom")
  const [receiptData, setReceiptData] = useState<any>(null)

  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")

  // Pre-select job if jobId is provided
  useEffect(() => {
    if (jobId) {
      // In a real app, you would fetch the job details and pre-select it
      console.log("Pre-selecting job with ID:", jobId)
      setSelectedJob("bathroom") // Assuming jobId 1 is bathroom renovation
    }
  }, [jobId])

  const handleUpload = () => {
    setIsUploaded(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would store the receipt in the database
    // For now, we'll just simulate storing it
    const formData = new FormData(e.target as HTMLFormElement)
    const job = formData.get("job") as string
    const notes = formData.get("notes") as string

    const newReceiptData = {
      job: job === "bathroom" ? "Bathroom Renovation" : "Kitchen Remodel",
      notes: notes,
      image: isUploaded ? "/store-receipt.png" : null,
      amount: 0, // Receipt with 0 transaction value as requested
      timestamp: new Date().toISOString(),
      vendor: "Home Depot",
      // Store under job transactions
      jobId: jobId || "1", // Use the prefilled jobId or default to "1"
      transactionType: "Receipt",
    }

    console.log("Receipt added to job transactions:", newReceiptData)
    setReceiptData(newReceiptData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-900/20">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <CardTitle className="text-xl">Receipt Submitted</CardTitle>
            <CardDescription>Your receipt has been successfully logged</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="rounded-lg bg-secondary p-4">
              <div className="text-sm text-muted-foreground">Confirmation Message</div>
              <div className="text-lg font-medium">✅ Receipt logged. Materials funds used as intended.</div>
            </div>
            <div className="space-y-1 text-sm">
              <p>Job: {receiptData?.job || "Bathroom Renovation"}</p>
              <p>Vendor: {receiptData?.vendor || "Home Depot"}</p>
              <p>Amount: ${receiptData?.amount || 0}.00</p>
              {receiptData?.notes && <p>Notes: {receiptData.notes}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border py-4">
        <div className="container flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-medium">Submit Receipt</h1>
        </div>
      </header>

      <main className="flex-1 container py-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>Take a photo of your receipt or upload an existing image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isUploaded ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary"
                  onClick={handleUpload}
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="font-medium">Click to upload receipt</p>
                  <p className="text-sm text-muted-foreground mt-1">Or drag and drop an image file</p>
                  <Input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-[4/5] bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/store-receipt.png" alt="Receipt" className="w-full h-full object-cover" />
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsUploaded(false)}>
                    Replace Image
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="job">Job</Label>
                <Select defaultValue={selectedJob} name="job">
                  <SelectTrigger id="job">
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                    <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any additional information about this purchase"
                  className="min-h-[80px]"
                />
              </div>

              <Button type="submit" className="w-full bg-blue hover:bg-blue-dark" disabled={!isUploaded}>
                <Send className="mr-2 h-4 w-4" />
                Submit Receipt
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground">
            <p>By submitting this receipt, you confirm that these materials were purchased for the specified job.</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
