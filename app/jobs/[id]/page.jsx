"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"

// Sample job data
const jobData = {
  id: "1",
  name: "Bathroom Renovation",
  customer: "Sarah Johnson",
  status: "in-progress",
  depositAmount: 850,
  totalAmount: 8500,
  description: "Complete renovation of master bathroom including new shower, bathtub, vanity, toilet, and tile work.",
}

export default function JobDetailPage({ params }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("JobDetailPage - params.id:", params.id)

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  function handleIssueNewCard() {
    console.log("Navigating to /issue-card with jobId:", params.id)
    // Use the most basic form of navigation
    window.location.href = "/issue-card?jobId=" + params.id
  }

  function handleSubmitReceipt() {
    console.log("Navigating to /receipt with jobId:", params.id)
    // Use the most basic form of navigation
    window.location.href = "/receipt?jobId=" + params.id
  }

  function goBack() {
    window.location.href = "/jobs"
  }

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="mb-6">
          <button
            onClick={goBack}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Jobs
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{jobData.name}</h1>
              <div className="flex items-center mt-1">
                <p className="text-muted-foreground">Job for {jobData.customer}</p>
                <span className="mx-2">•</span>
                <Badge className="bg-yellow-900/20 text-yellow-400">In Progress</Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{jobData.description}</p>
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
                    <p className="text-2xl font-bold">${jobData.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Deposit</h4>
                    <p className="text-2xl font-bold">${jobData.depositAmount.toFixed(2)}</p>
                    <Badge variant="outline" className="mt-1 bg-green-900/10 text-green-500">
                      Paid
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div>{jobData.customer}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={`/issue-card?jobId=${params.id}`} style={{ display: "block", width: "100%" }}>
                  <Button className="w-full bg-blue hover:bg-blue-dark">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Issue New Card
                  </Button>
                </a>

                <a href={`/receipt?jobId=${params.id}`} style={{ display: "block", width: "100%" }}>
                  <Button className="w-full bg-blue hover:bg-blue-dark">
                    <Receipt className="mr-2 h-4 w-4" />
                    Submit Receipt
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
