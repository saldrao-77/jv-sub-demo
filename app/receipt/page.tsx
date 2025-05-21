"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ReceiptUploadForm } from "@/components/receipt-upload-form"
import { Header } from "@/components/header"

export default function ReceiptPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [jobName, setJobName] = useState("")

  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")
  const { user } = useAuth()

  // In a real app, you would fetch the job details based on jobId
  useEffect(() => {
    if (jobId) {
      // For demo purposes, set a job name based on jobId
      if (jobId === "1") {
        setJobName("Bathroom Renovation")
      } else if (jobId === "2") {
        setJobName("Kitchen Remodel")
      } else {
        setJobName(`Job #${jobId}`)
      }
    }
  }, [jobId])

  const handleSuccess = () => {
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-6 flex items-center justify-center">
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
                <p>Job: {jobName || "Not specified"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 max-w-md mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>Take a photo of your receipt or upload an existing image</CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptUploadForm jobId={jobId || undefined} onSuccess={handleSuccess} />
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground">
            <p>By submitting this receipt, you confirm that these materials were purchased for the specified job.</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
