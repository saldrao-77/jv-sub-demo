"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, CreditCard, Receipt, ShieldCheck, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function JobStatusPage({ params }: { params: { id: string } }) {
  const [jobDetails, setJobDetails] = useState({
    id: params.id,
    customer: "Sarah Johnson",
    job: "Bathroom Renovation",
    address: "123 Oak St, San Francisco, CA",
    depositAmount: 850,
    spent: 0,
    vendors: ["Home Depot"],
    status: "Deposit paid",
    startDate: "May 15, 2025",
    progress: 33, // Progress percentage (0-100)
    timeline: [
      {
        id: "1",
        title: "Deposit Request Sent",
        description: "Request for materials deposit sent to customer",
        status: "completed",
        date: "May 15, 2025",
        time: "09:15 AM",
      },
      {
        id: "2",
        title: "Deposit Paid",
        description: "Customer paid the materials deposit",
        status: "completed",
        date: "May 18, 2025",
        time: "10:24 AM",
      },
      {
        id: "3",
        title: "Virtual Card Issued",
        description: "Virtual card issued for use at approved vendors",
        status: "pending",
        date: "Pending",
        time: "",
      },
      {
        id: "4",
        title: "Materials Purchased",
        description: "Materials purchased using the virtual card",
        status: "pending",
        date: "Pending",
        time: "",
      },
      {
        id: "5",
        title: "Receipt Submitted",
        description: "Receipt submitted for materials purchase",
        status: "pending",
        date: "Pending",
        time: "",
      },
    ],
    transactions: [
      {
        date: "May 18, 2025",
        type: "Deposit",
        amount: 850,
        vendor: "-",
        status: "Deposit paid",
      },
    ],
  })

  // In a real app, you would fetch job details based on the ID
  useEffect(() => {
    // This would be an API call in a real application
    console.log(`Fetching job status details for job ID: ${params.id}`)

    // For demo purposes, we're just using the hardcoded data
    // In a real app, you would do something like:
    // async function fetchJobDetails() {
    //   const response = await fetch(`/api/jobs/${params.id}/status`);
    //   const data = await response.json();
    //   setJobDetails(data);
    // }
    // fetchJobDetails();
  }, [params.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-400" />
      case "in-progress":
        return <Clock className="h-6 w-6 text-blue" />
      case "pending":
        return <Clock className="h-6 w-6 text-muted-foreground" />
      case "failed":
        return <AlertCircle className="h-6 w-6 text-red-400" />
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Deposit request sent":
        return (
          <Badge className="bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-400">{status}</Badge>
        )
      case "Deposit paid":
        return (
          <Badge className="bg-green-900/20 text-green-400 hover:bg-green-900/30 hover:text-green-400">{status}</Badge>
        )
      case "Card issued":
        return <Badge className="bg-blue/10 text-blue hover:bg-blue/20 hover:text-blue">{status}</Badge>
      case "Materials purchased":
        return (
          <Badge className="bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 hover:text-purple-400">
            {status}
          </Badge>
        )
      default:
        return <Badge className="bg-gray-900/20 text-gray-400 hover:bg-gray-900/30 hover:text-gray-400">{status}</Badge>
    }
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
          {/* Left Column - Status Overview */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{jobDetails.job}</h1>
              <div className="flex items-center mt-1">
                <p className="text-muted-foreground">Job for {jobDetails.customer}</p>
                <span className="mx-2">•</span>
                {getStatusBadge(jobDetails.status)}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Status</CardTitle>
                <CardDescription>Current status of this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{jobDetails.progress}%</span>
                  </div>
                  <Progress value={jobDetails.progress} className="h-2" />
                </div>

                <div className="rounded-md bg-blue/10 p-4">
                  <div className="flex">
                    <ShieldCheck className="h-5 w-5 text-blue mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Materials funds received for {jobDetails.job}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Funds can only be used at {jobDetails.vendors.join(", ")} and will expire in 30 days if unused.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="font-medium">Job Timeline</h3>

                  {jobDetails.timeline.map((item, index) => (
                    <div key={item.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            item.status === "completed"
                              ? "bg-green-900/20 text-green-400"
                              : item.status === "in-progress"
                                ? "bg-blue/10 text-blue"
                                : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {getStatusIcon(item.status)}
                        </div>
                        {index < jobDetails.timeline.length - 1 && (
                          <div
                            className={`h-full w-px ${item.status === "completed" ? "bg-green-400/50" : "bg-border"}`}
                          ></div>
                        )}
                      </div>
                      <div className="pb-8">
                        <div className="text-lg font-medium">{item.title}</div>
                        <div className="text-muted-foreground">
                          {item.status === "completed" || item.status === "in-progress"
                            ? `${item.date} • ${item.time}`
                            : "Pending"}
                        </div>
                        <div className="mt-2 text-sm">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions related to this job</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobDetails.transactions.map((transaction, idx) => (
                    <div key={idx} className="flex items-start p-3 rounded-md bg-secondary/50">
                      <div className="mr-4 flex-shrink-0">
                        {transaction.type === "Deposit" ? (
                          <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          </div>
                        ) : transaction.type === "Card Issued" ? (
                          <div className="h-10 w-10 rounded-full bg-blue/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-blue" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-900/20 flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-purple-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{transaction.type}</div>
                          <div className={transaction.amount < 0 ? "text-red-400" : "text-green-400"}>
                            {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        {transaction.vendor !== "-" && <div className="text-sm mt-1">Vendor: {transaction.vendor}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Customer</div>
                  <div>{jobDetails.customer}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Property Address</div>
                  <div>{jobDetails.address}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Job Started</div>
                  <div>{jobDetails.startDate}</div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Deposit Amount</div>
                  <div className="text-lg font-semibold">${jobDetails.depositAmount.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Spent</div>
                  <div className="text-lg font-semibold">${jobDetails.spent.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Available</div>
                  <div className="text-lg font-semibold text-blue">
                    ${(jobDetails.depositAmount - jobDetails.spent).toFixed(2)}
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Approved Vendors</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jobDetails.vendors.map((vendor) => (
                      <Badge key={vendor} variant="outline">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/jobs/${params.id}`}>View Full Job Details</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue hover:bg-blue-dark" disabled={jobDetails.status !== "Deposit paid"}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Issue Virtual Card
                </Button>
                <Button variant="outline" className="w-full" disabled={!jobDetails.spent}>
                  <Receipt className="mr-2 h-4 w-4" />
                  View Receipts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
