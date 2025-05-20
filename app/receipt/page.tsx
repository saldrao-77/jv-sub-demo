"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, ImageIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createTransaction } from "@/lib/actions"

export default function ReceiptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")

  const [isUploaded, setIsUploaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    jobId: jobId || "",
    vendorId: "",
    amount: "",
    description: "",
  })

  const handleUpload = () => {
    setIsUploaded(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.jobId) {
        throw new Error("Job ID is required")
      }

      if (!formData.amount || isNaN(Number.parseFloat(formData.amount))) {
        throw new Error("Valid amount is required")
      }

      const transaction = {
        job_id: formData.jobId,
        type: "expense",
        amount: Number.parseFloat(formData.amount),
        vendor_id: formData.vendorId || undefined,
        status: "completed",
        date: new Date().toISOString(),
        description: formData.description || "Receipt submitted",
      }

      const result = await createTransaction(transaction)

      if (!result) {
        throw new Error("Failed to create transaction")
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting receipt:", err)
      setError(err.message || "Failed to submit receipt")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
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
                <p>Amount: ${Number.parseFloat(formData.amount).toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-medium">Submit Receipt</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                <Label htmlFor="jobId">Job</Label>
                <Select
                  name="jobId"
                  value={formData.jobId}
                  onValueChange={(value) => handleSelectChange("jobId", value)}
                  required
                >
                  <SelectTrigger id="jobId">
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job-1">Bathroom Renovation</SelectItem>
                    <SelectItem value="job-2">Kitchen Remodel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorId">Vendor</Label>
                <Select
                  name="vendorId"
                  value={formData.vendorId}
                  onValueChange={(value) => handleSelectChange("vendorId", value)}
                >
                  <SelectTrigger id="vendorId">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor-1">Home Depot</SelectItem>
                    <SelectItem value="vendor-2">Lowe's</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Notes (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add any additional information about this purchase"
                  className="min-h-[80px]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue hover:bg-blue-dark"
                disabled={!isUploaded || isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Receipt"}
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
